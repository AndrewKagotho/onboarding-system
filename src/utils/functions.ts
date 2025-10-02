const normalizeNumber = (num: number) => {
  if (num < 10) return `0${num}`
  return num
}

export const parseDate = (dateArg: number) => {
  const dateObj = new Date(dateArg)

  const date = normalizeNumber(dateObj.getUTCDate())
  const normalizedMonth = normalizeNumber(dateObj.getUTCMonth() + 1)

  const year = dateObj.getUTCFullYear()

  return `${date}-${normalizedMonth}-${year}`
}

export const parseDateTime = (dateArg: number) => {
  const dateObj = new Date(dateArg)

  const date = normalizeNumber(dateObj.getUTCDate())
  const normalizedMonth = normalizeNumber(dateObj.getUTCMonth() + 1)

  const year = dateObj.getUTCFullYear()
  const hours = normalizeNumber(dateObj.getHours())
  const minutes = normalizeNumber(dateObj.getMinutes())

  return `${date}-${normalizedMonth}-${year} || ${hours}:${minutes}`
}

export const formatCalendarDate = (dateArg: string) => {
  const dateArr = dateArg.split('-')
  return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
}
