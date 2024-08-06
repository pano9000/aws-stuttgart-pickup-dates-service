import i18nConfig from "~/i18n/i18n.config"

export default function getTranslation(language: keyof typeof i18nConfig.messages | undefined, key: keyof typeof i18nConfig.messages.de): string | undefined {
  if (!language) return undefined;
  const translation = i18nConfig.messages[language][key];
  return translation
}