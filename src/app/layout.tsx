import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "gitOnboard",
  description: "Your openSource guide",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}>
      <html lang="en" className={`${GeistSans.variable} bg-background`} suppressHydrationWarning>
        <body className={cn(
          "min-h-screen antialiased",
          "bg-white dark:bg-black",
        )}>
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
            }}
          /> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
