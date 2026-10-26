import { HttpRepository } from './httpRepository'
import { MockRepository } from './mockRepository'
import type { SamanvayRepository } from './repository'

export type DataMode = 'mock' | 'api'

export const dataMode: DataMode = import.meta.env.VITE_DATA_MODE === 'api' ? 'api' : 'mock'

export const repository: SamanvayRepository =
  dataMode === 'api' ? new HttpRepository() : new MockRepository()
