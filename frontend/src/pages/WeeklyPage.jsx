import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getWeeklyMenus } from '../api/menus'
import Card from '../components/hi/Card'
import EmptyState from '../components/hi/EmptyState'
import FoodIllust from '../components/hi/FoodIllust'
import MedalSticker from '../components/hi/MedalSticker'
import Pill from '../components/hi/Pill'
import SecLabel from '../components/hi/SecLabel'
import Stars from '../components/hi/Stars'
import WeekDayTabs from '../components/hi/WeekDayTabs'

const WEEK_DAYS = [
  { key: 'MON', shortLabel: '월', fullLabel: '월요일' },
  { key: 'TUE', shortLabel: '화', fullLabel: '화요일' },
  { key: 'WED', shortLabel: '수', fullLabel: '수요일' },
  { key: 'THU', shortLabel: '목', fullLabel: '목요일' },
  { key: 'FRI', shortLabel: '금', fullLabel: '금요일' },
]
const TODAY_KEY_MAP = { 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI' }
const ORDINAL_LABELS = ['첫째', '둘째', '셋째', '넷째', '다섯째']

function getTodayWeekKey() {
  return TODAY_KEY_MAP[new Date().getDay()] ?? 'MON'
}

function getTodayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function toDate(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value)
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

function getWeekStartDate(value) {
  const base = toDate(value) ?? new Date()
  const result = new Date(base)
  const day = result.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  result.setHours(12, 0, 0, 0)
  result.setDate(result.getDate() + diffToMonday)

  return result
}

function formatMonthDay(value) {
  const date = toDate(value)
  if (!date) {
    return ''
  }

  return `${date.getMonth() + 1}/${date.getDate()}`
}

function getWeekTitle(weekStart) {
  const date = getWeekStartDate(weekStart)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstDayOffset = firstDay.getDay()
  const weekIndex = Math.floor((date.getDate() + firstDayOffset - 1) / 7)
  const ordinal = ORDINAL_LABELS[weekIndex] ?? `${weekIndex + 1}째`

  return `${date.getMonth() + 1}월 ${ordinal} 주`
}

function buildDayTabs(weekStart) {
  const startDate = getWeekStartDate(weekStart)

  return WEEK_DAYS.map((day, index) => {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + index)

    return {
      ...day,
      displayDate: formatMonthDay(currentDate),
    }
  })
}

function sortMenus(menus) {
  return [...menus].sort((left, right) => {
    const cornerCompare = (left.corner ?? '').localeCompare(right.corner ?? '', 'ko')
    if (cornerCompare !== 0) {
      return cornerCompare
    }

    return left.name.localeCompare(right.name, 'ko')
  })
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

function WeeklyPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5 animate-fadeInUp">
      <div className="h-5 w-28 rounded-full bg-paperDeep shimmer-bg" />
      <div className="h-10 w-52 rounded-full bg-paperDeep shimmer-bg" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-14 flex-1 rounded-[12px] bg-paperDeep shimmer-bg" />
        ))}
      </div>
      <div className="h-6 w-40 rounded-full bg-paperDeep shimmer-bg" />
      <div className="h-24 rounded-[24px] bg-paperDeep shimmer-bg" />
      <div className="h-24 rounded-[24px] bg-paperDeep shimmer-bg" />
      <div className="h-24 rounded-[24px] bg-paperDeep shimmer-bg" />
    </div>
  )
}

