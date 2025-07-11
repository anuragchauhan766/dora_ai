"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export const ClerkProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk",
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          // Primary colors
          colorPrimary: "var(--primary)",
          colorDanger: "var(--destructive)",
          colorSuccess: "var(--chart-3)", // Using chart-3 as success color
          colorWarning: "var(--chart-4)", // Using chart-4 as warning color
          colorNeutral: "var(--muted-foreground)",

          // Text colors
          colorText: "var(--foreground)",
          colorTextOnPrimaryBackground: "var(--primary-foreground)",
          colorTextSecondary: "var(--muted-foreground)",

          // Background colors
          colorBackground: "var(--background)",
          colorInputText: "var(--foreground)",
          colorInputBackground: "transparent",
          colorShimmer: "var(--muted)",

          // Typography
          fontFamily: "var(--font-sans)",
          fontFamilyButtons: "var(--font-sans)",
          fontSize: "0.875rem", // 14px - slightly larger than default for better readability
          fontWeight: {
            normal: 400,
            medium: 500,
            bold: 700,
          },

          // Layout
          borderRadius: "var(--radius)",
          // spacingUnit: "var(--spacing)",
        },
        elements: {
          organizationSwitcherTrigger:
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground  w-full h-12 [&_.cl-userPreview]:font-bold hover:[&_.cl-userPreview]:text-sidebar-accent-foreground justify-between [&_.cl-avatarBox]:size-8 group-data-[state=collapsed]:p-0",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};
