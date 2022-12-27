import type { DefineComponent } from "vue";

type SmoothieBase = DefineComponent<{ weight?: number }> & { el: HTMLElement };

declare module "vue-smoothie" {
  declare const Smoothie: SmoothieBase & { y: number };
  declare const OmniSmoothie: SmoothieBase & { x: number; y: number };
  
  export { Smoothie, OmniSmoothie };
}
