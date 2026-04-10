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
import { LanguageSwitcher } from "@/components/app/language-switcher"
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
        <div className="min-h-screen bg-background border-l border-border/40">
            <div className="p-4 md:p-10 space-y-6 md:space-y-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-6">
                            <h1 className="text-2xl font-semibold text-foreground">{t('dashboard.overview')}</h1>

                            <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-2xl border border-border/50">
                                <span className={cn(
                                    "text-[10px] font-semibold px-2 transition-colors",
                                    isAvailable ? "text-emerald-600" : "text-muted-foreground"
                                )}>
                                    {isAvailable ? t('dashboard.available') : t('dashboard.on_break')}
                                </span>
                                <button
                                    onClick={() => setIsAvailable(!isAvailable)}
                                    className={cn(
                                        "relative w-10 h-5 rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20",
                                        isAvailable ? "bg-emerald-500" : "bg-zinc-300"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
                                        isAvailable ? "translate-x-5" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>
                        <p className="text-muted-foreground italic font-medium">{t('dashboard.welcome_msg')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Button size="sm" className="h-9 px-5 rounded-xl shadow-lg shadow-primary/20 font-semibold transition-all">
                            {t('common.support')}
                        </Button>
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
