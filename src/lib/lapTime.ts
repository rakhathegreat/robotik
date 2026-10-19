/**
 * Lap timing helpers. Lap times live only in `audit_logs.created_at`, which Postgres stores
 * with microsecond precision, while a JS `Date` keeps milliseconds. So the fractional part is
 * read straight from the timestamp text and the whole arithmetic stays in microseconds.
 */

const TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})?$/

/** Epoch microseconds of a Postgres `timestamptz` string (0 fractional digits = exact second). */
export function toEpochMicros(timestamp: string): number {
  const match = TIMESTAMP.exec(timestamp)
  if (!match) {
    // Unknown shape (should not happen with PostgREST): keep millisecond accuracy.
    return new Date(timestamp).getTime() * 1000
  }

  const [, year, month, day, hour, minute, second, fraction, offset] = match
  const secondsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  )

  let offsetMs = 0
  if (offset && offset !== "Z") {
    const sign = offset.startsWith("-") ? -1 : 1
    const [offsetHour, offsetMinute] = offset.slice(1).replace(":", "").match(/\d{2}/g) ?? []
    offsetMs =
      sign * (Number(offsetHour ?? 0) * 60 + Number(offsetMinute ?? 0)) * 60_000
  }

  const micros = fraction ? Number(fraction.padEnd(6, "0").slice(0, 6)) : 0
  return (secondsUtc - offsetMs) * 1000 + micros
}

/** `mm:ss.SSS` — milliseconds: the microsecond fraction is converted to 3-digit millisecond accuracy. */
export function formatLapTime(micros: number): string {
  const safe = Math.max(0, micros)
  const totalSeconds = Math.floor(safe / 1_000_000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const fraction = String(Math.floor((safe % 1_000_000) / 1_000)).padStart(3, "0")

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${fraction}`
}
