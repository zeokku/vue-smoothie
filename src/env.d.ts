/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

type CustomEnvVars = {
  readonly __OMNI: boolean;
};

interface ImportMetaEnv extends CustomEnvVars {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
