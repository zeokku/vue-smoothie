/// <reference types="vite/client" />

type CustomEnvVars = {
  readonly __OMNI: boolean;
};

interface ImportMetaEnv extends CustomEnvVars {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
