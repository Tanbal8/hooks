const set = (object, path, value) => {
  const keys = path.split('.')
  const result = { ...object };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined) {
      current[key] = {};
    }
    else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

const get = (object, path) => {
  const keys = path.split('.')
  let current = object;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (current === undefined || current === null) {
      return null;
    }
    current = current[key];
  }
  return current;
}

const toPath = (...keys) => keys.join('.');

export {
  set,
  get,
  toPath,
};