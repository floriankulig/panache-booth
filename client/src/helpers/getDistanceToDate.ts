import { formatDistance } from "date-fns";
import { enGB } from "date-fns/locale";

export const getDistanceToDate = (date: Date, refDate?: Date): string => {
  const referenceDate = refDate || new Date();

  const distance = formatDistance(date, referenceDate, {
    addSuffix: true,
    locale: enGB,
  });

  return distance.replace("about ", "");
};
