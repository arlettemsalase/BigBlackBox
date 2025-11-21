/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STELLAR_NETWORK: string
  readonly VITE_HORIZON_URL: string
  readonly VITE_CREATOR_PUBLIC_KEY: string
  readonly VITE_CREATOR_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
