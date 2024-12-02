/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: string
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_NAME: string
  readonly VITE_SITE_DESCRIPTION: string
  readonly VITE_ENABLE_AUTH: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
