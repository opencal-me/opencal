import dayjs from "dayjs";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";

export const setupDayjs = () => {
  dayjs.extend(localizedFormatPlugin);
};
