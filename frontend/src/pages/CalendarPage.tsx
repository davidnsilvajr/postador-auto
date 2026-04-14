import { useState } from 'react'
import { ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarPost {
  id: number
  title: string
  platform: string
  day: number
}

interface DayPosts {
  date: Date
  posts: CalendarPost[]
}

const samplePosts: CalendarPost[] = [
  { id: 1, title: 'Post Instagram', platform: 'instagram', day: 3 },
  { id: 2, title: 'Post Facebook', platform: 'facebook', day: 3 },
  { id: 3, title: 'Post LinkedIn', platform: 'linkedin', day: 7 },
  { id: 4, title: 'Post Instagram 2', platform: 'instagram', day: 10 },
  { id: 5, title: 'Post Facebook 2', platform: 'facebook', day: 14 },
  { id: 6, title: 'Post Instagram 3', platform: 'instagram', day: 14 },
  { id: 7, title: 'Post LinkedIn 2', platform: 'linkedin', day: 14 },
  { id: 8, title: 'Post Instagram 4', platform: 'instagram', day: 18 },
  { id: 9, title: 'Post Facebook 3', platform: 'facebook', day: 21 },
  { id: 10, title: 'Post Instagram 5', platform: 'instagram', day: 23 },
  { id: 11, title: 'Post LinkedIn 3', platform: 'linkedin', day: 23 },
  { id: 12, title: 'Post Instagram 6', platform: 'instagram', day: 27 },
  { id: 13, title: 'Post Facebook 4', platform: 'facebook', day: 28 },
]

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-500',
  linkedin: 'bg-blue-400',
}

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
}

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getPostsForDay = (day: number): CalendarPost[] => {
    return samplePosts.filter((p) => p.day === day)
  }

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendário</h1>
        <p className="text-muted-foreground"> visualize seus posts agendados</p>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card">
        {/* Calendar header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const postsForDay = day ? getPostsForDay(day) : []
            const isSelected = day === selectedDay
            const isToday = day === 13 && month === 3 && year === 2026

            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDay(day)}
                className={cn(
                  'relative flex min-h-[100px] flex-col items-start border-b border-r border-border/30 p-2 text-left transition-colors hover:bg-secondary/10',
                  !day && 'pointer-events-none',
                  isSelected && 'bg-primary/5'
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        isToday && 'bg-primary text-primary-foreground font-bold'
                      )}
                    >
                      {day}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {postsForDay.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className={cn('h-2 w-2 rounded-full', platformColors[post.platform])}
                        />
                      ))}
                      {postsForDay.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{postsForDay.length - 3}</span>
                      )}
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 border-t border-border px-6 py-3">
          {Object.entries(platformColors).map(([platform, color]) => {
            const Icon = platformIcons[platform]
            const label = platform.charAt(0).toUpperCase() + platform.slice(1)
            return (
              <div key={platform} className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', color)} />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day posts */}
      {selectedDay && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold">
              Posts para {selectedDay} de {monthNames[month]} de {year}
            </h3>
          </div>
          <div className="p-4">
            {selectedDayPosts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Nenhum post agendado para este dia.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayPosts.map((post) => {
                  const Icon = platformIcons[post.platform]
                  return (
                    <div
                      key={post.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      {Icon && (
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-secondary', platformColors[post.platform] + '/20')}>
                          <Icon className={cn('h-5 w-5', platformIcons[post.platform] ? '' : 'text-muted-foreground')} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="text-xs capitalize text-muted-foreground">{post.platform}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
