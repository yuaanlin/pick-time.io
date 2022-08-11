import { DateValue } from '@models/date';

/**
 * Get the DateValue of today in specific timezone,
 * for example, timezone +8 is Asia/Shanghai or Asia/Taipei timezone (UTC+8).
 * */
function getTodayInTimezone(timezone: number): DateValue {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const nd = new Date(utc + (3600000 * timezone));
  return DateValue(nd.getFullYear(), nd.getMonth() + 1, nd.getDate());
}

export default getTodayInTimezone;
