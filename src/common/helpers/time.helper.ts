import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { config } from 'dotenv';

config(); // Đảm bảo đọc file .env

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = process.env.TIMEZONE || 'UTC';

console.log(
  'Current time in default timezone:',
  dayjs().tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
); // Kiểm tra thời gian hiện tại trong timezone mặc định

export function formatToTimezone(
  date?: Date | string,
  format = 'YYYY-MM-DD HH:mm:ss',
  tz = DEFAULT_TIMEZONE,
): string {
  return dayjs(date || new Date())
    .tz(tz)
    .format(format);
}
