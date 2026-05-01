# Phase 2 — 백엔드 확장

> **역할**: Phase 2 각 Task의 시그니처/테스트/검증. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **원칙**: **응답 확장만**, 기존 시그니처 유지 → 프론트가 깨지지 않은 채로 배포 가능.

---

## P2-T1 · `Corner` enum + `CornerMapper`

**신규** `menu/domain/Corner.java`
```java
public enum Corner { KOREAN, WESTERN, SNACK, SPECIAL }
```

**신규** `menu/domain/CornerMapper.java`
```java
@Slf4j
public final class CornerMapper {
    private static final Map<String, Corner> MAP = Map.of(
        "한식", Corner.KOREAN,
        "양식", Corner.WESTERN,
        "분식", Corner.SNACK,
        "일품", Corner.SPECIAL
    );
    public static Corner fromString(String raw) {
        Corner c = MAP.get(raw == null ? "" : raw.trim());
        if (c == null) {
            log.warn("Unknown corner '{}', falling back to KOREAN", raw);
            return Corner.KOREAN;
        }
        return c;
    }
}
```

**테스트** `CornerMapperTest`
- 각 매핑 4건
- null/빈 문자열 → KOREAN + WARN
- "기타" → KOREAN + WARN

**소요**: 1시간 / **위험**: 낮음

---

## P2-T2 · `BadgeTier` enum (D1 임계값)

**신규** `user/domain/BadgeTier.java`
```java
public enum BadgeTier {
    NONE, BRONZE, SILVER, GOLD;

    public static BadgeTier of(long reviewCount) {
        if (reviewCount >= 30) return GOLD;
        if (reviewCount >= 5)  return SILVER;
        if (reviewCount >= 1)  return BRONZE;
        return NONE;
    }
}
```

**테스트** `BadgeTierTest` — 경계값 0/1/4/5/29/30

**소요**: 30분 / **위험**: 낮음

---

## P2-T3 · `MenuTier` enum (메뉴 메달, 신규)

**신규** `menu/domain/MenuTier.java`
```java
public enum MenuTier {
    GOLD, SILVER, BRONZE;

    public static MenuTier of(Double avgOverall, long reviewCount) {
        if (avgOverall == null) return null;
        if (avgOverall >= 4.5 && reviewCount >= 20) return GOLD;
        if (avgOverall >= 4.0 && reviewCount >= 10) return SILVER;
        if (avgOverall >= 3.5 && reviewCount >= 5)  return BRONZE;
        return null;
    }
}
```

**테스트** `MenuTierTest` — 경계값 8건 (각 등급 안/밖, null 입력)

**소요**: 30분 / **위험**: 낮음

---

## P2-T4 · 리뷰 CUD → `Menu` 집계 캐시 갱신

**수정** `review/service/ReviewService.java`
```java
@Transactional
public ReviewResponse create(...) {
    Review saved = reviewRepository.save(...);
    recomputeMenuStats(saved.getMenu().getId());
    return toResponse(saved);
}
// update / delete도 동일하게 트랜잭션 내에서 호출

private void recomputeMenuStats(Long menuId) {
    var agg = reviewRepository.aggregateByMenuId(menuId);  // record(avgT, avgA, avgV, count)
    Menu menu = menuRepository.findById(menuId).orElseThrow();
    menu.applyStats(agg.avgT(), agg.avgA(), agg.avgV(), agg.count());
}
```

**Repository** `review/repository/ReviewRepository.java` — 신규 JPQL
```java
record MenuStatAgg(Double avgT, Double avgA, Double avgV, long count) {}

@Query("""
  SELECT new com.sungkyul.cafeteria.review.repository.MenuStatAgg(
    AVG(r.tasteRating), AVG(r.amountRating), AVG(r.valueRating), COUNT(r)
  )
  FROM Review r WHERE r.menu.id = :menuId
""")
MenuStatAgg aggregateByMenuId(@Param("menuId") Long menuId);
```

