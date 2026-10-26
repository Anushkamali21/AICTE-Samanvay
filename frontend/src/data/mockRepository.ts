import type {
  CaseRecord,
  IncomingComplaint,
  Institution,
  Overlap,
  OverlapStatus,
  TimelineEvent,
} from './types'
import type {
  AssignComplaintInput,
  CaseActionInput,
  SamanvayRepository,
} from './repository'
import {
  cases as seedCases,
  incomingComplaints as seedComplaints,
  institutions as seedInstitutions,
  overlaps as seedOverlaps,
} from './mock'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function wait(ms = 120): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

/**
 * In-memory repository used by the demo. It behaves like an async API so the UI
 * already handles loading and mutation flows correctly.
 */
export class MockRepository implements SamanvayRepository {
  private institutions = clone(seedInstitutions)
  private cases = clone(seedCases)
  private overlaps = clone(seedOverlaps)
  private complaints = clone(seedComplaints)

  async listInstitutions(): Promise<Institution[]> {
    await wait()
    return clone(this.institutions)
  }

  async listCases(): Promise<CaseRecord[]> {
    await wait()
    return clone(this.cases)
  }

  async listOverlaps(): Promise<Overlap[]> {
    await wait()
    return clone(this.overlaps)
  }

  async listComplaints(): Promise<IncomingComplaint[]> {
    await wait()
    return clone(this.complaints)
  }

  async recordCaseAction(caseId: string, input: CaseActionInput): Promise<CaseRecord> {
    await wait(180)
    const index = this.cases.findIndex((record) => record.id === caseId)
    if (index < 0) throw new Error(`Case ${caseId} not found`)

    const event: TimelineEvent = {
      id: `action-${Date.now()}`,
      type: 'note',
      title: 'Action recorded by officer',
      description: input.text,
      actor: input.actor,
      at: new Date().toISOString(),
      visibility: input.visibility,
    }

    const updated: CaseRecord = {
      ...this.cases[index],
      status: input.status,
      lastAction: input.text,
      lastActionAt: event.at,
      timeline: [event, ...this.cases[index].timeline],
    }
    this.cases[index] = updated
    return clone(updated)
  }

  async decideOverlap(overlapId: string, status: OverlapStatus): Promise<Overlap> {
    await wait(160)
    const index = this.overlaps.findIndex((overlap) => overlap.id === overlapId)
    if (index < 0) throw new Error(`Overlap ${overlapId} not found`)
    const updated = { ...this.overlaps[index], status }
    this.overlaps[index] = updated
    return clone(updated)
  }

  async assignComplaint(
    complaintId: string,
    _input: AssignComplaintInput,
  ): Promise<{ complaintId: string }> {
    await wait(180)
    this.complaints = this.complaints.filter((complaint) => complaint.id !== complaintId)
    return { complaintId }
  }

  async dismissComplaint(complaintId: string, _reason?: string): Promise<{ complaintId: string }> {
    await wait(140)
    this.complaints = this.complaints.filter((complaint) => complaint.id !== complaintId)
    return { complaintId }
  }

  async resetDemo(): Promise<void> {
    await wait(100)
    this.institutions = clone(seedInstitutions)
    this.cases = clone(seedCases)
    this.overlaps = clone(seedOverlaps)
    this.complaints = clone(seedComplaints)
  }
}
