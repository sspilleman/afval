import * as tz from "npm/ical-timezones/index.ts";
import ical, {
  ICalAlarm,
  ICalAlarmType,
  ICalEvent,
  ICalEventTransparency,
} from "ical-generator";
import { ListItem, map } from "./api.ts";
import { subDays } from "date-fns/index.js";

const x = { "X-APPLE-TRAVEL-ADVISORY-BEHAVIOR": "AUTOMATIC" };

export function getIcal(items: ListItem[]) {
  const timezone = "Europe/Amsterdam";
  const cal = ical({
    name: "Afval Kalender",
    description: "Klaterbos",
    ttl: 3600 * 24,
    prodId: {
      company: "Sander Spilleman",
      product: "Afval Kalender Klaterbos",
      language: "NL",
    },
    timezone: {
      name: timezone,
      generator: tz.getVtimezoneComponent,
    },
  });
  for (const item of items) {
    for (const date of item.pickupDates) {
      // console.log(date, item._pickupTypeText);
      const description = { plain: item.description };
      const current = new Date();
      const start = subDays(new Date(date), 1);
      start.setHours(18);
      const end = subDays(new Date(date), 1);
      end.setHours(19);
      const data = {
        allDay: false,
        start: start,
        end: end,
        summary: map[item._pickupTypeText],
        description,
        created: current,
        lastModified: current,
        transparency: ICalEventTransparency.OPAQUE,
        x,
        floating: false,
        timezone,
      };
      const e: ICalEvent = cal.createEvent(data);
      const display: ICalAlarm = e.createAlarm();
      display.trigger(3600);
      display.type(ICalAlarmType.display);
      const audio: ICalAlarm = e.createAlarm();
      audio.trigger(3600);
      audio.type(ICalAlarmType.audio);
    }
  }
  return cal.toString();
}
