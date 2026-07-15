/** Guest identity only — never store cart items/qty in localStorage. */

const KEY = 'abg_guest_id'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** In-memory fallback when localStorage is unavailable (private mode / SSR). */
let memoryGuestId: string | null = null

function readStorage(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function writeStorage(value: string): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(KEY, value)
  } catch {
    // Privacy mode — keep in memory only for this session
  }
}

function removeStorage(): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

function isValidGuestId(value: string | null | undefined): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

function createUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** Read only — does not create. */
export function getGuestId(): string | null {
  const fromStorage = readStorage()
  if (isValidGuestId(fromStorage)) return fromStorage

  if (fromStorage) {
    // Corrupt value — remove so we don't keep sending bad ids
    removeStorage()
  }

  if (isValidGuestId(memoryGuestId)) return memoryGuestId
  return null
}

/**
 * Lazy create: only call on first guest cart mutation (addItem).
 * Never call on page load / refresh / GET.
 */
export function getOrCreateGuestId(): string {
  const existing = getGuestId()
  if (existing) return existing

  const id = createUuid()
  memoryGuestId = id
  writeStorage(id)
  return id
}

/** Clear after successful merge into signed-in cart. */
export function clearGuestId(): void {
  memoryGuestId = null
  removeStorage()
}
