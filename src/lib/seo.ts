export const SITE_URL = 'https://salaamcolamy.com'

export function canonicalPath(pathname: string) {
  // Ensure leading slash, no trailing slash (except root)
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path
}

export function canonicalUrl(pathname: string) {
  return new URL(canonicalPath(pathname), SITE_URL).toString()
}

