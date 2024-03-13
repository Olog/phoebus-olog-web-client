import { useEffect, useRef } from "react";

function useMountEffect(effect, deps = [], afterMount) {
  const didMountRef = useRef(false);

  useEffect(() => {
    let cleanup;
    if (didMountRef.current === afterMount) {
      cleanup = effect();
    }
    didMountRef.current = true;
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useEffectOnMount(effect) {
  useMountEffect(effect, [], false);
}

export function useEffectAfterMount(effect, deps) {
  useMountEffect(effect, deps, true);
}
