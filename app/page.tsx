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
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        phone: '',
        otp: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.phone) {
            toast.error("Please enter your phone number")
            return
        }

        await AuthService.sendOtp(
            { phoneNumber: formData.phone },
            setLoading,
            (data) => {
                toast.success("OTP sent successfully")
                setStep('otp')
                if (data.otp) {
                    console.log("Dev OTP:", data.otp)
                }
            },
            (err) => toast.error(err)
        )
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.otp) {
            toast.error("Please enter the OTP")
            return
        }

        await AuthService.verifyOtp(
            {
                phoneNumber: formData.phone,
                otp: formData.otp
            },
            setLoading,
            () => {
                toast.success("Logged in successfully!")
                router.push("/partner/dashboard")
            },
            (err) => toast.error(err)
        )
    }



    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full max-w-[450px]">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0">
                    <CardContent className="p-0">
                        <div className="flex flex-col p-4 md:p-12 justify-center">
                            <div className="space-y-1 text-left mb-8">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {step === 'phone' ? "Welcome back" : "Verify OTP"}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {step === 'phone' ? "Login to your account" : `Enter the code sent to ${formData.phone}`}
                                </p>
                            </div>

                            {step === 'phone' ? (
                                <form onSubmit={handleSendOTP} className="grid gap-5">
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
                                        {loading ? "Sending..." : "Send OTP"}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="grid gap-5">
                                    <AppInput
                                        id="otp"
                                        label="One-Time Password"
                                        placeholder="123456"
                                        className="h-11 shadow-sm text-center tracking-widest text-lg font-bold"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Button type="submit" className="w-full h-11" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify & Login"}
                                    </Button>

                                    <button 
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                                    >
                                        Change phone number
                                    </button>
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




