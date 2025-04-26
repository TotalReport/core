// Helper function to get URL parameter with fallback value
export const getUrlParamNumber = (
  paramName: string,
  defaultValue: number
): number => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const param = params.get(paramName);
    if (param == null) {
      return defaultValue;
    }
    const parsedValue = parseInt(param);
    if (isNaN(parsedValue)) {
      return defaultValue;
    }
    return parsedValue;
  }
  return defaultValue;
};

export const getNullableUrlParamNumber = (
  paramName: string
): number | null=> {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const param = params.get(paramName);
    if (param == null) {
      return null;
    }
    const parsedValue = parseInt(param);
    if (isNaN(parsedValue)) {
      return null;
    }
    return parsedValue;
  }
  return null;
};
