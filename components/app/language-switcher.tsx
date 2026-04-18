"use client"

import React from 'react'
import { useTranslation } from '@/components/providers/language-provider'
import { Locale, locales } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
    const { locale, setLocale } = useTranslation()

    const languageNames: Record<Locale, string> = {
        en: "English",
        mr: "मराठी",
        hi: "हिन्दी"
    }

    return (
        <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-lg border border-border/40 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-0.5" />
            {locales.map((l) => (
                <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300",
                        locale === l
                            ? "bg-white text-zinc-900 shadow-sm border border-border/20"
                            : "text-zinc-500 hover:text-zinc-700 hover:bg-white/50"
                    )}
                >
                    {languageNames[l]}
                </button>
            ))}
        </div>
    )
}

export { LanguageSwitcher }
