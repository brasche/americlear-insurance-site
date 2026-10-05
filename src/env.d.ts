/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_LC_WIDGET_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
