export function toLocalizePlaceholders(text: string): string {
  let index = 0;
  return text.replace(/\{[^}]+\}/g, () => {
    const placeholder = index === 0 ? '{$PH}' : `{$PH_${index}}`;
    index += 1;
    return placeholder;
  });
}

export function buildTranslationMap(catalog: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(catalog).map(([messageId, text]) => [messageId, toLocalizePlaceholders(text)]),
  );
}
