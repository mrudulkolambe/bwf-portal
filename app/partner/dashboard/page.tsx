"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    PhoneCall,
    TrendingUp,
    Star,
    ShoppingBag,
    ExternalLink,
    ArrowUpRight,
    Search
} from "lucide-react"
import { SERVICE_PRODUCTS } from "@/lib/constants"
import { cn } from "@/lib/utils"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProductCard } from "@/components/app/product-card"
import { useTranslation } from "@/components/providers/language-provider"

const PartnerDashboard = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const [isAvailable, setIsAvailable] = React.useState(true)

    // Translated Stats
    const stats = React.useMemo(() => [
        { label: t('dashboard.stats.customers'), value: "124", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: t('dashboard.stats.calls'), value: "48", icon: PhoneCall, color: "text-green-600", bg: "bg-green-50" },
        { label: t('dashboard.stats.rating'), value: "4.8", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
        { label: t('dashboard.stats.growth'), value: "+12%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ], [t])

    // Flatten all products with their category keys for the dashboard view
    const featuredProducts = React.useMemo(() => {
        return Object.entries(SERVICE_PRODUCTS).flatMap(([category, products]) =>
            products.map(p => ({ ...p, categoryKey: category }))
        ).slice(0, 4)
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <div className="p-4 md:p-10 space-y-8 md:space-y-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground/90">
                            {t('dashboard.welcome_msg')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border/40 backdrop-blur-sm">
                        <button
                            onClick={() => setIsAvailable(true)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-500",
                                isAvailable
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn("w-1.5 h-1.5 rounded-full bg-white transition-all duration-500", !isAvailable && "scale-0 opacity-0")} />
                            {t('dashboard.available')}
                        </button>
                        <button
                            onClick={() => setIsAvailable(false)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-500",
                                !isAvailable
                                    ? "bg-zinc-800 text-white shadow-lg shadow-zinc-800/20 dark:bg-zinc-200 dark:text-zinc-900"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn("w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900 transition-all duration-500", isAvailable && "scale-0 opacity-0")} />
                            {t('dashboard.on_break')}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-3xl bg-secondary/50 group hover:bg-secondary transition-all hover:scale-[1.02] duration-300">
                            <CardContent className="p-3 md:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2.5 rounded-2xl", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold text-muted-foreground/70">{stat.label}</p>
                                    <h3 className="text-xl font-semibold">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Marketplace Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                {t('dashboard.marketplace_heading')}
                            </h2>
                            <p className="text-xs text-muted-foreground italic font-medium">{t('dashboard.marketplace_sub')}</p>
                        </div>
                        <Link href="/partner/marketplace">
                            <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5 rounded-xl">
                                {t('common.view_all')}
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
                        {featuredProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartnerDashboard
