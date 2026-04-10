"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { PARTNER_SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/providers/language-provider"

interface ProductCardProps {
    product: {
        id: string
        name: string
        description: string
        price: number
        category: string
        categoryKey?: string
    }
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { t } = useTranslation()
    return (
        <Card className="group overflow-hidden border border-border/60 hover:border-primary/50 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 duration-500 bg-background/50 backdrop-blur-sm">
            <div className="aspect-video md:aspect-4/3 bg-muted flex items-center justify-center relative group-hover:bg-muted/30 transition-colors overflow-hidden">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/10 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                    <span className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-semibold border border-border/50 text-primary shadow-sm">
                        {PARTNER_SERVICES.find(s => s.value === product.categoryKey)?.label || product.category}
                    </span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-5">
                <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[15px] md:text-base text-zinc-900 leading-snug">{product.name}</h4>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star fill="currentColor" className="w-3 h-3" />
                            <span className="text-[10px] font-semibold text-zinc-600">4.9</span>
                        </div>
                    </div>
                    <p className="text-[13px] md:text-[14px] text-zinc-500 line-clamp-2 leading-relaxed italic">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xl md:text-lg font-semibold text-zinc-900">₹{product.price.toLocaleString()}</span>
                    </div>
                    <Button size="sm" className="h-9 md:h-10 px-4 md:px-6 rounded-xl font-semibold text-xs transition-all shadow-md">
                        {t('common.add_to_cart')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

const Star = ({ className, ...props }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

export { ProductCard }
