import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CaseRecord,
  IncomingComplaint,
  Institution,
  Overlap,
  OverlapStatus,
} from './types'
import type { AssignComplaintInput, CaseActionInput } from './repository'
import { dataMode, repository } from './index'

interface DataState {
  institutions: Institution[]
  cases: CaseRecord[]
  overlaps: Overlap[]
  complaints: IncomingComplaint[]
}

interface DataContextValue extends DataState {
  dataMode: typeof dataMode
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  resetDemo: () => Promise<void>
  getInstitution: (id: string) => Institution | undefined
  getCase: (id: string) => CaseRecord | undefined
  getCasesForInstitution: (id: string) => CaseRecord[]
  getOpenCasesForInstitution: (id: string) => CaseRecord[]
  recordCaseAction: (caseId: string, input: CaseActionInput) => Promise<CaseRecord>
  decideOverlap: (overlapId: string, status: OverlapStatus) => Promise<Overlap>
  assignComplaint: (
    complaintId: string,
    input: AssignComplaintInput,
  ) => Promise<{ complaintId: string }>
  dismissComplaint: (complaintId: string, reason?: string) => Promise<{ complaintId: string }>
}

const emptyState: DataState = {
  institutions: [],
  cases: [],
  overlaps: [],
  complaints: [],
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(emptyState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [institutions, cases, overlaps, complaints] = await Promise.all([
        repository.listInstitutions(),
        repository.listCases(),
        repository.listOverlaps(),
        repository.listComplaints(),
      ])
      setState({ institutions, cases, overlaps, complaints })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const getInstitution = useCallback(
    (id: string) => state.institutions.find((institution) => institution.id === id),
    [state.institutions],
  )

  const getCase = useCallback(
    (id: string) => state.cases.find((record) => record.id === id),
    [state.cases],
  )

  const getCasesForInstitution = useCallback(
    (id: string) => state.cases.filter((record) => record.institutionId === id),
    [state.cases],
  )

  const getOpenCasesForInstitution = useCallback(
    (id: string) =>
      getCasesForInstitution(id).filter(
        (record) => record.status !== 'Disposed' && record.status !== 'Transferred',
      ),
    [getCasesForInstitution],
  )

  const recordCaseAction = useCallback(async (caseId: string, input: CaseActionInput) => {
    const updated = await repository.recordCaseAction(caseId, input)
    setState((current) => ({
      ...current,
      cases: current.cases.map((record) => (record.id === caseId ? updated : record)),
    }))
    return updated
  }, [])

  const decideOverlap = useCallback(async (overlapId: string, status: OverlapStatus) => {
    const updated = await repository.decideOverlap(overlapId, status)
    setState((current) => ({
      ...current,
      overlaps: current.overlaps.map((overlap) => (overlap.id === overlapId ? updated : overlap)),
    }))
    return updated
  }, [])

  const assignComplaint = useCallback(
    async (complaintId: string, input: AssignComplaintInput) => {
      const result = await repository.assignComplaint(complaintId, input)
      setState((current) => ({
        ...current,
        complaints: current.complaints.filter((complaint) => complaint.id !== complaintId),
      }))
      return result
    },
    [],
  )

  const dismissComplaint = useCallback(async (complaintId: string, reason?: string) => {
    const result = await repository.dismissComplaint(complaintId, reason)
    setState((current) => ({
      ...current,
      complaints: current.complaints.filter((complaint) => complaint.id !== complaintId),
    }))
    return result
  }, [])

  const resetDemo = useCallback(async () => {
    await repository.resetDemo()
    await refresh()
  }, [refresh])

  const value = useMemo<DataContextValue>(
    () => ({
      ...state,
      dataMode,
      loading,
      error,
      refresh,
      resetDemo,
      getInstitution,
      getCase,
      getCasesForInstitution,
      getOpenCasesForInstitution,
      recordCaseAction,
      decideOverlap,
      assignComplaint,
      dismissComplaint,
    }),
    [
      state,
      loading,
      error,
      refresh,
      resetDemo,
      getInstitution,
      getCase,
      getCasesForInstitution,
      getOpenCasesForInstitution,
      recordCaseAction,
      decideOverlap,
      assignComplaint,
      dismissComplaint,
    ],
  )

  if (loading && state.institutions.length === 0) {
    return <DataLoading />
  }

  if (error && state.institutions.length === 0) {
    return <DataError message={error} onRetry={() => void refresh()} />
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside DataProvider')
  return context
}

function BrandMark() {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface shadow-card">
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="#e2872f" strokeWidth="1.2" />
        <path d="M14 26V19M20 26V15.5M26 26V21.5" stroke="#131b26" strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="16" r="2.2" fill="#e2872f" />
      </svg>
    </div>
  )
}

function DataLoading() {
  return (
    <div className="relative grid min-h-screen place-items-center bg-paper px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(226,135,47,.12),transparent_55%)]" />
      <div className="relative flex flex-col items-center text-center">
        <BrandMark />
        <p className="kicker mt-5">AICTE Samanvay</p>
        <h1 className="mt-2 text-[26px] tracking-[-0.03em] text-ink">Opening the institution case file.</h1>
        <p className="mt-1.5 text-[11.5px] text-muted">
          {dataMode === 'api' ? 'Connecting to the API…' : 'Loading the synthetic demo dataset…'}
        </p>
        <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-paper-deep">
          <div className="h-full w-1/2 rounded-full bg-saffron shimmer" />
        </div>
      </div>
    </div>
  )
}

function DataError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="panel max-w-md p-6 text-center">
        <BrandMark />
        <p className="kicker mt-5">Connection problem</p>
        <h1 className="mt-2 text-[24px] tracking-[-0.03em] text-ink">The case file could not be loaded.</h1>
        <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{message}</p>
        <p className="mt-2 text-[10px] leading-relaxed text-muted">
          Check <code className="rounded bg-paper px-1 py-0.5 font-mono">VITE_API_BASE_URL</code> or switch back to
          demo mode with <code className="rounded bg-paper px-1 py-0.5 font-mono">VITE_DATA_MODE=mock</code>.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center rounded-lg bg-ink px-4 text-[11px] font-bold text-paper transition hover:bg-navy"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
