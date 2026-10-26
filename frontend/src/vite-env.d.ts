/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default) or "api" */
  readonly VITE_DATA_MODE?: 'mock' | 'api'
  /** Base URL for the backend, e.g. http://localhost:4000/api */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
