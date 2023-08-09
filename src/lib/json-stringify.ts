/**
 * Version of JSON.stringify that supports BigInts.
 */
export function JSONStringify(object: any) {
  return JSON.stringify(
    object,
    (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
  );
}
