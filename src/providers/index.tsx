"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProviderComponent } from "./clerkProvider";
import { ThemeProvider } from "./themeProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ClerkProviderComponent>
        <TooltipProvider>{children}</TooltipProvider>
      </ClerkProviderComponent>
    </ThemeProvider>
  );
}
