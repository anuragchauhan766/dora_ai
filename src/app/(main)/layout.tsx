import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI SaaS Platform",
  description: "Train AI models with your own data and chat with them",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <TooltipProvider>
          <body className={inter.className}>
            {children}

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
