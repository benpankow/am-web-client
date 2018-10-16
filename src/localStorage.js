export function getLSValueWithDefault(key, def) {
  const value = localStorage.getItem(key);
  if (value) {
    const savedValue = JSON.parse(value);
    if (typeof savedValue === "object") {
      const combined = { ...def, ...savedValue };
      localStorage.setItem(key, JSON.stringify(combined));
      return combined;
    } else {
      return savedValue;
    }
  } else {
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  }
}

export function setLSValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