function WeeklyMenuRow({ menu, onSelect }) {
  const illust = getIllustrationProps(menu.corner)
  const hasRating = menu.avgOverall != null && (menu.reviewCount ?? 0) > 0
  const emptyReviewCopy = menu.isNew
    ? '첫 등장 · 첫 리뷰의 주인공이 되어보세요'
    : '첫 리뷰의 주인공이 되어보세요'

  return (
    <Card bg="#FFFFFF" style={{ borderRadius: 24 }}>
      <button
        type="button"
        onClick={() => onSelect(menu.id)}
        className="flex w-full items-center gap-3 p-3 text-left transition-transform active:scale-[0.99]"
      >
        <FoodIllust kind={illust.kind} size={50} bg={illust.bg} />

        <div className="min-w-0 flex-1">
          <div className="font-hand text-[11px] text-mute">{menu.corner || '기타'}</div>

          <div className="mt-1 flex items-center gap-2">
            <div className="truncate font-disp text-[1.05rem] leading-none text-ink">
              {menu.name}
            </div>

            {menu.isNew && (
              <Pill
                bg="#EF8A3D"
                color="#FFFFFF"
                border="#EF8A3D"
                style={{ fontSize: 10, padding: '1px 7px' }}
              >
                NEW
              </Pill>
            )}
          </div>

          {hasRating ? (
            <div className="mt-2 flex items-center gap-2">
              <Stars value={menu.avgOverall} size={11} />
              <span className="font-disp text-sm leading-none text-ink">
                {menu.avgOverall.toFixed(1)}
              </span>
              <span className="font-hand text-[11px] text-mute">리뷰 {menu.reviewCount}</span>
            </div>
          ) : (
            <div className="mt-2 font-hand text-[11px] text-red">{emptyReviewCopy}</div>
          )}
        </div>

        <div className="shrink-0 self-start pt-1">
          <MedalSticker tier={menu.tier} size={26} />
        </div>
      </button>
    </Card>
  )
}

export default function WeeklyPage() {
  const navigate = useNavigate()
  const [selectedDayKey, setSelectedDayKey] = useState(getTodayWeekKey)
  const dateKey = getTodayDateKey()
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['menus', 'weekly', dateKey],
    queryFn: () => getWeeklyMenus(dateKey),
  })

  const dayTabs = buildDayTabs(data?.weekStart)
  const activeIndex = Math.max(
    dayTabs.findIndex((day) => day.key === selectedDayKey),
    0
  )
  const activeDay = dayTabs[activeIndex] ?? dayTabs[0]
  const selectedMenus = sortMenus(data?.days?.[activeDay?.key] ?? [])
  const weekTitle = getWeekTitle(data?.weekStart)
  const weekRangeLabel = data?.weekStart && data?.weekEnd
    ? `${formatMonthDay(data.weekStart)} - ${formatMonthDay(data.weekEnd)}`
    : ''
  const handleMenuSelect = (menuId) => navigate(`/menus/${menuId}`)

  if (isLoading) {
    return <WeeklyPageSkeleton />
  }

  return (
    <div className="animate-fadeInUp">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-5">
        <div>
          <div className="font-hand text-sm text-green">{weekTitle}</div>
          <h1 className="mt-1 font-disp text-[2rem] leading-none text-ink">
            이번 주 <span className="underline decoration-green decoration-[6px] underline-offset-[6px]">식단</span>
          </h1>
          {weekRangeLabel && (
            <p className="mt-3 font-hand text-sm text-inkSoft">{weekRangeLabel}</p>
          )}
        </div>

        <WeekDayTabs
          days={dayTabs.map((day) => ({
            day: day.shortLabel,
            date: day.displayDate,
          }))}
          activeIndex={activeIndex}
          onChange={(nextIndex) => setSelectedDayKey(dayTabs[nextIndex]?.key ?? selectedDayKey)}
        />

        <section>
          <SecLabel
            right={(
              <span className="inline-flex items-center gap-1.5 font-hand text-[11px] text-mute">
                <Pill
                  bg="#EF8A3D"
                  color="#FFFFFF"
                  border="#EF8A3D"
                  style={{ fontSize: 9, padding: '0 5px' }}
                >
                  NEW
                </Pill>
                = 처음 등장
              </span>
            )}
          >
            {activeDay ? `${activeDay.fullLabel} · 중식` : '이번 주 · 중식'}
          </SecLabel>

          {isError ? (
            <Card bg="#FFFFFF" style={{ padding: '18px 16px', borderRadius: 24 }}>
              <p className="font-hand text-sm leading-6 text-red">
                이번 주 메뉴를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </Card>
          ) : selectedMenus.length === 0 ? (
            <Card bg="#FFFFFF" style={{ borderRadius: 24 }}>
              <EmptyState
                title="선택한 요일의 메뉴가 아직 없어요"
                description="식단이 올라오면 여기에서 바로 확인할 수 있어요."
                illKind="bowl"
                illBg="#FCE3C9"
              />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedMenus.map((menu) => (
                <WeeklyMenuRow
                  key={`${activeDay.key}-${menu.id}`}
                  menu={menu}
                  onSelect={handleMenuSelect}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
