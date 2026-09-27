import { useState, type FormEvent } from 'react'
import type { TimerParams } from '../lib/time'

type Props = {
  onStart: (params: TimerParams) => void
  error: string | null
}

const PRESETS = [
  { label: '1 min', s: 60 },
  { label: '5 min', s: 5 * 60 },
  { label: '10 min', s: 10 * 60 },
  { label: '15 min', s: 15 * 60 },
  { label: '30 min', s: 30 * 60 },
]

function clamp(value: string, max: number): number {
  const n = Math.floor(Number(value))
  return Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0
}

export default function SetupForm({ onStart, error }: Props) {
  const [h, setH] = useState('0')
  const [m, setM] = useState('5')
  const [s, setS] = useState('0')
  const [title, setTitle] = useState('')

  const totalSeconds = clamp(h, 99) * 3600 + clamp(m, 59) * 60 + clamp(s, 59)

  const startWith = (seconds: number) => {
    if (seconds <= 0) return
    const now = Date.now()
    onStart({ start: now, end: now + seconds * 1000, title })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    startWith(totalSeconds)
  }

  const applyPreset = (seconds: number) => {
    setH(String(Math.floor(seconds / 3600)))
    setM(String(Math.floor((seconds % 3600) / 60)))
    setS(String(seconds % 60))
  }

  const field = (label: string, value: string, set: (v: string) => void, max: number) => (
    <label className="time-field">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={(e) => set(e.target.value)}
        onFocus={(e) => e.target.select()}
        aria-label={label}
      />
      <span>{label}</span>
    </label>
  )

  return (
    <main className="setup">
      <h1>Presentation Timer</h1>
      {error && <p className="error">{error} Set a new timer below.</p>}
      <form onSubmit={submit} className="card">
        <div className="time-inputs">
          {field('hours', h, setH, 99)}
          <span className="colon">:</span>
          {field('minutes', m, setM, 59)}
          <span className="colon">:</span>
          {field('seconds', s, setS, 59)}
        </div>
        <div className="presets">
          {PRESETS.map((p) => (
            <button type="button" key={p.s} className="chip" onClick={() => applyPreset(p.s)}>
              {p.label}
            </button>
          ))}
        </div>
        <label className="title-field">
          <span>Title (optional)</span>
          <input
            type="text"
            placeholder="e.g. Coffee break"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button type="submit" className="primary" disabled={totalSeconds <= 0}>
          Start
        </button>
      </form>
      <p className="hint">
        Tip: you can also open a link like <code>?end=2026-09-27T14:30:00Z</code> or{' '}
        <code>?end=&lt;unix seconds&gt;</code> directly.
      </p>
    </main>
  )
}
