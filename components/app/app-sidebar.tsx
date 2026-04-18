"use client"

import {
  LayoutDashboard,
  User,
  ShoppingBag,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "@/components/app/language-switcher"
import { useTranslation } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const mainNav = [
    {
      title: t('dashboard.overview'),
      url: "/partner/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('dashboard.marketplace_heading'),
      url: "/partner/marketplace",
      icon: ShoppingBag,
    },
    {
      title: t('common.profile'),
      url: "/partner/profile",
      icon: User,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/partner/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            B
          </div>
          <span className="group-data-[collapsible=icon]:hidden">BWF</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden uppercase tracking-wider font-bold text-[10px] text-muted-foreground/60">
            {t('common.main_menu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-4 rounded-xl transition-all duration-200",
                      pathname === item.url
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "hover:bg-secondary/80 text-muted-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className={cn("w-5 h-5", pathname === item.url ? "text-primary" : "text-muted-foreground")} />
                      <span className="group-data-[collapsible=icon]:hidden font-medium ml-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/40 space-y-4">
        <div className="group-data-[collapsible=icon]:hidden px-2">
          <LanguageSwitcher />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/partner/profile"}
              tooltip={t('common.profile')}
              className={cn(
                "h-12 px-2 rounded-xl transition-all duration-200",
                pathname === "/partner/profile" ? "bg-primary/10" : "hover:bg-secondary/80"
              )}
            >
              <Link href="/partner/profile" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-bold text-foreground leading-none">Partner Name</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{t('common.view_profile')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-11 px-4 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-200"
              tooltip={t('common.logout')}
            >
              <LogOut className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium ml-1">{t('common.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
