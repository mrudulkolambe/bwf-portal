"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/language-provider"
import { User, Mail, Phone, MapPin, ShieldCheck, BadgeCheck, Camera, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

import { AppInput } from "@/components/app/input"
import { AppTextArea } from "@/components/app/textarea"

export default function ProfilePage() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
                {/* Header / Intro Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden transition-all duration-300 group-hover:border-primary/40">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-background border border-border shadow-lg hover:bg-secondary transition-all active:scale-95">
                                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold tracking-tight">Partner Name</h2>
                                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 cursor-default">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                Verified Professional Partner
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm rounded-3xl bg-secondary/30 backdrop-blur-md border border-border/40 overflow-hidden">
                            <CardHeader className="py-4 px-6 border-b border-border/40 bg-background/20">
                                <CardTitle className="text-[13px] font-bold flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    Personal Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <AppInput
                                        id="phone"
                                        type="tel"
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        className="h-11 shadow-sm"
                                        disabled
                                        value={"1234567890"}
                                    // onChange={handleChange}
                                    />
                                    <AppInput
                                        label="Email"
                                        value="mrudulkolambe02@gmail.com"
                                        disabled
                                        className="h-11 shadow-sm"
                                    />
                                </div>
                                <AppTextArea
                                    label="Business location"
                                    value="Shop 12, Crystal Plaza, Andheri West, Mumbai, Maharashtra 400053"
                                    disabled
                                    rows={3}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Button variant="default" className="h-11 w-full">
                    Edit Profile
                </Button>
            </div>
        </div>
    )
}
