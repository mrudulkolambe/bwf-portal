"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import { Camera, Image as ImageIcon, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { PARTNER_SERVICES } from "@/lib/constants"
import { AppSelect } from "@/components/app/searchable-select"
import { OlaMapsPicker } from "@/components/app/ola-maps-picker"
import { Label } from "@/components/ui/label"
import { FileUp, CreditCard } from "lucide-react"

import { useRouter } from 'next/navigation'
import { useTranslation } from "@/components/providers/language-provider"
import { LanguageSwitcher } from "@/components/app/language-switcher"

import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import API from "@/lib/api"
import { toast } from "sonner"
import AuthService from "@/service/auth.service"

const OnboardPartner = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    
    // Form States
    const [businessName, setBusinessName] = useState('')
    const [selectedService, setSelectedService] = useState<string>('')
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | undefined>()

    // Preview States
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [aadharPreview, setAadharPreview] = useState<string | null>(null)
    const [panPreview, setPanPreview] = useState<string | null>(null)

    // File States (Actual files to upload)
    const [profileFile, setProfileFile] = useState<File | null>(null)
    const [aadharFile, setAadharFile] = useState<File | null>(null)
    const [panFile, setPanFile] = useState<File | null>(null)

    useEffect(() => {
        AuthService.whoAmI({
            setLoading: () => {},
            onSuccess: (data) => setUser(data.user),
            onError: (err) => {
                toast.error("Session expired. Please login again.")
                router.push('/')
            }
        })
    }, [router])

    const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfileFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleAadharUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAadharFile(file)
            setAadharPreview(URL.createObjectURL(file))
        }
    }

    const handlePanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPanFile(file)
            setPanPreview(URL.createObjectURL(file))
        }
    }

    const uploadFile = async (file: File, folder: string) => {
        if (!user?.id) throw new Error("User ID not found")
        // Folder structure: users/{userId}/{folder}/{timestamp}_{filename}
        const storageRef = ref(storage, `users/${user.id}/${folder}/${Date.now()}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        return await getDownloadURL(snapshot.ref)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return

        setLoading(true)
        try {
            let profileUrl = null
            let aadharUrl = null
            let panUrl = null

            // Upload files sequentially or in parallel
            const uploadPromises = []
            
            if (profileFile) uploadPromises.push(uploadFile(profileFile, 'profile').then(url => profileUrl = url))
            if (aadharFile) uploadPromises.push(uploadFile(aadharFile, 'documents/aadhar').then(url => aadharUrl = url))
            if (panFile) uploadPromises.push(uploadFile(panFile, 'documents/pan').then(url => panUrl = url))

            await Promise.all(uploadPromises)

            // Submit onboarding data to backend
            const response = await API.post('/api/user/onboard', {
                businessName,
                serviceType: selectedService,
                location,
                image: profileUrl,
                aadharImage: aadharUrl,
                panImage: panUrl
            })

            if (response.success) {
                toast.success("Onboarding completed successfully!")
                router.push('/partner/dashboard')
            } else {
                toast.error(response.message || "Failed to complete onboarding")
            }
        } catch (error: any) {
            console.error('Onboarding upload error:', error)
            toast.error(error.message || "An error occurred during upload")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0 transition-all duration-300">
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1">
                            <div className="flex flex-col p-4 md:p-12 justify-center text-left">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('auth.onboarding_title')}</h1>
                                        <p className="text-sm text-muted-foreground">{t('auth.onboarding_subtitle')}</p>
                                    </div>
                                    <LanguageSwitcher />
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
                                                onChange={handleProfileUpload}
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                aria-label="Upload profile picture"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-lg font-semibold text-foreground">{t('auth.add_logo')}</h2>
                                            <p className="text-xs text-muted-foreground">{t('auth.logo_hint')}</p>
                                        </div>
                                    </div>

                                    {/* Business Name Field */}
                                    <AppInput
                                        id="businessName"
                                        label={t('auth.business_name')}
                                        placeholder="Enter your business or brand name"
                                        className="h-11 shadow-sm"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        required
                                    />

                                    {/* Service Type Selection Dropdown */}
                                    <AppSelect
                                        variant='searchable'
                                        label={t('auth.service_type')}
                                        clearable={false}
                                        placeholder="Search and select service..."
                                        options={PARTNER_SERVICES.map(s => ({ ...s, subText: s.description }))}
                                        value={selectedService}
                                        onValueChange={setSelectedService}
                                    />

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-zinc-700">{t('auth.business_location')}</Label>
                                        <OlaMapsPicker
                                            value={location}
                                            onChange={setLocation}
                                            placeholder="Search your business address..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium text-zinc-700">{t('auth.identity_verification')}</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Aadhar Upload */}
                                            <div className="flex flex-col gap-2">
                                                <div className={cn(
                                                    "relative aspect-3/2 rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center transition-all hover:border-primary/50 group bg-muted/30",
                                                    aadharPreview && "border-solid border-primary/30"
                                                )}>
                                                    {aadharPreview ? (
                                                        <img src={aadharPreview} alt="Aadhar" className="w-full h-full object-cover animate-in fade-in duration-300" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-4">
                                                            <CreditCard className="w-6 h-6" />
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider">{t('auth.aadhar_front')}</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        onChange={handleAadharUpload}
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* PAN Upload */}
                                            <div className="flex flex-col gap-2">
                                                <div className={cn(
                                                    "relative aspect-3/2 rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center transition-all hover:border-primary/50 group bg-muted/30",
                                                    panPreview && "border-solid border-primary/30"
                                                )}>
                                                    {panPreview ? (
                                                        <img src={panPreview} alt="PAN" className="w-full h-full object-cover animate-in fade-in duration-300" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-4">
                                                            <CreditCard className="w-6 h-6" />
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider">{t('auth.pan_card')}</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        onChange={handlePanUpload}
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-11" disabled={!selectedService || !businessName || loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t('auth.completing')}...
                                            </>
                                        ) : (
                                            t('auth.complete_onboarding')
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="mt-8 text-center text-[12px] text-muted-foreground max-w-sm mx-auto">
                    {t('auth.terms_text')}{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">{t('auth.terms_link')}</a> and{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">{t('auth.privacy_link')}</a>.
                </div>
            </div>
        </div>
    )
}

export default OnboardPartner