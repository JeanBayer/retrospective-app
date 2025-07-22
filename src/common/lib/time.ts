import { endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export class TimeUtils {
  static CHILE_TIMEZONE = 'America/Santiago';
  static getTodayStartInChile() {
    const nowInChile = toZonedTime(new Date(), TimeUtils.CHILE_TIMEZONE);
    const startOfDayInChile = startOfDay(nowInChile);
    return fromZonedTime(startOfDayInChile, TimeUtils.CHILE_TIMEZONE);
  }

  static getCurrentTimeInChile() {
    const nowInChile = toZonedTime(new Date(), TimeUtils.CHILE_TIMEZONE);
    return fromZonedTime(nowInChile, TimeUtils.CHILE_TIMEZONE);
  }

  static getTodayRangeInChile() {
    const nowInChile = toZonedTime(new Date(), TimeUtils.CHILE_TIMEZONE);

    const startOfDayInChile = startOfDay(nowInChile);
    const endOfDayInChile = endOfDay(nowInChile);

    return {
      start: fromZonedTime(startOfDayInChile, TimeUtils.CHILE_TIMEZONE),
      end: fromZonedTime(endOfDayInChile, TimeUtils.CHILE_TIMEZONE),
    };
  }
}
