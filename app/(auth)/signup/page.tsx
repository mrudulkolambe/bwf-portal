"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import AuthService from "@/service/auth.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const PartnerSignup = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [otp, setOtp] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.phone || !formData.firstName) {
            toast.error("Please fill in all details")
            return
        }

        AuthService.sendOtp(
            { 
                phoneNumber: formData.phone,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                role: "PARTNER"
            },
            setLoading,
            () => {
                toast.success("OTP sent successfully!")
                setStep('otp')
            },
            (err) => toast.error(err)
        )
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp) {
            toast.error("Please enter the OTP")
            return
        }

        AuthService.verifyOtp(
            { 
                phoneNumber: formData.phone, 
                otp,
                name: `${formData.firstName} ${formData.lastName}`.trim()
            },
            setLoading,
            () => {
                toast.success("Signup successful!")
                router.push("/partner/dashboard")
            },
            (err) => toast.error(err)
        )
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full max-w-[850px]">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0 transition-all duration-300">
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col p-4 md:p-12 justify-center">
                                <div className="space-y-1 text-left mb-8">
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                        {step === 'details' ? "Create an account" : "Verify Code"}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {step === 'details' 
                                            ? "Join the BWF Partner network via OTP verification" 
                                            : `Enter the code sent to ${formData.phone}`}
                                    </p>
                                </div>

                                {step === 'details' ? (
                                    <form onSubmit={handleSendOTP} className="grid gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AppInput
                                                id="firstName"
                                                label="First name"
                                                placeholder="John"
                                                className="h-11 shadow-sm"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <AppInput
                                                id="lastName"
                                                label="Last name"
                                                placeholder="Doe"
                                                className="h-11 shadow-sm"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <AppInput
                                            id="phone"
                                            type="tel"
                                            label="Phone Number"
                                            placeholder="+1234567890"
                                            className="h-11 shadow-sm"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Button type="submit" className="w-full h-11" disabled={loading}>
                                            {loading ? "Sending..." : "Register with OTP"}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOTP} className="grid gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <AppInput
                                            id="otp"
                                            type="text"
                                            label="OTP Code"
                                            placeholder="123456"
                                            className="h-11 shadow-sm"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            required
                                        />

                                        <Button type="submit" className="w-full h-11" disabled={loading}>
                                            {loading ? "Verifying..." : "Complete Registration"}
                                        </Button>

                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            className="w-full text-xs" 
                                            onClick={() => setStep('details')}
                                            disabled={loading}
                                        >
                                            Go back and edit
                                        </Button>
                                    </form>
                                )}

                                <div className="mt-8 text-center text-sm">
                                    <span className="text-muted-foreground">Already have an account? </span>
                                    <a href="/" className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>
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

export default PartnerSignup