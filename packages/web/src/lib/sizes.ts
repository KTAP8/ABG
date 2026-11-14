/** Clothing size order for shop pills. Unknown labels fall to the end, then A–Z. */
const SIZE_RANK: Record<string, number> = {
  xxs: 10,
  xs: 20,
  s: 30,
  small: 30,
  m: 40,
  medium: 40,
  l: 50,
  large: 50,
  xl: 60,
  xxl: 70,
  '2xl': 70,
  xxxl: 80,
  '3xl': 80,
  freesize: 100,
  'free size': 100,
  'one size': 100,
  os: 100,
}

function sizeRank(size: string) {
  const key = size.trim().toLowerCase()
  if (key in SIZE_RANK) return SIZE_RANK[key]
  const numeric = Number(key)
  if (!Number.isNaN(numeric) && key !== '') return 200 + numeric
  return 500
}

export function compareSizes(a: string, b: string) {
  const diff = sizeRank(a) - sizeRank(b)
  if (diff !== 0) return diff
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

export function sortVariantsBySize<T extends { size: string }>(variants: T[]): T[] {
  return [...variants].sort((left, right) => compareSizes(left.size, right.size))
}
