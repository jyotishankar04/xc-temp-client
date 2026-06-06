import type { Ref } from "react";

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}
