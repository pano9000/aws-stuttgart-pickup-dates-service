import { useI18n } from "vue-i18n";

/**
 * Add our own multiMergeLocaleMessage method to the i18n Composable 
 */
export function useCustomI18n() {
  const i18n = useI18n();

  const multiMergeLocaleMessage = createMultiMergeLocaleMessageFunction(i18n);

  return {
    i18n,
    multiMergeLocaleMessage
  };

}

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

// function multiMergeLocaleMessage(i18n: ReturnType<typeof useI18n>, componentName: string, customMessages: MultiMergeLocale[]) {
//   customMessages.forEach(customMessage => {
//     const keyName = `${componentName}.${customMessage[0]}`;
//     for (const locale in customMessage[1]) {
//       i18n.mergeLocaleMessage(locale, { [keyName]: customMessage[1][locale] })
//     }
//   })
// }


export type MultiMergeLocale = [messageName: string, messages: { [locale: string]: string }]