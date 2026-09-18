/**
 * Format number to Vietnamese Dong currency display
 * @param amount number
 * @param showSign boolean (optional, prepend + or -)
 */
export function formatVND(amount: number, showSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('vi-VN').format(absAmount) + ' ₫';
  
  if (showSign) {
    if (isNegative) return `-${formatted}`;
    if (amount > 0) return `+${formatted}`;
  }
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format raw number string for text inputs with comma separators
 */
export function formatNumberInput(value: number | string): string {
  if (value === '' || value === undefined || value === null) return '';
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Parse formatted currency input back to raw number
 */
export function parseCurrencyInput(value: string): number {
  if (!value) return 0;
  const cleaned = value.toString().replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Format ISO date string YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

/**
 * Relative date description (Hôm nay, Hôm qua, Ngày mai, hoặc DD/MM)
 */
export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const today = new Date();
  const target = new Date(dateStr + 'T00:00:00');
  
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((target.getTime() - todayZero.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === -1) return 'Hôm qua';
  if (diffDays === 1) return 'Ngày mai';
  
  return formatDate(dateStr);
}

/**
 * Get current year-month in format YYYY-MM
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get current date in format YYYY-MM-DD
 */
export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate remaining days in the current month
 */
export function getRemainingDaysInMonth(): number {
  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  return Math.max(1, totalDays - currentDay + 1);
}

/**
 * Total days in current month
 */
export function getTotalDaysInMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
