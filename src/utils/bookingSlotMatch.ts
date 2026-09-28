import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Booking, TIME_SLOTS } from "../constants";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Europe/Copenhagen";

/** Map API booking UTC range → local day + TIME_SLOTS label. */
export function bookingToLocalSlot(booking: Booking): { day: string; timeSlot: string } {
  const start = dayjs.utc(booking.startTime).tz(TZ);
  const end = dayjs.utc(booking.endTime).tz(TZ);
  const timeSlot = `${start.format("HH:mm")}-${end.format("HH:mm")}`;
  return {
    day: start.format("YYYY-MM-DD"),
    timeSlot: TIME_SLOTS.includes(timeSlot) ? timeSlot : timeSlot,
  };
}

export function bookingMatchesCell(
  booking: Booking,
  cellDayIso: string,
  cellTimeSlot: string
): boolean {
  const { day, timeSlot } = bookingToLocalSlot(booking);
  const cellDay = dayjs(cellDayIso).tz(TZ).format("YYYY-MM-DD");
  // weekDays from dayjs().toISOString() — also compare plain local calendar day
  const cellDayFallback = dayjs(cellDayIso).format("YYYY-MM-DD");
  return (day === cellDay || day === cellDayFallback) && timeSlot === cellTimeSlot;
}
