import { createApp, Directive, DirectiveBinding } from "vue";
import "./style.css";
import App from "./App.vue";

type TSmoothieBinding =
  | {
      weight: number;
      translationFn: () => void;
    }
  | number;

createApp(App)
  // https://vuejs.org/guide/reusability/custom-directives.html#introduction
  .directive("smoothie", {
    created(el, binding: DirectiveBinding<TSmoothieBinding>) {},
    unmounted(el) {},
  })
  //
  .mount("#app");
