"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import AuthService from "@/service/auth.service"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const PartnerLogin = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault()
        if (!phone) {
            toast.error("Please enter your phone number")
            return
        }

        AuthService.sendOtp(
            { phoneNumber: phone },
            setLoading,
            (data) => {
                toast.success("OTP sent successfully!")
                setStep('otp')
            },
            (err) => toast.error(err)
        )
    }

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp) {
            toast.error("Please enter the OTP")
            return
        }

        AuthService.verifyOtp(
            { phoneNumber: phone, otp },
            setLoading,
            (data) => {
                toast.success("Logged in successfully!")
                // Redirect based on onboarding status if needed, 
                // but proxy.ts will handle it anyway
                router.push("/partner/dashboard")
            },
            (err) => toast.error(err)
        )
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full max-w-[450px]">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0 transition-all duration-300">
                    <CardContent className="p-0">
                        <div className="flex flex-col p-4 md:p-12 justify-center">
                            <div className="space-y-1 text-left mb-8">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {step === 'phone' ? "Welcome back" : "Confirm OTP"}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {step === 'phone' 
                                        ? "Login to your account via OTP" 
                                        : `Enter the 6-digit code sent to ${phone}`}
                                </p>
                            </div>

                            {step === 'phone' ? (
                                <form onSubmit={handleSendOTP} className="grid gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <AppInput
                                        id="phone"
                                        type="tel"
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        className="h-11 shadow-sm"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />

                                    <Button type="submit" className="w-full h-11" disabled={loading}>
                                        {loading ? "Sending..." : "Login with OTP"}
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
                                        {loading ? "Verifying..." : "Verify & Login"}
                                    </Button>

                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        className="w-full text-xs" 
                                        onClick={() => setStep('phone')}
                                        disabled={loading}
                                    >
                                        Edit phone number
                                    </Button>
                                </form>
                            )}

                            <div className="mt-8 text-center text-sm">
                                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                                <a href="/signup" className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                                    Sign up
                                </a>
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

export default PartnerLogin
