import { useUrlParams } from "./use-url-params.jsx";

export function usePageParam(defaultValue: number) {
  const { useRequiredNumberParam } = useUrlParams();

  return useRequiredNumberParam("page", defaultValue, (value) =>
    Math.max(1, value)
  );
}

export function usePageSizeParam(defaultValue: number) {
  const { useRequiredNumberParam } = useUrlParams();

  return useRequiredNumberParam("pageSize", defaultValue, (value) =>
    Math.max(1, value)
  );
}
