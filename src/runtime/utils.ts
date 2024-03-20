export const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url))
  }
  catch (e) {
    return false
  }
}

export function fillPath(path: string, params: object = {}) {
  for (const [k, v] of Object.entries(params)) path = path.replace(`{${k}}`, encodeURIComponent(String(v)))
  return path
}
