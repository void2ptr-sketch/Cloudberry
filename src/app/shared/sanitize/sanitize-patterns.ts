/** HTML tags, script URLs, and inline event handlers. */
export const UNSAFE_MARKUP_PATTERN = /<[^>]+>|javascript:|on\w+\s*=/i;

/** Cloud billing account / subscription identifiers. */
export const EXTERNAL_ACCOUNT_ID_PATTERN = /^[A-Za-z0-9._\-:/]+$/;

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export const SCOPE_ID_PATTERN = /^[A-Za-z0-9._-]+$/;
