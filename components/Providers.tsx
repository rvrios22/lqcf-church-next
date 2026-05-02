"use client";

import { ConvexReactClient, ConvexProvider } from "convex/react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ToastProvider
        toastProps={{
          hideIcon: true,
        }}
        placement="bottom-center"
      />
      {children}
    </ConvexProvider>
  );
}
