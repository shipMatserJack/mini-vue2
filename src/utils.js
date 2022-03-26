export function isFuction (val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return typeof val === 'object' && val !== null
}