/**
 * Get the parsed value with the expected type.
 * @param value value to parse.
 */
export function parseValue(value: string) {
  let val: string | number | boolean = value;
  if (val === '0' || !!Number(val)) val = Number(val);
  else if (val && /^true$/i.test(val)) val = true;
  else if (val && /^false$/i.test(val)) val = false;
  return val;
}
