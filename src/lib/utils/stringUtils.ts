import { OTP_HASH_NAME } from "@/constant";
import { PageProps } from "@/types";

export const formateVerifyHashString = ({
  email,
  otp,
}: {
  email: string;
  otp: string | number;
}) => {
  return `${email}|${otp}`;
};

export const createQueryString = (
  searchParams: PageProps["searchParams"],
  changeParams?: PageProps["searchParams"]
): string => {
  if (changeParams) {
    searchParams = { ...searchParams, ...changeParams };
  }
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === "") {
      return;
    }
    params.set(key, value.toString());
  });
  return `?${params.toString()}`;
};

export const getOtpRedirectUrl = ({
  searchParams,
  email,
  hash,
  basePath,
}: {
  hash: string;
  email: string;
  searchParams?: string;
  basePath?: string;
}) => {
  const updateSearchParams = createQueryString(
    searchParamsToObject(searchParams || ""),
    {
      email: email,
      [OTP_HASH_NAME]: hash,
    }
  );
  return `${basePath || "/auth/login"}${updateSearchParams}`;
};

export function searchParamsToObject(
  searchParams: string
): PageProps["searchParams"] {
  const params = new URLSearchParams(searchParams);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

export const getInitials = (name: string | undefined) => {
  if (!name) return "U"; // Default fallback for missing names
  const [firstName, lastName] = name
    .replaceAll("undefined", "")
    .trim()
    .split(" ");
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};
