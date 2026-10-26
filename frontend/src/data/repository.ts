import type {
  CaseRecord,
  CaseStatus,
  IncomingComplaint,
  Institution,
  Overlap,
  OverlapStatus,
  Bureau,
} from './types'

export interface CaseActionInput {
  text: string
  status: CaseStatus
  visibility: 'Internal' | 'Public'
  actor: string
}

export interface AssignComplaintInput {
  bureau: Bureau
  officer: string
  note?: string
}

/**
 * The UI talks only to this interface.
 *
 * MockRepository powers the demo. HttpRepository talks to a real backend.
 * Swap implementations with VITE_DATA_MODE=api — no page changes required.
 */
export interface SamanvayRepository {
  listInstitutions(): Promise<Institution[]>
  listCases(): Promise<CaseRecord[]>
  listOverlaps(): Promise<Overlap[]>
  listComplaints(): Promise<IncomingComplaint[]>

  recordCaseAction(caseId: string, input: CaseActionInput): Promise<CaseRecord>
  decideOverlap(overlapId: string, status: OverlapStatus): Promise<Overlap>
  assignComplaint(complaintId: string, input: AssignComplaintInput): Promise<{ complaintId: string }>
  dismissComplaint(complaintId: string, reason?: string): Promise<{ complaintId: string }>

  /** Demo-only convenience. The HTTP implementation can call a test fixture endpoint. */
  resetDemo(): Promise<void>
}
