import { trans } from "@musement/i18n";
import type { Plugin } from "vue";
import type { TranslationOptions } from "@musement/i18n";

const lang = "en-GB";
const namespace = "b2b-nova-fe";

export default {
  install: (app) => {
    app.config.globalProperties.$t = (
      id: string,
      options?: TranslationOptions
    ) => trans(lang, namespace, id, options);
  },
} as Plugin;