**Entity** `menu/entity/Menu.java`
```java
public void applyStats(Double avgT, Double avgA, Double avgV, long count) {
    this.avgTaste = avgT;
    this.avgAmount = avgA;
    this.avgValue = avgV;
    this.avgOverall = (avgT == null) ? null : (avgT + avgA + avgV) / 3.0;
    this.reviewCount = (int) count;
}
```

**테스트** `ReviewServiceTest` — "리뷰 작성 → menu.avgOverall/reviewCount 갱신" 케이스 추가

**검증**:
- 리뷰 0건 메뉴에 1건 작성 → `avg_overall = (taste+amount+value)/3`, `review_count = 1`
- 마지막 리뷰 삭제 → 모든 avg null, count 0

**소요**: 1.5시간 / **위험**: 중간 (트랜잭션 경계)

---

## P2-T5 · `MenuResponse` 확장

**수정** `menu/dto/MenuResponse.java` — 새 필드 **추가**, 기존 `averageRating/reviewCount` **유지**

```java
public record MenuResponse(
    Long id, String name, String corner,
    Double averageRating,                 // = avgOverall, 기존 호환
    Integer reviewCount,                  // 기존 호환

    // 신규
    MenuTier tier,
    Boolean isNew,
    LocalDate firstSeenAt,
    Double avgTaste, Double avgAmount, Double avgValue, Double avgOverall
) {
    public static MenuResponse from(Menu m) {
        boolean isNew = m.getFirstSeenAt() != null
            && !m.getFirstSeenAt().isBefore(LocalDate.now().minusDays(7));
        return new MenuResponse(
            m.getId(), m.getName(), m.getCorner(),
            m.getAvgOverall(), m.getReviewCount(),
            MenuTier.of(m.getAvgOverall(), m.getReviewCount()),
            isNew, m.getFirstSeenAt(),
            m.getAvgTaste(), m.getAvgAmount(), m.getAvgValue(), m.getAvgOverall()
        );
    }
}
```

> `MenuService` 내부의 기존 `findAggregated` JPQL은 더 이상 상관 서브쿼리로 평균을 계산할 필요가 없다. 캐시 컬럼을 그대로 SELECT. (선택) JPQL 단순화는 별도 Task 또는 P2-T7과 병합.

**검증**: `curl /api/v1/menus/today` 응답에 신규 필드 노출 + 기존 `averageRating` 동일값

**소요**: 1시간 / **위험**: 낮음

---

## P2-T6 · `GET /menus?scope=all|reviewed`

**Controller** `MenuController.getMenus(sort, corner, scope = "reviewed")`

**Service**:
```java
List<MenuResponse> result = menuRepository.findAggregated(corner)
    .stream()
    .map(MenuResponse::from)
    .filter(r -> "all".equalsIgnoreCase(scope) || r.reviewCount() > 0)
    .sorted(comparatorFor(sort))
    .toList();
```

**검증**: `curl '/menus?scope=all'`로 reviewCount=0 메뉴도 반환

**소요**: 30분 / **위험**: 낮음

---

## P2-T7 · `GET /menus/best` (TOP 5)

**Repository** `menu/repository/MenuRepository.java`

```java
@Query("""
  SELECT m FROM Menu m
  JOIN MenuDate md ON md.menu = m
  WHERE md.servedDate BETWEEN :monday AND :sunday
    AND m.reviewCount >= :minReviews
  GROUP BY m
  ORDER BY m.avgOverall DESC NULLS LAST
""")
List<Menu> findBestOfWeek(LocalDate monday, LocalDate sunday, long minReviews, Pageable pageable);
```

**Service**:
```java
public List<MenuResponse> getBestOfWeek() {
    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(DayOfWeek.MONDAY);
    LocalDate sunday = monday.plusDays(6);
    return menuRepository.findBestOfWeek(monday, sunday, 3, PageRequest.of(0, 5))
        .stream().map(MenuResponse::from).toList();
}
```

**Controller**: `GET /menus/best`

**검증**: 시드 데이터(리뷰 2건/3건/5건 메뉴 섞음) → 응답에 2건 메뉴 제외, 정렬 순서 정확

