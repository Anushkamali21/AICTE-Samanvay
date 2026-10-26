import type {
  CaseRecord,
  IncomingComplaint,
  Institution,
  Overlap,
  OverlapStatus,
} from './types'
import type {
  AssignComplaintInput,
  CaseActionInput,
  SamanvayRepository,
} from './repository'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Contract expected by the frontend. See BACKEND.md at the project root.
 *
 * The API is intentionally boring JSON over HTTP so it can be implemented in
 * FastAPI, Express, NestJS, Django or a BFF without frontend changes.
 */
export class HttpRepository implements SamanvayRepository {
  private baseUrl: string

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })

    if (!response.ok) {
      let body: unknown = null
      try {
        body = await response.json()
      } catch {
        body = await response.text()
      }
      throw new ApiError(`Request failed with ${response.status}`, response.status, body)
    }

    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }

  listInstitutions(): Promise<Institution[]> {
    return this.request<Institution[]>('/institutions')
  }

  listCases(): Promise<CaseRecord[]> {
    return this.request<CaseRecord[]>('/cases')
  }

  listOverlaps(): Promise<Overlap[]> {
    return this.request<Overlap[]>('/overlaps')
  }

  listComplaints(): Promise<IncomingComplaint[]> {
    return this.request<IncomingComplaint[]>('/triage')
  }

  recordCaseAction(caseId: string, input: CaseActionInput): Promise<CaseRecord> {
    return this.request<CaseRecord>(`/cases/${encodeURIComponent(caseId)}/actions`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  decideOverlap(overlapId: string, status: OverlapStatus): Promise<Overlap> {
    return this.request<Overlap>(`/overlaps/${encodeURIComponent(overlapId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  assignComplaint(
    complaintId: string,
    input: AssignComplaintInput,
  ): Promise<{ complaintId: string }> {
    return this.request<{ complaintId: string }>(
      `/triage/${encodeURIComponent(complaintId)}/assign`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    )
  }

  dismissComplaint(complaintId: string, reason?: string): Promise<{ complaintId: string }> {
    return this.request<{ complaintId: string }>(
      `/triage/${encodeURIComponent(complaintId)}/dismiss`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      },
    )
  }

  async resetDemo(): Promise<void> {
    await this.request<void>('/demo/reset', { method: 'POST' })
  }
}
