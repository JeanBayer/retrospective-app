import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export class TimeUtils {
  static CHILE_TIMEZONE = 'America/Santiago';

  // Devuelve la fecha actual en UTC
  static getCurrentTimeUTC() {
    return new Date();
  }

  // Suma minutos a la fecha actual en UTC y retorna el resultado
  static addMinutesToCurrentTimeUTC(minutes: number) {
    return addMinutes(new Date(), minutes);
  }

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

  // Método corregido
  static addMinutesToCurrentTimeInChile(minutes: number) {
    const nowInChile = toZonedTime(new Date(), TimeUtils.CHILE_TIMEZONE);
    const futureTimeInChile = addMinutes(nowInChile, minutes);
    return fromZonedTime(futureTimeInChile, TimeUtils.CHILE_TIMEZONE);
  }
}
