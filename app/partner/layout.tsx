"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app/app-sidebar"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/components/providers/language-provider"

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return t('dashboard.overview')
    if (pathname.includes("/marketplace")) return t('dashboard.marketplace_heading')
    if (pathname.includes("/profile")) return t('common.profile')
    return ""
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b border-border/40 px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border/40" />
            <div className="flex-1">
              <h2 className="text-sm font-bold tracking-tight text-foreground">
                {getPageTitle()}
              </h2>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
