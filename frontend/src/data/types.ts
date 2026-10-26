export type Bureau =
  | 'PGRC'
  | 'Regulation Bureau'
  | 'Anti-Ragging Cell'
  | 'SC/ST Cell'
  | "Women's Cell"
  | 'Vigilance Cell'
  | 'Legal Cell'
  | 'Regional Office'

export type CaseStatus =
  | 'New'
  | 'Triaged'
  | 'Under process'
  | 'Action initiated'
  | 'Awaiting institution'
  | 'Under scrutiny'
  | 'Escalated'
  | 'Disposed'
  | 'Transferred'

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'
export type Confidentiality = 'Normal' | 'High' | 'Sealed'
export type SlaState = 'on-track' | 'due-soon' | 'overdue' | 'closed'
export type OverlapStatus = 'pending' | 'confirmed' | 'dismissed'
export type Role = 'PGRC Officer' | 'RB Officer' | 'Cell Officer' | 'Senior Management'

export interface Programme {
  name: string
  level: 'UG' | 'PG' | 'Diploma'
  intake: number
  status: 'Approved' | 'Under review' | 'Not approved'
}

export interface Institution {
  id: string
  permanentId: string
  name: string
  shortName: string
  city: string
  state: string
  region: string
  type: string
  approvalStatus: string
  approvedTill: string
  riskScore: number
  lastInspection: string
  website: string
  programmes: Programme[]
}

export type TimelineType =
  | 'intake'
  | 'triage'
  | 'assignment'
  | 'notice'
  | 'response'
  | 'hearing'
  | 'action'
  | 'transfer'
  | 'closure'
  | 'note'

export interface TimelineEvent {
  id: string
  type: TimelineType
  title: string
  description: string
  actor: string
  at: string
  visibility: 'Internal' | 'Public' | 'Sealed'
}

export interface CaseDocument {
  id: string
  name: string
  kind: 'PDF' | 'DOCX' | 'JPG' | 'CSV'
  size: string
  uploadedAt: string
  uploadedBy: string
  sealed?: boolean
}

export interface CaseRecord {
  id: string
  caseNo: string
  institutionId: string
  title: string
  category: string
  subcategory: string
  bureau: Bureau
  status: CaseStatus
  severity: Severity
  confidentiality: Confidentiality
  receivedAt: string
  dueAt: string
  slaDays: number
  officer: string
  officerInitials: string
  lastAction: string
  lastActionAt: string
  nextAction: string
  nextActionDue: string
  source: string
  summary: string
  tags: string[]
  linkedCaseIds: string[]
  timeline: TimelineEvent[]
  documents: CaseDocument[]
}

export interface Overlap {
  id: string
  institutionId: string
  caseAId: string
  caseBId: string
  score: number
  reasons: string[]
  recommendation: string
  detectedAt: string
  status: OverlapStatus
  kind: 'Cross-bureau overlap' | 'Duplicate complaint' | 'Related case'
}

export interface AiTriage {
  category: string
  subcategory: string
  bureau: Bureau
  severity: Severity
  confidence: number
  summary: string
  entities: { label: string; value: string }[]
  missing: string[]
  duplicateOf?: string
  duplicateScore?: number
  rationale: string
}

export interface IncomingComplaint {
  id: string
  ref: string
  institutionId?: string
  institutionName: string
  source: 'Email' | 'CPGRAMS' | 'CSS' | 'Letter' | 'Web form'
  language: 'English' | 'Hindi' | 'Marathi' | 'Tamil'
  receivedAt: string
  complainantType: string
  subject: string
  originalText: string
  translatedText?: string
  ai: AiTriage
}
