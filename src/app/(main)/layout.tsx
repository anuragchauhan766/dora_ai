import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { DashboardNavbar } from "@/components/dashboard/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI SaaS Platform",
  description: "Train AI models with your own data and chat with them",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen flex-col">
            <DashboardNavbar />
            <main className="flex flex-1 items-center justify-center">{children}</main>

            <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Dora AI. All rights reserved.</p>
              <nav className="flex gap-4 sm:ml-auto sm:gap-6">
                <Link className="text-xs underline-offset-4 hover:underline" href="#">
                  Terms of Service
                </Link>
                <Link className="text-xs underline-offset-4 hover:underline" href="#">
                  Privacy
                </Link>
              </nav>
            </footer>
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
      </html>
    </ClerkProvider>
  );
}
