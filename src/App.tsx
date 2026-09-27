import { useCallback, useEffect, useState } from 'react'
import Countdown from './components/Countdown'
import SetupForm from './components/SetupForm'
import { buildQuery, readParams, type TimerParams } from './lib/time'

export default function App() {
  const [search, setSearch] = useState(() => window.location.search)

  useEffect(() => {
    const onPop = () => setSearch(window.location.search)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((query: string) => {
    const path = window.location.pathname
    window.history.pushState(null, '', path + query)
    setSearch(query)
  }, [])

  const start = useCallback(
    (params: TimerParams) => navigate(buildQuery(params)),
    [navigate],
  )
  const reset = useCallback(() => navigate(''), [navigate])

  const parsed = readParams(search)

  const title = parsed.kind === 'ok' ? parsed.params.title : ''
  useEffect(() => {
    document.title = title ? `${title} · Timer` : 'Presentation Timer'
  }, [title])

  if (parsed.kind === 'ok') {
    return <Countdown params={parsed.params} onReset={reset} />
  }
  return (
    <SetupForm
      onStart={start}
      error={parsed.kind === 'invalid' ? `Could not read the end time "${parsed.raw}".` : null}
    />
  )
}
