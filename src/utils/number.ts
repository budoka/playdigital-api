import { Sort } from 'src/constants/enums';

/**
 * Generate a random number.
 * @param min Min value.
 * @param max Max value.
 */
export function RandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compare both values.
 * @param a Value A.
 * @param b Value B.
 * @param inverse Invert the comparison.
 */
export function compare(a: number | string, b: number | string, inverse?: boolean) {
  if (a! && b! && typeof a !== typeof b) throw new Error('Invalid comparation types');

  let v1 = a;
  let v2 = b;

  if (inverse) {
    v1 = b;
    v2 = a;
  }

  if (typeof v1 === 'number' && typeof v2 === 'number') {
    return v1 - v2;
  }

  v1 = v1 ? v1 : '';
  v2 = v2 ? v2 : '';

  return v1.toString().localeCompare(v2.toString());
}
