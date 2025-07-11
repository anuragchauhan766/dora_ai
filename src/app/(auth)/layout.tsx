import { Bot } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "@/providers";
export const metadata = {
  title: "AI SaaS Platform",
  description: "Train AI models with your own data and chat with them",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="flex h-14 items-center px-4 lg:px-6">
              <Link className="flex items-center justify-center" href="/">
                <Bot className="h-6 w-6" />
                <span className="ml-2 text-2xl font-bold">Dora AI</span>
              </Link>
              <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#features">
                  Features
                </Link>
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#how-it-works">
                  How It Works
                </Link>
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#pricing">
                  Pricing
                </Link>
              </nav>
            </header>
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
        </Providers>
      </body>
    </html>
  );
}
