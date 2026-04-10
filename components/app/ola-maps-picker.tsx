"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { OlaMaps } from 'olamaps-web-sdk'
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppInput } from './input'

interface Location {
    lat: number
    lng: number
    address?: string
}

interface OlaMapsPickerProps {
    value?: Location
    onChange?: (location: Location) => void
    className?: string
    placeholder?: string
}

const API_KEY = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY || ''
const AUTOCOMPLETE_URL = 'https://api.olamaps.io/places/v1/autocomplete'
const REVERSE_GEOCODE_URL = 'https://api.olamaps.io/places/v1/reverse-geocode'

export const OlaMapsPicker: React.FC<OlaMapsPickerProps> = ({
    value,
    onChange,
    className,
    placeholder = "Search for a location..."
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isMapMoving, setIsMapMoving] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return

        const initMap = async () => {
            const olaMaps = new OlaMaps({ apiKey: API_KEY })

            const map = await olaMaps.init({
                style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
                container: mapContainerRef.current!,
                center: value ? [value.lng, value.lat] : [77.5946, 12.9716], // Default to Bangalore
                zoom: 15,
            })

            mapInstanceRef.current = map

            map.on('load', () => {
                // Hide POI layers to remove "charger and other stuff" and fix missing icon errors
                const layers = map.getStyle().layers
                layers?.forEach((layer: any) => {
                    if (
                        layer.id.includes('poi') ||
                        layer.id.includes('place') ||
                        layer.id.includes('transit') ||
                        layer.id.includes('charger') ||
                        layer.id.includes('docking')
                    ) {
                        map.setLayoutProperty(layer.id, 'visibility', 'none')
                    }
                })
            })

            // Track movement for fixed pin logic
            map.on('movestart', () => {
                setIsMapMoving(true)
            })

            map.on('moveend', () => {
                setIsMapMoving(false)
                const center = map.getCenter()
                handleLocationChange(center.lat, center.lng, true)
            })
        }

        initMap()

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // Update map when value changes externally (e.g. from search selection)
    useEffect(() => {
        if (value && mapInstanceRef.current) {
            const currentCenter = mapInstanceRef.current.getCenter()
            if (currentCenter.lat !== value.lat || currentCenter.lng !== value.lng) {
                mapInstanceRef.current.flyTo({
                    center: [value.lng, value.lat],
                    speed: 1.2,
                    curve: 1.42
                })
            }
        }
    }, [value])

    const handleLocationChange = async (lat: number, lng: number, fetchAddress = false) => {
        let address = value?.address

        if (fetchAddress) {
            try {
                const response = await fetch(`${REVERSE_GEOCODE_URL}?latlng=${lat},${lng}&api_key=${API_KEY}`, {
                    headers: { 'X-Request-Id': (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).substring(7) }
                })
                const data = await response.json()
                if (data.results && data.results[0]) {
                    address = data.results[0].formatted_address
                }
            } catch (error) {
                console.error('Error reverse geocoding:', error)
            }
        }

        onChange?.({ lat, lng, address })
        if (address) setSearchQuery(address)
    }

    const fetchSuggestions = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([])
            return
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()
        setIsSearching(true)

        try {
            const response = await fetch(`${AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}&api_key=${API_KEY}`, {
                signal: abortControllerRef.current.signal,
                headers: { 'X-Request-Id': (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).substring(7) }
            })
            const data = await response.json()
            setSuggestions(data.predictions || [])
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching suggestions:', error)
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        setShowSuggestions(true)

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = setTimeout(() => {
            fetchSuggestions(query)
        }, 500)
    }

    const selectSuggestion = async (suggestion: any) => {
        setSearchQuery(suggestion.description)
        setShowSuggestions(false)
        setIsLoading(true)

        try {
            if (suggestion.geometry?.location) {
                const { lat, lng } = suggestion.geometry.location
                handleLocationChange(lat, lng)
                return
            }

            const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(suggestion.description)}&api_key=${API_KEY}`
            const response = await fetch(geocodeUrl, {
                headers: { 'X-Request-Id': (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).substring(7) }
            })
            const data = await response.json()

            if (data.geocodingResults?.[0]?.geometry?.location) {
                const { lat, lng } = data.geocodingResults[0].geometry.location
                const address = data.geocodingResults[0].formatted_address
                handleLocationChange(lat, lng, false) // already have address
                onChange?.({ lat, lng, address })
                setSearchQuery(address)
            }
        } catch (error) {
            console.error('Error selecting suggestion:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.")
            return
        }

        // Try to check permission status if supported
        if ('permissions' in navigator) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' as any })
                if (result.state === 'denied') {
                    alert("Location access is denied. Please enable it in your browser settings to use this feature.")
                    return
                }
            } catch (e) {
                // Permission API might not support 'geolocation' in all browsers, proceed anyway
            }
        }

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                handleLocationChange(latitude, longitude, true)
                setIsLoading(false)
            },
            (error) => {
                let message = "Unable to retrieve your location."
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location access denied. Please enable it to use this feature."
                        break
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable."
                        break
                    case error.TIMEOUT:
                        message = "Location request timed out."
                        break
                }
                alert(message)
                setIsLoading(false)
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
    }

    return (
        <div className={cn("relative flex flex-col gap-4", className)}>
            <div className="relative z-20 w-full group">
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={placeholder}
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm placeholder:text-muted-foreground/60 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                            className="absolute right-3 hover:bg-muted p-1 rounded-full transition-colors text-muted-foreground"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => selectSuggestion(s)}
                                className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted transition-colors border-b border-border last:border-none group"
                            >
                                <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <MapPin className="w-3 h-3" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground line-clamp-1">{s.structured_formatting?.main_text || s.description}</span>
                                    <span className="text-[11px] text-muted-foreground line-clamp-1">{s.structured_formatting?.secondary_text || ''}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative group/map rounded-2xl overflow-hidden border border-border shadow-inner bg-muted aspect-16/10 md:aspect-video">
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* Fixed Center Pin (Ola Style) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className={cn(
                        "relative flex flex-col items-center transition-all duration-300 ease-out",
                        isMapMoving ? "-translate-y-8" : "-translate-y-5"
                    )}>
                        <div className="text-zinc-900 drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500">
                            <MapPin className="w-12 h-12 fill-white" strokeWidth={1.5} />
                        </div>
                        {/* Shadow point */}
                        <div className={cn(
                            "w-2 h-1 bg-black/40 rounded-[100%] blur-[1px] transition-all duration-300",
                            isMapMoving ? "scale-[0.5] opacity-20" : "scale-100 opacity-100"
                        )} />
                    </div>
                </div>

                {/* Overlay Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={getCurrentLocation}
                        className="bg-background hover:bg-muted text-foreground p-3 rounded-xl shadow-lg border border-border transition-all hover:scale-105 active:scale-95 group/btn"
                        title="My Location"
                    >
                        <Navigation className="w-5 h-5 group-hover/btn:text-primary transition-colors" />
                    </button>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                        <div className="bg-background p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span className="text-sm font-medium">Updating map...</span>
                        </div>
                    </div>
                )}
            </div>

            {value && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-300 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-orange-500 rounded-lg p-1.5 text-white shadow-sm">
                        <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Selected Location</span>
                        <span className="text-sm font-medium truncate max-w-[280px]">
                            {value.address || `${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}`}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
