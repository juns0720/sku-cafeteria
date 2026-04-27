# Phase D — 사진 업로드 (별도 트랙)

> **역할**: Cloudinary presigned 다중 파일 업로드 + 리뷰 이미지 UX. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **선행**: P1-T3(photo_urls 컬럼), Phase 4 완료(특히 P4-T9 ReviewWritePage).
> **독립성**: Phase 4 이후 언제든 붙일 수 있다.

---

## PD-T1 · BE Cloudinary 빈 + 다중 파일 서명 API

### `backend/build.gradle`
```gradle
implementation 'com.cloudinary:cloudinary-http44:1.36.0'
```

### `backend/src/main/resources/application.yml`
```yaml
cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME:}
  api-key: ${CLOUDINARY_API_KEY:}
  api-secret: ${CLOUDINARY_API_SECRET:}
```

### 신규 `common/upload/CloudinaryConfig.java`
```java
@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary(
        @Value("${cloudinary.cloud-name}") String cloudName,
        @Value("${cloudinary.api-key}") String apiKey,
        @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }
}
```

### 신규 `review/controller/ReviewImageController.java`
```java
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewImageController {

    private final Cloudinary cloudinary;

    @GetMapping("/upload-signature")
    public UploadSignatureResponse getUploadSignature() {
        long timestamp = System.currentTimeMillis() / 1000;
        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);
        params.put("folder", "reviews");
        params.put("allowed_formats", "jpg,jpeg,png,webp");
        params.put("max_file_size", 5_242_880);   // 5MB / 파일
        params.put("resource_type", "image");

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        return new UploadSignatureResponse(
            signature, timestamp,
            cloudinary.config.apiKey, cloudinary.config.cloudName,
            "reviews", "jpg,jpeg,png,webp", 5_242_880, "image"
        );
    }
}
```

### 신규 `review/dto/UploadSignatureResponse.java`
```java
public record UploadSignatureResponse(
    String signature, long timestamp,
    String apiKey, String cloudName,
    String folder, String allowedFormats, long maxFileSize, String resourceType
) {}
```

### `common/config/SecurityConfig.java` 수정
```java
.requestMatchers(HttpMethod.GET, "/api/v1/reviews/upload-signature").authenticated()
.requestMatchers(HttpMethod.GET, "/api/v1/reviews/**").permitAll()
```

### ⚠️ 서명에 파라미터를 묶는 이유
Cloudinary는 **서명된 파라미터만 신뢰**한다. `allowed_formats`/`max_file_size`를 서명에 포함하면 클라이언트가 값을 바꿔도 서명 불일치로 거부된다. 프론트 선검증은 UX용.

### 다중 파일?
프론트가 동일 서명을 가지고 **여러 번 업로드**하면 된다(같은 timestamp/folder/policy). 서버는 1회 서명만 발급해도 0~3장을 처리할 수 있다. 1장당 별도 서명이 필요하면 클라이언트가 N번 호출.

### 검증

- Postman으로 서명 발급 → curl로 정상 이미지 업로드 → 200
- 6MB 파일 → Cloudinary 거부(400)
- PDF → allowed_formats 위반
- 인증 없이 `/upload-signature` → 401

**소요**: 2시간 / **위험**: 중간

---

## PD-T2 · Render 환경변수 + 재배포

Render 대시보드 > Environment:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

저장 후 Render 자동 재배포 → `GET /api/v1/reviews/upload-signature` 헬스체크.

**검증**: 실제 Cloudinary 계정으로 end-to-end 업로드 확인

**소요**: 20분 / **위험**: 낮음

---

## PD-T3 · FE 첨부 UX (photoUrls 0~3장)

### 신규 `frontend/src/api/upload.js`
```js
import client from './client';

export async function getUploadSignature() {
  const { data } = await client.get('/reviews/upload-signature');
  return data;
}

export async function uploadToCloudinary(file, sig) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', sig.apiKey);
  fd.append('timestamp', sig.timestamp);
  fd.append('signature', sig.signature);
  fd.append('folder', sig.folder);
  fd.append('allowed_formats', sig.allowedFormats);
  fd.append('max_file_size', sig.maxFileSize);
  fd.append('resource_type', sig.resourceType);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: fd }
  );
  if (!res.ok) throw new Error('업로드 실패');
  return res.json(); // { secure_url, public_id, ... }
}

// 0~3장 일괄 업로드 — 단일 서명 재사용
export async function uploadFiles(files /* File[] */) {
  if (!files.length) return [];
  const sig = await getUploadSignature();
  const results = await Promise.allSettled(files.map(f => uploadToCloudinary(f, sig)));
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value.secure_url);
}
```

### 수정 `frontend/src/pages/ReviewWritePage.jsx`
- 사진 첨부 칸 (최대 3장)
- 선검증 (UX용, 서버 서명이 최종 방어선):
  - 5MB 초과 → 에러 Toast
  - `type.startsWith('image/')` 아니면 거부
  - 4번째 추가 시도 → "최대 3장" 안내
- 썸네일 프리뷰 (`URL.createObjectURL`)
- 등록 버튼 클릭 시:
  1. `uploadFiles(files)` → photoUrls 배열
  2. `createReview({ ..., photoUrls })`
  3. 일부 업로드 실패 → "사진 N장은 업로드 실패. 그래도 등록할까요?" 확인

### 수정 `frontend/src/pages/MenuDetailPage.jsx` 또는 `components/hi/ReviewItem.jsx`
- `photoUrls`가 있으면 썸네일 grid (3장까지)
- 클릭 → 라이트박스 (`createPortal` 풀스크린 오버레이 + 이미지)
- ESC / 탭으로 닫기

### 검증 시나리오
1. 정상 이미지 1~3장 → 썸네일 프리뷰 → 등록 → 리뷰에 썸네일 → 클릭 라이트박스
2. 6MB 파일 → 클라이언트 에러
3. PDF → 클라이언트 에러
4. 4장 시도 → 안내
5. 일부 업로드 실패 → 폴백 confirm
6. 네트워크 전체 실패 → 사진 없이 등록 가능

**소요**: 4시간 / **위험**: 중간
