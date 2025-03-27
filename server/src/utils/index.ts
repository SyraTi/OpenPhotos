/**
 * 度分秒转小数格式
 * @param {number} degrees 度
 * @param {number} minutes 分
 * @param {number} seconds 秒
 * @param {'S' | 'N' | 'E' | 'W'} direction 方向
 */
export function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: 'S' | 'N' | 'E' | 'W',
) {
  let decimal = degrees + minutes / 60 + seconds / 3600

  // 南纬 (S) 或 西经 (W) 需要取负数
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal
  }

  return decimal
}
