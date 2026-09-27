import { useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

type Props = { url: string; onClose: () => void }

export default function QrModal({ url, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="QR code">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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
