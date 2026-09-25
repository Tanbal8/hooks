import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {

  const [value, setValue] = useState(initialValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    }
    catch {
      // use initialValue
    }
    finally {
      setInitialized(true);
    }
  }, [key]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, initialized]);

  return [value, setValue];
}

export default useLocalStorage;