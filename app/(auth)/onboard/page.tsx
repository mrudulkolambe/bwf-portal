"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import { Camera, Image as ImageIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { PARTNER_SERVICES } from "@/lib/constants"
import { AppSelect } from "@/components/app/searchable-select"
import { OlaMapsPicker } from "@/components/app/ola-maps-picker"
import { Label } from "@/components/ui/label"
import { FileUp, CreditCard } from "lucide-react"

const OnboardPartner = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageKey, setImageKey] = useState(0)
    const [selectedService, setSelectedService] = useState<string>('')
    const [businessName, setBusinessName] = useState('')
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | undefined>()

    // Document States
    const [aadharImage, setAadharImage] = useState<string | null>(null)
    const [panImage, setPanImage] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Revoke old URL if it exists to prevent memory leaks
            if (imagePreview) URL.revokeObjectURL(imagePreview);

            const url = URL.createObjectURL(file);
            setImagePreview(url);
            setImageKey(prev => prev + 1);
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Onboarding data:', {
            businessName,
            imagePreview,
            selectedService,
            location,
            aadharImage,
            panImage
        })
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0 transition-all duration-300">
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1">
                            <div className="flex flex-col p-4 md:p-12 justify-center text-left">
                                <div className="space-y-1 mb-8">
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome to the Network</h1>
                                    <p className="text-sm text-muted-foreground">Complete your profile to start offering services</p>
                                </div>

                                <div className="grid gap-8">
                                    {/* Profile Image Section */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div
                                            className={cn(
                                                "relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center transition-all hover:border-primary/50 group bg-muted/30",
                                                imagePreview && "border-solid border-primary/30"
                                            )}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    key={imageKey}
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover animate-in fade-in duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-2">
                                                    <Camera className="w-8 h-8" />
                                                    <span className="text-[10px] font-medium uppercase tracking-wider">Add Photo</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                                                <ImageIcon className="text-foreground w-6 h-6" />
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                aria-label="Upload profile picture"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-lg font-semibold text-foreground">Add Business Logo</h2>
                                            <p className="text-xs text-muted-foreground">Recommended: Square image, max 2MB</p>
                                        </div>
                                    </div>

                                    {/* Business Name Field */}
                                    <AppInput
                                        id="businessName"
                                        label="Business Name"
                                        placeholder="Enter your business or brand name"
                                        className="h-11 shadow-sm"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        required
                                    />

                                    {/* Service Type Selection Dropdown */}
                                    <AppSelect
                                        variant='searchable'
                                        label="Type of Service"
                                        clearable={false}
                                        placeholder="Search and select service..."
                                        options={PARTNER_SERVICES.map(s => ({ ...s, subText: s.description }))}
                                        value={selectedService}
                                        onValueChange={setSelectedService}
                                    />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-zinc-700">Business Location</Label>
                                        <OlaMapsPicker
                                            value={location}
                                            onChange={setLocation}
                                            placeholder="Search your business address..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium text-zinc-700">Identity Verification</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Aadhar Upload */}
                                            <div className="flex flex-col gap-2">
                                                <div className={cn(
                                                    "relative aspect-3/2 rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center transition-all hover:border-primary/50 group bg-muted/30",
                                                    aadharImage && "border-solid border-primary/30"
                                                )}>
                                                    {aadharImage ? (
                                                        <img src={aadharImage} alt="Aadhar" className="w-full h-full object-cover animate-in fade-in duration-300" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-4">
                                                            <CreditCard className="w-6 h-6" />
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider">Aadhaar Front</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) setAadharImage(URL.createObjectURL(file));
                                                        }}
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* PAN Upload */}
                                            <div className="flex flex-col gap-2">
                                                <div className={cn(
                                                    "relative aspect-3/2 rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center transition-all hover:border-primary/50 group bg-muted/30",
                                                    panImage && "border-solid border-primary/30"
                                                )}>
                                                    {panImage ? (
                                                        <img src={panImage} alt="PAN" className="w-full h-full object-cover animate-in fade-in duration-300" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-4">
                                                            <CreditCard className="w-6 h-6" />
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider">PAN Card</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) setPanImage(URL.createObjectURL(file));
                                                        }}
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={!selectedService || !businessName}>
                                        Complete Onboarding
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="mt-8 text-center text-[12px] text-muted-foreground max-w-sm mx-auto">
                    By clicking continue, you agree to our{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a> and{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
                </div>
            </div>
        </div>
    )
}

export default OnboardPartner