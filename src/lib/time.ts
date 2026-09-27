export type TimerParams = {
  /** Expiry time in epoch milliseconds. */
  end: number
  /** Optional start time in epoch milliseconds (enables the progress ring). */
  start: number | null
  title: string
}

/**
 * Parses a point in time from a URL parameter.
 * Accepts unix seconds (10 digits), unix milliseconds (13 digits) or any
 * ISO 8601 date-time string understood by Date (e.g. 2026-09-27T14:30:00Z).
 */
export function parseTime(value: string | null): number | null {
  if (!value) return null
  const v = value.trim()
  if (/^\d+(\.\d+)?$/.test(v)) {
    const n = Number(v)
    // Anything below 1e11 is treated as seconds (1e11 s is the year 5138).
    return n < 1e11 ? Math.round(n * 1000) : Math.round(n)
  }
  // A literal "+" in a hand-typed URL (e.g. +02:00) arrives as a space.
  const t = Date.parse(v.replace(/ (\d{2}:?\d{2})$/, '+$1'))
  return Number.isNaN(t) ? null : t
}

export type ParseResult =
  | { kind: 'none' }
  | { kind: 'invalid'; raw: string }
  | { kind: 'ok'; params: TimerParams }

export function readParams(search: string): ParseResult {
  const q = new URLSearchParams(search)
  const raw = q.get('end')
  if (raw === null || raw === '') return { kind: 'none' }
  const end = parseTime(raw)
  if (end === null) return { kind: 'invalid', raw }
  let start = parseTime(q.get('start'))
  if (start !== null && start >= end) start = null
  return { kind: 'ok', params: { end, start, title: q.get('title') ?? '' } }
}

/** Base URL of the app (current origin + path, without index.html or query). */
export function appBaseUrl(): string {
  const path = window.location.pathname.replace(/index\.html$/, '')
  return window.location.origin + path
}

export function buildQuery({ end, start, title }: TimerParams): string {
  const q = new URLSearchParams()
  q.set('end', String(Math.round(end / 1000)))
  if (start !== null) q.set('start', String(Math.round(start / 1000)))
  if (title.trim()) q.set('title', title.trim())
  return '?' + q.toString()
}

export function buildShareUrl(params: TimerParams): string {
  return appBaseUrl() + buildQuery(params)
}

export function splitDuration(ms: number): { h: number; m: number; s: number } {
  // Round up so the display shows 00:00:01 until the very last moment.
  const total = Math.max(0, Math.ceil(ms / 1000))
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function formatDuration(ms: number): string {
  const { h, m, s } = splitDuration(ms)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export function formatClock(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
