import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useCountdown } from '../hooks/useCountdown'
import { buildShareUrl, formatClock, splitDuration, type TimerParams } from '../lib/time'

type Props = { params: TimerParams; onReset: () => void }

const RING_RADIUS = 46
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
const pad = (n: number) => String(n).padStart(2, '0')

export default function Countdown({ params, onReset }: Props) {
  const { end, start, title } = params
  const remaining = useCountdown(end)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const shareUrl = buildShareUrl(params)
  const { h, m, s } = splitDuration(remaining)
  const done = remaining <= 0
  const state = done ? 'done' : remaining <= 10_000 ? 'critical' : remaining <= 60_000 ? 'warning' : 'normal'
  const progress = start !== null ? Math.min(1, Math.max(0, remaining / (end - start))) : null

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      window.prompt('Copy this link:', shareUrl)
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const digits = (
    <div className="digits" role="timer" aria-live="off">
      {done ? (
        <span className="times-up">Time's up!</span>
      ) : (
        <>
          {h > 0 && (
            <>
              <span>{pad(h)}</span>
              <span className="sep">:</span>
            </>
          )}
          <span>{pad(m)}</span>
          <span className="sep">:</span>
          <span>{pad(s)}</span>
        </>
      )}
    </div>
  )

  return (
    <main className={`countdown state-${state}`}>
      {title && <h1 className="countdown-title">{title}</h1>}

      <div className="dial">
        {progress !== null && (
          <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="ring-track" cx="50" cy="50" r={RING_RADIUS} />
            <circle
              className="ring-progress"
              cx="50"
              cy="50"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
            />
          </svg>
        )}
        {digits}
      </div>

      <p className="ends-at">Ends at {formatClock(end)}</p>

      <div className="countdown-footer">
        <details className="share-panel" onToggle={(e) => setIsShareOpen(e.currentTarget.open)}>
          <summary
            className="ghost"
            aria-label={isShareOpen ? 'Hide timer sharing options' : 'Show timer sharing options'}
          >
            <span>Share timer</span>
            <span className="share-indicator" aria-hidden="true">
              {isShareOpen ? '−' : '+'}
            </span>
          </summary>
          <div className="share-panel-body">
            <div className="qr share-qr">
              <QRCodeSVG value={shareUrl} size={256} marginSize={2} level="M" />
            </div>
            <a className="share-link" href={shareUrl} target="_blank" rel="noreferrer">
              {shareUrl}
            </a>
            <button className="ghost" onClick={copyLink}>
              {copied ? 'Link copied!' : 'Copy link'}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? 'Share link copied to clipboard.' : ' '}
            </span>
          </div>
        </details>

        <div className="controls">
          <button className="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          </button>
          <button className="link-action" onClick={onReset}>
            Create new timer
          </button>
        </div>
      </div>
    </main>
  )
}
