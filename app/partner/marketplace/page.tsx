"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    ShoppingBag,
    ArrowLeft,
    Filter,
    Store,
    ChevronRight,
    Loader2
} from "lucide-react"
import { SERVICE_PRODUCTS, PARTNER_SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { AppInput } from "@/components/app/input"
import { ProductCard } from "@/components/app/product-card"
import { useTranslation } from "@/components/providers/language-provider"
import { LanguageSwitcher } from "@/components/app/language-switcher"

const MarketplacePage = () => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
    const [isSearching, setIsSearching] = useState(false)

    // Get all products and categories
    const categories = [
        { label: "All Products", value: "all" },
        ...PARTNER_SERVICES.map(s => ({ label: s.label, value: s.value }))
    ]

    const allProducts = useMemo(() => {
        return Object.entries(SERVICE_PRODUCTS).flatMap(([category, products]) =>
            products.map(p => ({ ...p, categoryKey: category }))
        )
    }, [])

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || product.categoryKey === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory, allProducts])

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-10">
                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <Link href="/partner/dashboard" className="group flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors">
                        <div className="p-1.5 rounded-xl group-hover:bg-primary/5 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[13px] font-semibold tracking-tight">{t('common.back_to_dashboard')}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="relative">
                            <ShoppingBag className="w-6 h-6 text-foreground" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-background">
                                0
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero / Search Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold flex items-center gap-3">
                            <Store className="w-6 h-6 text-primary" />
                            {t('marketplace.title')}
                        </h1>
                        <p className="text-zinc-500 font-medium text-xs leading-relaxed">{t('marketplace.subtitle')}</p>
                    </div>

                    <div className="relative max-w-2xl group">
                        <Search className={cn(
                            "absolute left-4 top-[12px] w-5 h-5 z-10 transition-colors duration-300",
                            isSearching ? "text-primary" : "text-zinc-400"
                        )} />
                        <AppInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setIsSearching(false)}
                            placeholder={t('common.search_placeholder')}
                            className="h-11 pl-12 pr-4 bg-zinc-50 border-zinc-200 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-2xl text-[13px] font-semibold transition-all border",
                                selectedCategory === cat.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border hover:border-primary/40 hover:bg-secondary/50 text-muted-foreground"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="p-6 rounded-[2rem] bg-secondary/30">
                            <Search className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold">{t('marketplace.no_results')}</h3>
                            <p className="text-muted-foreground">{t('marketplace.try_adjusting')}</p>
                        </div>
                        <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="rounded-2xl">
                            {t('marketplace.clear_filters')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Star icon is now managed within ProductCard

export default MarketplacePage
