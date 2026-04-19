import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/components/providers/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Script from "next/script";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BWF Portal",
  description: "BWF Partner Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full")}
    >
      <body cz-shortcut-listen="true" className={"min-h-full flex flex-col " + instrumentSans.className}>
        <LanguageProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </LanguageProvider>
        <Script
          id="msg91-otp-script"
          src="https://verify.msg91.com/otp-provider.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
