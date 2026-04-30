export function pick(object, keys) {
  return keys.reduce((accumulator, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      accumulator[key] = object[key];
    }

    return accumulator;
  }, {});
}
