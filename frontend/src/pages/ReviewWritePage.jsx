import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getMenuById } from '../api/menus'
import { createReview, getMyReviews, updateReview } from '../api/reviews'
import Card from '../components/hi/Card'
import FoodIllust from '../components/hi/FoodIllust'
import Icon from '../components/hi/Icon'
import MultiStarRating from '../components/hi/MultiStarRating'
import Pill from '../components/hi/Pill'
import useToast from '../hooks/useToast.jsx'

const AUTH_ME_QUERY_KEY = ['auth', 'me']
const MY_REVIEWS_QUERY_KEY = ['reviews', 'me']
const EMPTY_FORM = {
  taste: 0,
  amount: 0,
  value: 0,
  comment: '',
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

function buildFormFromReview(review) {
  if (!review) {
    return EMPTY_FORM
  }

  return {
    taste: review.taste ?? 0,
    amount: review.amount ?? 0,
    value: review.value ?? 0,
    comment: review.comment ?? '',
  }
}

function ReviewWriteSkeleton() {
  return (
    <div className="animate-fadeInUp">
      <div className="sticky top-0 z-30 border-b border-ink bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-[760px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
          <div className="h-8 w-20 rounded-full bg-paperDeep shimmer-bg" />
          <div className="h-6 w-24 rounded-full bg-paperDeep shimmer-bg" />
          <div className="justify-self-end h-8 w-16 rounded-full bg-paperDeep shimmer-bg" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5">
        <div className="h-24 rounded-[28px] bg-paperDeep shimmer-bg" />
        <div className="h-64 rounded-[28px] bg-paperDeep shimmer-bg" />
        <div className="h-44 rounded-[28px] bg-paperDeep shimmer-bg" />
      </div>
    </div>
  )
}

function InvalidMenuState({ onBack }) {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 animate-fadeInUp">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-hand text-sm text-ink shadow-card transition-transform active:scale-[0.98]"
      >
        <Icon name="chevL" size={18} color="#2B2218" />
        메뉴로 돌아가기
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

function ErrorState({ title, description, onBack }) {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 animate-fadeInUp">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-hand text-sm text-ink shadow-card transition-transform active:scale-[0.98]"
      >
        <Icon name="chevL" size={18} color="#2B2218" />
        뒤로
      </button>

      <Card bg="#FFFFFF" style={{ padding: '24px 20px', borderRadius: 28 }}>
        <p className="font-disp text-lg leading-none text-ink">{title}</p>
        <p className="mt-3 font-hand text-sm leading-6 text-red">{description}</p>
      </Card>
    </div>
  )
}

export default function ReviewWritePage() {
  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()
  const { showToast, ToastComponent } = useToast()
  const menuId = Number(params.id)
  const isValidMenuId = Number.isInteger(menuId) && menuId > 0
  const [form, setForm] = useState(EMPTY_FORM)

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
    data: myReviews = [],
    isLoading: isMyReviewsLoading,
    isError: isMyReviewsError,
  } = useQuery({
    queryKey: MY_REVIEWS_QUERY_KEY,
    queryFn: getMyReviews,
    enabled: isValidMenuId,
  })

  const existingReview = myReviews.find((review) => review.menuId === menuId)
  const isEditMode = Boolean(existingReview)

  useEffect(() => {
    if (!isValidMenuId) {
      return
    }

    setForm(buildFormFromReview(existingReview))
  }, [existingReview?.id, isValidMenuId, menuId])

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      if (existingReview) {
        return updateReview(existingReview.id, payload)
      }

      return createReview(menuId, payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['menus'] }),
        queryClient.invalidateQueries({ queryKey: ['reviews', menuId] }),
        queryClient.invalidateQueries({ queryKey: MY_REVIEWS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY }),
      ])

      navigate(`/menus/${menuId}`, { replace: true })
    },
    onError: (error) => {
      showToast(error.response?.data?.message ?? '리뷰 저장에 실패했습니다', 'error')
    },
  })

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(isValidMenuId ? `/menus/${menuId}` : '/menus', { replace: true })
  }

  const handleCommentChange = (event) => {
    setForm((previous) => ({
      ...previous,
      comment: event.target.value.slice(0, 500),
    }))
  }

  const handleSubmit = () => {
    if (saveMutation.isPending) {
      return
    }

    const isComplete = form.taste > 0 && form.amount > 0 && form.value > 0
    if (!isComplete) {
      showToast('3축 별점을 모두 선택해 주세요', 'error')
      return
    }

    const trimmedComment = form.comment.trim()
    saveMutation.mutate({
      tasteRating: form.taste,
      amountRating: form.amount,
      valueRating: form.value,
      comment: trimmedComment || null,
      photoUrls: [],
    })
  }

  if (!isValidMenuId) {
    return (
      <>
        {ToastComponent}
        <InvalidMenuState onBack={handleBack} />
      </>
    )
  }

  if (isMenuLoading || isMyReviewsLoading) {
    return (
      <>
        {ToastComponent}
        <ReviewWriteSkeleton />
      </>
    )
  }

  if (isMenuError || !menu) {
    return (
      <>
        {ToastComponent}
        <ErrorState
          title="메뉴를 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요."
          onBack={handleBack}
        />
      </>
    )
  }

  if (isMyReviewsError) {
    return (
      <>
        {ToastComponent}
        <ErrorState
          title="리뷰 상태를 확인하지 못했어요"
          description="내 리뷰 정보를 다시 불러온 뒤 시도해 주세요."
          onBack={handleBack}
        />
      </>
    )
  }

  const illust = getIllustrationProps(menu.corner)
  const commentLength = form.comment.length
  const isFormComplete = form.taste > 0 && form.amount > 0 && form.value > 0
  const pageTitle = isEditMode ? '리뷰 수정' : '리뷰 쓰기'
  const submitLabel = saveMutation.isPending
    ? isEditMode ? '저장 중...' : '등록 중...'
    : isEditMode ? '저장' : '등록'

  return (
    <>
      {ToastComponent}

      <div className="min-h-[100dvh] animate-fadeInUp bg-paper">
        <div className="sticky top-0 z-30 border-b border-ink bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto grid w-full max-w-[760px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={handleBack}
              className="justify-self-start inline-flex items-center gap-1 rounded-full border border-rule bg-white px-3 py-1.5 font-hand text-sm text-ink shadow-card transition-transform active:scale-[0.98]"
            >
              <Icon name="chevL" size={16} color="#2B2218" />
              취소
            </button>

            <h1 className="text-center font-disp text-lg leading-none text-ink">{pageTitle}</h1>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormComplete || saveMutation.isPending}
              className={`justify-self-end rounded-full border px-3 py-1.5 font-disp text-sm shadow-card transition-transform active:scale-[0.98] ${
                !isFormComplete || saveMutation.isPending
                  ? 'cursor-not-allowed border-rule bg-paperDeep text-mute shadow-none'
                  : 'border-ink bg-ink text-paper'
              }`}
            >
              {submitLabel}
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 pb-8">
          <Card bg="#FBE6A6" style={{ padding: '14px 16px', borderRadius: 28 }}>
            <div className="flex items-center gap-3">
              <FoodIllust kind={illust.kind} size={58} bg="#FFFFFF" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-hand text-xs text-inkSoft">
                  <span>{menu.corner || '기타'}</span>
                  <span>·</span>
                  <span>{formatServedDate(menu.servedDate)}</span>
                  {isEditMode && (
                    <Pill
                      bg="#FFFFFF"
                      color="#2B2218"
                      border="#2B2218"
                      style={{ fontSize: 10, padding: '1px 8px' }}
                    >
                      내 리뷰
                    </Pill>
                  )}
                </div>
                <div className="mt-2 truncate font-disp text-[1.2rem] leading-none text-ink">
                  {menu.name}
                </div>
              </div>
            </div>
          </Card>

          <Card bg="#FFFFFF" style={{ padding: '18px 18px 16px', borderRadius: 28 }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-hand text-sm text-mute">3축 × 5점</div>
                <h2 className="mt-1 font-disp text-[1.45rem] leading-none text-ink">
                  오늘 식사를 어떻게 느꼈나요?
                </h2>
              </div>
              <div className="rounded-full border border-rule bg-paper px-3 py-1 font-hand text-xs text-inkSoft">
                모두 선택
              </div>
            </div>

            <div className="mt-5">
              <MultiStarRating
                value={form}
                onChange={(nextValue) => setForm((previous) => ({ ...previous, ...nextValue }))}
              />
            </div>
          </Card>

          <Card bg="#FFFFFF" style={{ padding: '18px 18px 16px', borderRadius: 28 }}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="font-hand text-sm text-mute">comment</div>
                <h2 className="mt-1 font-disp text-[1.3rem] leading-none text-ink">
                  한 마디
                </h2>
              </div>
              <div className="font-hand text-xs text-mute">
                {commentLength} / 500
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[22px] border-[1.5px] border-rule bg-paper">
              <textarea
                value={form.comment}
                onChange={handleCommentChange}
                maxLength={500}
                rows={5}
                placeholder="바삭함이 좋았는지, 양이 넉넉했는지 한 마디로 남겨보세요."
                className="block min-h-[140px] w-full resize-none border-0 bg-transparent px-4 py-4 font-hand text-sm leading-7 text-ink outline-none placeholder:text-mute"
              />
            </div>

            <div className="mt-5 rounded-[22px] border-[1.5px] border-dashed border-rule bg-paperDeep/60 px-4 py-4">
              <div className="flex items-center gap-2">
                <Icon name="cam" size={18} color="#8E7A66" />
                <div className="font-disp text-base leading-none text-ink">사진 첨부</div>
                <span className="font-hand text-xs text-mute">(Phase D 예정)</span>
              </div>
              <p className="mt-3 font-hand text-sm leading-6 text-mute">
                이번 작업에서는 첨부 슬롯만 표시합니다. 실제 업로드는 다음 사진 업로드 트랙에서 연결됩니다.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
