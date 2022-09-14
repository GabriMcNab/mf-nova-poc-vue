import { createApp, h } from "vue";
import { createPinia } from "pinia";
import singleSpaVue from "single-spa-vue";
import i18nPlugin from "@/plugins/i18n";

import App from "./App.vue";
import router from "./router";

import "@/assets/scss/main.scss";

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {
        // single-spa props are available on the "this" object. Forward them to your component as needed.
        // https://single-spa.js.org/docs/building-applications#lifecycle-props
        name: this.name,
        // https://github.com/single-spa/single-spa-vue/issues/86
        mountParcel: (this as any).mountParcel,
        singleSpa: (this as any).singleSpa,
      });
    },
  },
  handleInstance: (app) => {
    app.use(createPinia());
    app.use(router);
    app.use(i18nPlugin);
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
