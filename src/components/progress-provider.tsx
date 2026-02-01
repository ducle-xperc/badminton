"use client";

import NextTopLoader from "nextjs-toploader";

export function ProgressProvider() {
  return (
    <NextTopLoader
      color="#135bec"
      height={3}
      showSpinner={false}
      shadow="0 0 10px #135bec,0 0 5px #135bec"
    />
  );
}
