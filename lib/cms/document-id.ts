// Next can supply a percent-encoded segment after a client-side transition.
// Decode once only when the input actually contains an encoded byte sequence.
export function documentId(value: string) {
  if (!/%[0-9a-f]{2}/i.test(value)) return value;
  try { return decodeURIComponent(value); } catch { return value; }
}
