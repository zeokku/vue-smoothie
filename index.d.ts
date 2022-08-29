import type { DefineComponent } from "vue";

type SmoothieComponent = DefineComponent<{ weight?: number }>;

declare const Smoothie: SmoothieComponent;
declare const OmniSmoothie: SmoothieComponent;

export { Smoothie, OmniSmoothie };
