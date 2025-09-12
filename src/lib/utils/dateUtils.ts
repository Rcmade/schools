import { OTP_EXPIRES_TIME } from "@/constant";
import { format } from "date-fns";

export const formateTime = (date: string) => {
  return format(date, "hh:mm a");
};

export const getExpireTime = () => {
  return new Date(Date.now() + OTP_EXPIRES_TIME);
};
