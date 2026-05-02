"use client";

import { ConvexReactClient, ConvexProvider } from "convex/react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <ConvexProvider client={convex}>
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
      <ToastProvider
        toastProps={{
          hideIcon: true,
        }}
        placement="bottom-center"
      />
    </ConvexProvider>
  );
}