**소요**: 1.5시간 / **위험**: 중간

---

## P2-T8 · `GET /menus/today?slot=LUNCH`

**Controller**: `getTodayMenus(@RequestParam(defaultValue="LUNCH") String slot, ...)`

**Service**: `MenuDateRepository`에 `findByServedDateAndMealSlotFetchMenu(LocalDate, String)` 추가

**검증**: `curl '/menus/today?slot=LUNCH'` 정상, `?slot=DINNER` 빈 배열

**소요**: 45분 / **위험**: 낮음

---

## P2-T9 · `Review*Request`에 `photoUrls` 추가

**수정** `review/dto/ReviewRequest.java`, `ReviewUpdateRequest.java`

```java
@Size(max = 3, message = "사진은 최대 3장까지 첨부할 수 있습니다")
private List<@URL String> photoUrls = List.of();

// 기존 imageUrl 필드는 deprecated 표시로 유지 (호환)
@Deprecated
@Size(max = 500)
private String imageUrl;
```

**Service**: `photoUrls`가 비어있고 `imageUrl`이 있으면 `List.of(imageUrl)`로 wrap해서 저장. 둘 다 있으면 `photoUrls` 우선.

**검증**: 두 형식 모두 정상 저장되는 통합 테스트 (단일 imageUrl 요청 + 배열 요청)

**소요**: 1시간 / **위험**: 중간

---

## P2-T10 · `ReviewResponse`에 `photoUrls`, `authorBadgeTier`

**수정** `review/dto/ReviewResponse.java`
```java
public record ReviewResponse(
    Long id, Long menuId, Long userId, String authorNickname, String authorAvatarColor,
    BadgeTier authorBadgeTier,           // 신규
    Integer tasteRating, Integer amountRating, Integer valueRating,
    String comment,
    List<String> photoUrls,              // 신규
    @Deprecated String imageUrl,         // 호환 유지 (Phase 5에서 제거)
    Boolean isMine,
    LocalDateTime createdAt, LocalDateTime updatedAt
) {}
```

**Service**: 리뷰 목록 조회 시 N+1 방지
```java
// userId → reviewCount 배치 조회
Map<Long, Long> countMap = reviewRepository.countByUserIdIn(userIds);
// 응답 매핑 시 BadgeTier.of(countMap.getOrDefault(uid, 0))
```

**검증**: `curl /reviews?menuId=1` → `photoUrls` 배열 + `authorBadgeTier` 노출. Hibernate stats로 쿼리 수 일정.

**소요**: 1.5시간 / **위험**: 중간 (배치 조회)

---

## P2-T11 · `UserResponse` / `AuthService.getMe` 확장

**수정** `auth/dto/UserResponse.java`
```java
public record UserResponse(
    Long id, String email, String nickname, String profileImage,
    Boolean isNicknameSet,
    String avatarColor,                  // 신규
    Long reviewCount,                    // 신규
    Double avgRating,                    // 신규 (내가 쓴 리뷰들의 overall 평균)
    Long badgeCount,                     // 신규 (메달 받은 메뉴 리뷰 수 등 — 정의 서비스에서 결정)
    BadgeTier badgeTier,                 // 신규
    Integer nextTarget,                  // 신규 (다음 등급까지 목표)
    Integer remaining                    // 신규 (남은 리뷰 수)
) {}
```

**Service** `AuthService.getMe(userId)`
```java
long count = reviewRepository.countByUserId(userId);
Double avg = reviewRepository.findAvgOverallByUserId(userId);  // null 가능
int next = nextTarget(count);            // 5/30/100 단계
int remaining = Math.max(0, next - (int) count);
return new UserResponse(..., BadgeTier.of(count), next, remaining);

private int nextTarget(long count) {
    if (count < 5) return 5;
    if (count < 30) return 30;
    return 100;
}
```

**검증**: `curl /auth/me` 응답에 모든 신규 필드

**소요**: 1시간 / **위험**: 낮음

---

## P2-T12 · 닉네임 30일 쿨다운

