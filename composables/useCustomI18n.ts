import { useI18n } from "vue-i18n";

/**
 * Add our own multiMergeLocaleMessage method to the i18n Composable 
 */
export function useCustomI18n() {
  const i18n = useI18n();

  //@TODO fix type errors
  //@ts-expect-error - TS error: Property '"en-US"' is missing in type
  const multiMergeLocaleMessage = createMultiMergeLocaleMessageFunction(i18n);

  return {
    i18n,
    multiMergeLocaleMessage
  };

}
//@TODO add support for interpolations?
function createMultiMergeLocaleMessageFunction(i18n: ReturnType<typeof useI18n>) {
  const locali18n = i18n;

  return function multiMergeLocaleMessage(componentName: string, customMessages: MultiMergeLocale[]) {
    customMessages.forEach(customMessage => {
      const keyName = `${componentName}.${customMessage[0]}`;
      for (const locale in customMessage[1]) {
        locali18n.mergeLocaleMessage(locale, { [keyName]: customMessage[1][locale] })
      }
    })
  }

}

export type MultiMergeLocale = [messageName: string, messages: { [locale: string]: string }]