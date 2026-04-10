"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { en, mr, hi, Dictionary, Locale, locales } from '@/lib/i18n/dictionaries'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const dictionaries = { en, mr, hi }

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('app-locale') as Locale
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
    setIsLoaded(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('app-locale', newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
  }, [])

  const t = useCallback((keyPath: string): string => {
    const keys = keyPath.split('.')
    let current: any = dictionaries[locale]

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        // Fallback to English if key missing in current locale
        return getFallbackTranslation(keyPath)
      }
    }

    return typeof current === 'string' ? current : keyPath
  }, [locale])

  const getFallbackTranslation = (keyPath: string): string => {
    const keys = keyPath.split('.')
    let current: any = en
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return keyPath
      }
    }
    return typeof current === 'string' ? current : keyPath
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