**마이그레이션 추가** `V12__add_users_nickname_changed_at.sql`
```sql
ALTER TABLE users ADD COLUMN nickname_changed_at TIMESTAMP;
-- 백필 (이미 nickname을 설정한 사용자는 created_at으로 채움)
UPDATE users SET nickname_changed_at = created_at WHERE is_nickname_set = true;
```

**Entity** `User.changeNickname(String newNick)` — 30일 미경과 시 `IllegalStateException` 던짐

```java
public void changeNickname(String newNickname) {
    if (this.nicknameChangedAt != null
        && Duration.between(this.nicknameChangedAt, LocalDateTime.now()).toDays() < 30) {
        throw new IllegalStateException("닉네임은 30일에 한 번만 변경할 수 있습니다");
    }
    this.nickname = newNickname;
    this.isNicknameSet = true;
    this.nicknameChangedAt = LocalDateTime.now();
}
```

**검증**:
- 변경 직후 재변경 시도 → 409 with "30일에 한 번..."
- 31일 후(시계 조작 또는 SQL UPDATE) 재변경 → 200

**소요**: 1시간 / **위험**: 낮음

---

## P2-T13 · `POST /api/cron/crawl` (cron-secret 인증)

**신규** `cron/controller/CronController.java`
```java
@RestController
@RequestMapping("/api/cron")
public class CronController {
    @Value("${cron.secret}") private String cronSecret;
    private final MenuCrawlerService crawler;

    @PostMapping("/crawl")
    public CrawlingResult crawl(@RequestHeader("X-Cron-Secret") String secret) {
        if (!cronSecret.equals(secret)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return crawler.crawlAndSave();
    }
}
```

**application.yml**:
```yaml
cron:
  secret: ${CRON_SECRET:dev-only-do-not-use-in-prod}
```

**SecurityConfig**: `/api/cron/**` permitAll (서명 자체가 인증)

**검증**:
- 헤더 없이 `POST /api/cron/crawl` → 401
- 헤더 일치 → 200 + CrawlingResult
- 기존 `/admin/crawl`은 그대로 유지 (수동 트리거)

**소요**: 45분 / **위험**: 낮음

---

## P2-T14 · 크롤러 `meal_slot=LUNCH` 명시 + Corner 매핑

**수정** `crawler/service/MenuCrawlerService.java`

- `MenuDate` 저장 시 `mealSlot = "LUNCH"` 명시 (필드 추가, V9 컬럼과 매핑)
- corner 문자열은 그대로 DB 저장하되, **응답 매핑** 시 `CornerMapper.fromString`로 변환 (P2-T1)
- (사이드 픽스) `splitByBr` 메서드의 `cell.select("br").before("\\n")` 리터럴 버그 수정:
  ```java
  cell.select("br").before("\n");   // 리터럴 \n이 아니라 실제 개행
  ```

**테스트** `MenuCrawlerServiceTest`
- 기존 7케이스 통과
- 신규: corner "한식" → DB INSERT 성공, `Menu.getCornerEnum()` → `Corner.KOREAN`

**소요**: 45분 / **위험**: 중간

---

## P2-T15 · GlobalExceptionHandler 정정

**수정** `common/exception/GlobalExceptionHandler.java`

```java
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException e) {
    return ResponseEntity.badRequest()
        .body(new ErrorResponse(400, e.getMessage()));
}

// 권한 부족은 별도
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleForbidden(AccessDeniedException e) {
    return ResponseEntity.status(403)
        .body(new ErrorResponse(403, "권한이 없습니다"));
}
```

**검증**: 잘못된 별점(`taste=0` 등) 요청 → 400, 다른 사용자 리뷰 수정 → 403

**소요**: 30분 / **위험**: 낮음

---

## Phase 2 게이트

- `./gradlew test` 전체 통과
- Render 배포 → Postman 컬렉션 스모크 (모든 신규 엔드포인트 + 기존 엔드포인트 회귀)
- 이번 시점엔 프론트가 깨지지 않아야 한다 (확장만, 기존 시그니처 유지). 깨지면 Phase 2 작업 누락.
