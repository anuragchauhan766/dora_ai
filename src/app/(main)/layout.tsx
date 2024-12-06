import BreadcrumbCustom from "@/components/header/Breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { getProjects } from "@/actions/project/getProject";
import { AppSidebar } from "@/components/app-sidebar";
import { UserButton } from "@clerk/nextjs";
import { HelpCircle, MessageSquare } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI SaaS Platform",
  description: "Train AI models with your own data and chat with them",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const projects = await getProjects();
  return (
    <html lang="en">
      <ClerkProvider>
        <TooltipProvider>
          <body className={inter.className}>
            <div className="flex min-h-screen flex-col">
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-3">
                      <SidebarTrigger />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <BreadcrumbCustom projects={projects} />
                    </div>
                    <div className="ml-auto flex items-center space-x-4 px-3">
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5" />
                        <span className="sr-only">Feedback</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Help</span>
                      </Button>
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "size-8",
                          },
                        }}
                      />
                    </div>
                  </header>
                  <main className="flex-1">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              stacked
            />
          </body>
        </TooltipProvider>
      </ClerkProvider>
    </html>
  );
}
