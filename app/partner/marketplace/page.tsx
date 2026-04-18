"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Search,
    ShoppingBag,
    Filter,
    Store,
    ChevronRight,
    Loader2,
    X
} from "lucide-react"
import { SERVICE_PRODUCTS, PARTNER_SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { AppInput } from "@/components/app/input"
import { ProductCard } from "@/components/app/product-card"
import { useTranslation } from "@/components/providers/language-provider"

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
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-4">

                {/* Search & Filter Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-4 flex-1 max-w-2xl">
                        <div className='flex items-center justify-between gap-4'>
                            <div className="relative group flex-1">
                                <Search className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-300",
                                    isSearching ? "text-primary" : "text-muted-foreground/60"
                                )} />
                                <AppInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearching(true)}
                                    onBlur={() => setIsSearching(false)}
                                    placeholder={t('common.search_placeholder')}
                                    className="h-11 pl-11 bg-secondary/30 border-border/40 focus:bg-background transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                            <Button className="relative aspect-square shadow-sm bg-secondary/50 border border-border/40 hover:bg-secondary transition-colors cursor-pointer group">
                                <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-background shadow-lg shadow-primary/20">
                                    0
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Category Bar */}
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-lg text-xs font-medium transition-all border shrink-0",
                                selectedCategory === cat.value
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-secondary/30 border-border/40 hover:border-primary/40 hover:bg-secondary/80 text-muted-foreground"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-secondary/20 rounded-[3rem] border border-border/40 border-dashed">
                        <div className="p-8 rounded-[2.5rem] bg-secondary/50 border border-border/40">
                            <Search className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-bold tracking-tight">{t('marketplace.no_results')}</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">{t('marketplace.try_adjusting')}</p>
                        </div>
                        <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="rounded-2xl h-10 px-6 font-bold border-border/60 hover:border-primary/40 transition-all text-xs">
                            {t('marketplace.clear_filters')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MarketplacePage
