import { useEffect, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'

type Props = { url: string; onClose: () => void; children?: ReactNode }

export default function QrModal({ url, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="QR code">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children && <div className="modal-timer">{children}</div>}
        <div className="qr">
          <QRCodeSVG value={url} size={512} marginSize={2} level="M" />
        </div>
        <p className="modal-caption">Scan to follow the countdown</p>
        <a className="modal-url" href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
        <button className="ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
