import React from "react";

export type PageProps = {
  params: { _id: string };
  searchParams: SearchParams;
};

export type SearchParamsPromise = Promise<{ [key: string]: string }>;
export type ParamsPromise = Promise<{ [key: string]: string }>;

export type SearchParams = {
  [key: string]: string | number | boolean;
};

export type PagePropsPromise = {
  params: ParamsPromise;
  searchParams: SearchParamsPromise;
};

export type Children = {
  children: React.ReactNode;
};

export type SignatureReturnT = {
  timestamp: number;
  upload_preset: string;
  source: string;
  signature: string;
};

export type StripStringArray<T> = {
  [K in keyof T]: T[K] extends string[]
    ? string | undefined
    : T[K] extends string | string[] | undefined
    ? string | undefined
    : T[K] extends object
    ? StripStringArray<T[K]>
    : T[K];
};
