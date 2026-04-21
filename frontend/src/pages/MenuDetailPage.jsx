import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getMenuById } from '../api/menus'
import { deleteReview, getReviews } from '../api/reviews'
import AxisBar from '../components/hi/AxisBar'
import Card from '../components/hi/Card'
import EmptyState from '../components/hi/EmptyState'
import FoodIllust from '../components/hi/FoodIllust'
import Icon from '../components/hi/Icon'
import MedalSticker from '../components/hi/MedalSticker'
import MultiStarSummary from '../components/hi/MultiStarSummary'
import Pill from '../components/hi/Pill'
import useToast from '../hooks/useToast.jsx'

const BADGE_EMOJI = {
  GOLD: '🥇',
  SILVER: '🥈',
  BRONZE: '🥉',
  NONE: '🌱',
}

function toDate(value) {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (matched) {
      const [, year, month, day] = matched
      return new Date(Number(year), Number(month) - 1, Number(day), 12)
    }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function formatServedDate(value) {
  const date = toDate(value)
  if (!date) {
    return '최근 제공일 정보 없음'
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 제공`
}

function formatReviewDate(value) {
  const date = toDate(value)
  if (!date) {
    return ''
  }

  return `${date.getMonth() + 1}.${date.getDate()} 작성`
}

function getIllustrationProps(corner) {
  const normalized = corner?.toLowerCase?.() ?? ''

  if (normalized.includes('한식') || normalized.includes('국')) {
    return { kind: 'soup', bg: '#FCE3C9' }
  }

  if (normalized.includes('양식') || normalized.includes('western')) {
    return { kind: 'bowl', bg: '#FBE6A6' }
  }

  if (normalized.includes('분식') || normalized.includes('snack')) {
    return { kind: 'bowl', bg: '#F6C7A8' }
  }

  if (normalized.includes('일품') || normalized.includes('특식') || normalized.includes('special')) {
    return { kind: 'chop', bg: '#CDE5C8' }
  }

  return { kind: 'bowl', bg: '#F4ECDC' }
}

function DetailSkeleton() {
  return (
    <div className="animate-fadeInUp">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5">
        <div className="h-10 w-24 rounded-full bg-paperDeep shimmer-bg" />
        <div className="h-56 rounded-[32px] bg-paperDeep shimmer-bg" />
        <div className="h-40 rounded-[28px] bg-paperDeep shimmer-bg" />
        <div className="h-24 rounded-[28px] bg-paperDeep shimmer-bg" />
        <div className="h-36 rounded-[28px] bg-paperDeep shimmer-bg" />
      </div>
    </div>
  )
}

function ReviewCard({ review, onDelete, isDeleting }) {
  const badgeEmoji = BADGE_EMOJI[review.authorBadgeTier] ?? BADGE_EMOJI.NONE
  const photoUrls = review.photoUrls?.filter(Boolean) ?? []

  return (
    <Card bg="#FFFFFF" style={{ padding: '16px 16px 14px', borderRadius: 28 }}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full border border-ink bg-paper shadow-card">
          {review.userProfileImage ? (
            <img
              src={review.userProfileImage}
              alt={review.userNickname}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-disp text-base text-ink">
              {review.userNickname?.[0] ?? '?'}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate font-disp text-[1.05rem] leading-none text-ink">
                  {review.userNickname}
                </div>
                <span className="font-hand text-sm text-inkSoft" aria-label={review.authorBadgeTier ?? 'NONE'}>
                  {badgeEmoji}
                </span>
              </div>
              <div className="mt-2 font-hand text-xs text-mute">
                {formatReviewDate(review.createdAt)}
              </div>
            </div>

            <div className="rounded-full border border-rule bg-paper px-2.5 py-1 font-hand text-xs text-inkSoft">
              평균 {Number(review.overall).toFixed(1)}
            </div>
          </div>

          <div className="mt-4">
            <MultiStarSummary
              taste={review.taste}
              amount={review.amount}
              value={review.value}
            />
          </div>

          <p className="mt-3 whitespace-pre-line font-hand text-sm leading-6 text-inkSoft">
            {review.comment?.trim() || '한 마디는 비워뒀어요'}
          </p>

          {photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => {
                const photoUrl = photoUrls[index]
                return (
                  <div
                    key={`${review.id}-photo-${index}`}
                    className={`aspect-square overflow-hidden rounded-[18px] border border-rule ${
                      photoUrl ? 'bg-paper' : 'border-dashed bg-paperDeep/50'
                    }`}
                  >
                    {photoUrl && (
                      <img
                        src={photoUrl}
                        alt={`${review.userNickname} 리뷰 사진 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {review.isMine && (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                disabled
                className="rounded-full border border-rule bg-paper px-3 py-1.5 font-hand text-xs text-mute opacity-60"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete(review.id)}
                disabled={isDeleting}
                className="rounded-full border border-red bg-white px-3 py-1.5 font-hand text-xs text-red transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function MenuDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()
  const { showToast, ToastComponent } = useToast()
  const menuId = Number(params.id)
  const isValidMenuId = Number.isInteger(menuId) && menuId > 0
  const {
    data: menu,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useQuery({
    queryKey: ['menus', menuId],
    queryFn: () => getMenuById(menuId),
    enabled: isValidMenuId,
  })
  const {
    data: reviewPage,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ['reviews', menuId],
    queryFn: () => getReviews(menuId),
    enabled: isValidMenuId,
  })

  const reviews = reviewPage?.content ?? []
  const myReview = reviews.find((review) => review.isMine)
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['menus'] }),
        queryClient.invalidateQueries({ queryKey: ['reviews', menuId] }),
        queryClient.invalidateQueries({ queryKey: ['reviews', 'me'] }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      ])
      showToast('리뷰가 삭제되었습니다', 'success')
    },
    onError: (error) => {
      showToast(error.response?.data?.message ?? '리뷰 삭제에 실패했습니다', 'error')
    },
  })

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm('리뷰를 삭제할까요?')) {
      return
    }

    deleteMutation.mutate(reviewId)
  }

  if (!isValidMenuId) {
    return (
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 animate-fadeInUp">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-hand text-sm text-ink shadow-card"
        >
          <Icon name="chevL" size={18} color="#2B2218" />
          뒤로
        </button>

        <Card bg="#FFFFFF" style={{ padding: '24px 20px', borderRadius: 28 }}>
          <p className="font-disp text-lg leading-none text-ink">잘못된 메뉴 경로예요</p>
          <p className="mt-3 font-hand text-sm leading-6 text-mute">
            메뉴 목록에서 다시 선택해 주세요.
          </p>
        </Card>
      </div>
    )
  }

  if (isMenuLoading) {
    return <DetailSkeleton />
  }

  if (isMenuError || !menu) {
    return (
      <>
        {ToastComponent}
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 animate-fadeInUp">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-hand text-sm text-ink shadow-card"
          >
            <Icon name="chevL" size={18} color="#2B2218" />
            뒤로
          </button>

          <Card bg="#FFFFFF" style={{ padding: '24px 20px', borderRadius: 28 }}>
            <p className="font-disp text-lg leading-none text-ink">메뉴를 불러오지 못했어요</p>
            <p className="mt-3 font-hand text-sm leading-6 text-red">
              잠시 후 다시 시도해 주세요.
            </p>
          </Card>
        </div>
      </>
    )
  }

  const illust = getIllustrationProps(menu.corner)
  const hasAggregate = menu.avgTaste != null && menu.avgAmount != null && menu.avgValue != null
  const ctaLabel = myReview ? '리뷰 수정' : '리뷰 쓰기 →'

  return (
    <>
      {ToastComponent}

      <div className="animate-fadeInUp">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 pb-28">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-hand text-sm text-ink shadow-card transition-transform active:scale-[0.98]"
          >
            <Icon name="chevL" size={18} color="#2B2218" />
            뒤로
          </button>

          <Card bg="#FFFFFF" style={{ padding: '22px 20px', borderRadius: 32 }}>
            <div className="flex flex-col items-center text-center">
              <FoodIllust kind={illust.kind} size={118} bg={illust.bg} />

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <MedalSticker tier={menu.tier} size={24} />
                {menu.isNew && (
                  <Pill
                    bg="#EF8A3D"
                    color="#FFFFFF"
                    border="#EF8A3D"
                    style={{ fontSize: 11, padding: '2px 9px' }}
                  >
                    NEW
                  </Pill>
                )}
                <span className="rounded-full border border-rule bg-paper px-3 py-1 font-hand text-xs text-inkSoft">
                  {menu.corner || '기타'}
                </span>
              </div>

              <h1 className="mt-4 font-disp text-[2rem] leading-none text-ink">{menu.name}</h1>
              <p className="mt-3 font-hand text-sm text-inkSoft">{formatServedDate(menu.servedDate)}</p>

              <div className="mt-5 flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-2">
                <span className="font-hand text-xs text-mute">리뷰</span>
                <span className="font-disp text-base leading-none text-ink">{menu.reviewCount ?? 0}</span>
                <span className="font-hand text-xs text-mute">개</span>
                <span className="h-1 w-1 rounded-full bg-rule" />
                <span className="font-hand text-xs text-mute">평균</span>
                <span className="font-disp text-base leading-none text-ink">
                  {menu.avgOverall != null ? menu.avgOverall.toFixed(1) : '-'}
                </span>
              </div>
            </div>
          </Card>

          <Card bg="#FFFFFF" style={{ padding: '18px 18px 16px', borderRadius: 28 }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-hand text-sm text-mute">3축 평균</div>
                <h2 className="mt-1 font-disp text-[1.45rem] leading-none text-ink">학생들이 남긴 평가</h2>
              </div>
              {menu.avgOverall != null && (
                <div className="rounded-full border border-rule bg-paper px-3 py-1 font-hand text-xs text-inkSoft">
                  overall {menu.avgOverall.toFixed(1)}
                </div>
              )}
            </div>

            {hasAggregate ? (
              <div className="mt-5 flex flex-col gap-3">
                <AxisBar label="맛" value={menu.avgTaste} color="#EF8A3D" />
                <AxisBar label="양" value={menu.avgAmount} color="#C89A2A" />
                <AxisBar label="가성비" value={menu.avgValue} color="#4A8F5B" />
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-dashed border-rule bg-paper px-4 py-5">
                <p className="font-hand text-sm leading-6 text-mute">
                  아직 집계된 리뷰가 없습니다. 첫 평가를 남겨보세요.
                </p>
              </div>
            )}
          </Card>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-hand text-sm text-mute">review notes</div>
                <h2 className="mt-1 font-disp text-[1.45rem] leading-none text-ink">학생 리뷰</h2>
              </div>
              <div className="rounded-full border border-rule bg-white px-3 py-1 font-hand text-xs text-inkSoft">
                총 {reviewPage?.totalElements ?? reviews.length}개
              </div>
            </div>

            {isReviewsLoading ? (
              <div className="flex flex-col gap-3">
                <div className="h-32 rounded-[28px] bg-paperDeep shimmer-bg" />
                <div className="h-32 rounded-[28px] bg-paperDeep shimmer-bg" />
              </div>
            ) : isReviewsError ? (
              <Card bg="#FFFFFF" style={{ padding: '18px 16px', borderRadius: 28 }}>
                <p className="font-hand text-sm leading-6 text-red">
                  리뷰를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              </Card>
            ) : reviews.length === 0 ? (
              <Card bg="#FFFFFF" style={{ borderRadius: 28 }}>
                <EmptyState
                  title="아직 이 메뉴의 리뷰가 없어요"
                  description="첫 리뷰의 주인공이 되어보세요"
                  illKind={illust.kind}
                  illBg={illust.bg}
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={handleDeleteReview}
                    isDeleting={deleteMutation.isPending && deleteMutation.variables === review.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[760px]">
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center rounded-[18px] border-[1.8px] border-ink bg-ink px-5 py-3.5 font-disp text-base text-paper shadow-flat opacity-60"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </>
  )
}
