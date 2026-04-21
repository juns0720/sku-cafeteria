import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getBestMenus, getTodayMenus, getWeeklyMenus } from '../api/menus'
import BestCarousel from '../components/hi/BestCarousel'
import Card from '../components/hi/Card'
import EmptyState from '../components/hi/EmptyState'
import FoodIllust from '../components/hi/FoodIllust'
import MedalSticker from '../components/hi/MedalSticker'
import Pill from '../components/hi/Pill'
import SecLabel from '../components/hi/SecLabel'
import Stars from '../components/hi/Stars'
import useAuth from '../hooks/useAuth'

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토']
const TODAY_SLOT = 'LUNCH'
const SORT_OPTIONS = [
  { key: 'rating', label: '별점↓' },
  { key: 'name', label: '가나다' },
  { key: 'reviewCount', label: '리뷰수↓' },
]

function toDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function getTodayLabel(value) {
  const date = toDate(value) ?? new Date()
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_KO[date.getDay()]})`
}

function getDateKey(offsetDays = 0) {
  const base = new Date()
  base.setDate(base.getDate() + offsetDays)

  const year = base.getFullYear()
  const month = String(base.getMonth() + 1).padStart(2, '0')
  const day = String(base.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function sortMenus(menus, sort) {
  return [...menus].sort((left, right) => {
    if (sort === 'name') {
      return left.name.localeCompare(right.name, 'ko')
    }

    if (sort === 'reviewCount') {
      if ((right.reviewCount ?? 0) !== (left.reviewCount ?? 0)) {
        return (right.reviewCount ?? 0) - (left.reviewCount ?? 0)
      }
      return left.name.localeCompare(right.name, 'ko')
    }

    if ((right.avgOverall ?? -1) !== (left.avgOverall ?? -1)) {
      return (right.avgOverall ?? -1) - (left.avgOverall ?? -1)
    }

    return left.name.localeCompare(right.name, 'ko')
  })
}

function groupMenusByCorner(menus) {
  const groups = new Map()

  menus.forEach((menu) => {
    const corner = menu.corner || '기타'
    const items = groups.get(corner) ?? []
    items.push(menu)
    groups.set(corner, items)
  })

  return Array.from(groups.entries()).map(([corner, items]) => ({
    corner,
    items,
  }))
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

function getLastWeekPreviewMenus(weeklyData) {
  const menusById = new Map()

  Object.values(weeklyData?.days ?? {}).forEach((menus) => {
    menus.forEach((menu) => {
      if (!menu?.id || menusById.has(menu.id)) {
        return
      }

      menusById.set(menu.id, menu)
    })
  })

  return Array.from(menusById.values())
    .filter((menu) => menu.avgOverall != null && (menu.reviewCount ?? 0) > 0)
    .sort((left, right) => {
      if ((right.reviewCount ?? 0) >= 3 || (left.reviewCount ?? 0) >= 3) {
        if ((right.reviewCount ?? 0) >= 3 && (left.reviewCount ?? 0) < 3) {
          return 1
        }
        if ((left.reviewCount ?? 0) >= 3 && (right.reviewCount ?? 0) < 3) {
          return -1
        }
      }

      if ((right.avgOverall ?? -1) !== (left.avgOverall ?? -1)) {
        return (right.avgOverall ?? -1) - (left.avgOverall ?? -1)
      }

      if ((right.reviewCount ?? 0) !== (left.reviewCount ?? 0)) {
        return (right.reviewCount ?? 0) - (left.reviewCount ?? 0)
      }

      return left.name.localeCompare(right.name, 'ko')
    })
    .slice(0, 2)
}

function SortDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-full border-[1.5px] border-ink bg-white px-3 py-1.5 pr-8 font-hand text-xs font-bold text-ink shadow-card outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-hand text-[10px] text-inkSoft">
        ▾
      </span>
    </div>
  )
}

function HomeHeader({ user, dateLabel }) {
  return (
    <div className="rounded-b-[30px] border-b-[1.5px] border-ink bg-orangeSoft px-4 pb-5 pt-5 shadow-card">
      <div className="mx-auto flex max-w-[760px] items-start justify-between gap-4">
        <div>
          <div className="font-hand text-sm text-inkSoft">학식 today</div>
          <h1 className="mt-1 font-disp text-[2.1rem] leading-none text-ink">
            오늘 점심 뭐 먹지?
          </h1>
          <p className="mt-3 font-hand text-sm text-inkSoft">{dateLabel}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-white/90 px-2.5 py-2 shadow-card">
          <span
            className="inline-block h-8 w-8 shrink-0 rounded-full border border-ink"
            style={{ backgroundColor: user?.avatarColor ?? '#EF8A3D' }}
          />
          <span className="max-w-[96px] truncate font-user text-sm font-medium text-ink">
            {user?.nickname ?? user?.name ?? '사용자'}
          </span>
        </div>
      </div>
    </div>
  )
}

function HomeSectionSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-28 rounded-[24px] bg-paperDeep shimmer-bg" />
      <div className="h-28 rounded-[24px] bg-paperDeep shimmer-bg" />
      <div className="h-28 rounded-[24px] bg-paperDeep shimmer-bg" />
    </div>
  )
}

function LastWeekPreview({ items, isLoading, isError, onMenuSelect }) {
  return (
    <div className="rounded-[22px] border border-dashed border-rule bg-paper px-3 py-3 text-left">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-disp text-[1rem] leading-none text-ink">지난 주 베스트 미리보기</div>
          <p className="mt-1 font-hand text-xs text-mute">최근 식단에서 반응 좋았던 메뉴 2건</p>
        </div>
        <span className="rounded-full border border-rule bg-white px-2.5 py-1 font-hand text-[11px] text-inkSoft">
          TOP 2
        </span>
      </div>

      {isLoading ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="h-16 rounded-[18px] bg-white shimmer-bg" />
          <div className="h-16 rounded-[18px] bg-white shimmer-bg" />
        </div>
      ) : isError ? (
        <p className="mt-3 font-hand text-sm leading-6 text-mute">
          지난 주 미리보기를 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p className="mt-3 font-hand text-sm leading-6 text-mute">
          아직 지난 주에 보여드릴 추천 메뉴가 없습니다.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {items.map((menu, index) => {
            const illust = getIllustrationProps(menu.corner)

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => onMenuSelect(menu.id)}
                className="flex items-center gap-3 rounded-[18px] border border-rule bg-white px-3 py-3 text-left transition-transform active:scale-[0.99]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper font-disp text-sm text-orange">
                  #{index + 1}
                </div>
                <FoodIllust kind={illust.kind} size={42} bg={illust.bg} />

                <div className="min-w-0 flex-1">
                  <div className="truncate font-disp text-[1rem] leading-none text-ink">
                    {menu.name}
                  </div>
                  <div className="mt-1 font-hand text-[11px] text-mute">
                    {menu.corner || '기타'} · 리뷰 {menu.reviewCount ?? 0}개
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Stars value={menu.avgOverall ?? 0} size={11} />
                    <span className="font-disp text-sm leading-none text-ink">
                      {menu.avgOverall?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CornerGroupCard({ corner, items, onMenuSelect }) {
  return (
    <Card bg="#FFFFFF" style={{ padding: '16px 16px 14px', borderRadius: 24 }}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-disp text-[1.2rem] leading-none text-ink">{corner}</h3>
        <span className="rounded-full border border-rule bg-paper px-2.5 py-1 font-hand text-xs text-inkSoft">
          {items.length}개
        </span>
      </div>

      <div className="mt-3 flex flex-col">
        {items.map((menu, index) => (
          <button
            key={menu.id}
            type="button"
            onClick={() => onMenuSelect(menu.id)}
            className={`flex items-start justify-between gap-3 py-3 text-left transition-transform active:scale-[0.99] ${
              index > 0 ? 'border-t border-dashed border-rule' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <MedalSticker tier={menu.tier} size={20} />
                <div className="truncate font-disp text-[1.05rem] leading-none text-ink">
                  {menu.name}
                </div>
                {menu.isNew && (
                  <Pill
                    bg="#FBE6A6"
                    border="#C89A2A"
                    color="#2B2218"
                    style={{ fontSize: 11, padding: '1px 8px' }}
                  >
                    NEW
                  </Pill>
                )}
              </div>

              <div className="mt-2 font-hand text-xs text-mute">
                {menu.reviewCount > 0
                  ? `리뷰 ${menu.reviewCount}개`
                  : '첫 리뷰의 주인공이 되어보세요'}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {menu.avgOverall != null ? (
                <>
                  <div className="flex items-center justify-end gap-2">
                    <Stars value={menu.avgOverall} size={12} />
                    <span className="font-disp text-sm leading-none text-ink">
                      {menu.avgOverall.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 font-hand text-[11px] text-mute">
                    {menu.reviewCount}명 평가
                  </div>
                </>
              ) : (
                <div className="rounded-full border border-rule bg-paper px-2.5 py-1 font-hand text-xs text-mute">
                  리뷰 없음
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sort, setSort] = useState('rating')
  const lastWeekDateKey = getDateKey(-7)
  const {
    data: todayData,
    isLoading: isTodayLoading,
    isError: isTodayError,
  } = useQuery({
    queryKey: ['menus', 'today', TODAY_SLOT],
    queryFn: () => getTodayMenus(TODAY_SLOT),
  })
  const { data: bestMenus = [], isLoading: isBestLoading } = useQuery({
    queryKey: ['menus', 'best'],
    queryFn: getBestMenus,
  })
  const sortedMenus = sortMenus(todayData?.menus ?? [], sort)
  const groupedMenus = groupMenusByCorner(sortedMenus)
  const shouldLoadLastWeekPreview = !isTodayLoading && !isTodayError && groupedMenus.length === 0
  const {
    data: lastWeekData,
    isLoading: isLastWeekLoading,
    isError: isLastWeekError,
  } = useQuery({
    queryKey: ['menus', 'weekly', lastWeekDateKey, 'last-preview'],
    queryFn: () => getWeeklyMenus(lastWeekDateKey),
    enabled: shouldLoadLastWeekPreview,
  })

  const dateLabel = getTodayLabel(todayData?.date)
  const lastWeekPreviewMenus = getLastWeekPreviewMenus(lastWeekData)
  const shouldShowBest = groupedMenus.length > 0 && !isBestLoading && bestMenus.length > 0
  const handleMenuSelect = (menuId) => navigate(`/menus/${menuId}`)

  return (
    <div className="animate-fadeInUp">
      <HomeHeader user={user} dateLabel={dateLabel} />

      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-7 px-4 py-5">
        <section>
          <SecLabel
            right={<SortDropdown value={sort} onChange={setSort} />}
          >
            ✨ 오늘의 메뉴 ({TODAY_SLOT})
          </SecLabel>

          {isTodayLoading ? (
            <HomeSectionSkeleton />
          ) : isTodayError ? (
            <Card bg="#FFFFFF" style={{ padding: '18px 16px', borderRadius: 24 }}>
              <p className="font-hand text-sm leading-6 text-red">
                오늘 메뉴를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </Card>
          ) : groupedMenus.length === 0 ? (
            <Card bg="#FFFFFF" style={{ borderRadius: 24 }}>
              <EmptyState
                title="오늘 메뉴가 아직 없어요"
                description={'식단이 올라오면 여기에서 바로 확인할 수 있어요.\n대신 지난 주 반응이 좋았던 메뉴를 먼저 둘러보세요.'}
                illKind="soup"
                illBg="#FCE3C9"
              >
                <LastWeekPreview
                  items={lastWeekPreviewMenus}
                  isLoading={isLastWeekLoading}
                  isError={isLastWeekError}
                  onMenuSelect={handleMenuSelect}
                />
              </EmptyState>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {groupedMenus.map((group) => (
                <CornerGroupCard
                  key={group.corner}
                  corner={group.corner}
                  items={group.items}
                  onMenuSelect={handleMenuSelect}
                />
              ))}
            </div>
          )}
        </section>

        {shouldShowBest && (
          <section>
            <SecLabel
              right={
                <span className="font-hand text-xs text-mute">
                  리뷰 3개 이상 기준
                </span>
              }
            >
              🏆 이번 주 BEST
            </SecLabel>
            <BestCarousel
              items={bestMenus.slice(0, 5)}
              onItemClick={(menu) => handleMenuSelect(menu.id)}
            />
          </section>
        )}
      </div>
    </div>
  )
}
