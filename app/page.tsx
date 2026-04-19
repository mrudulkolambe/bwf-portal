"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import AuthService from "@/service/auth.service"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMsg91 } from "@/hooks/use-msg91"

const PartnerLogin = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')

    // Initialize MSG91
    const { sendOtp } = useMsg91(
        // Success Callback
        async (msg91Data) => {
            setLoading(true);
            // After MSG91 verifies the OTP, we send the data to our backend to issue a local JWT
            await AuthService.verifyOtp(
                {
                    phoneNumber: phone,
                    otp: msg91Data // Passing the MSG91 response data as the "otp" identifier
                },
                setLoading,
                () => {
                    toast.success("Logged in successfully!")
                    router.push("/partner/dashboard")
                },
                (err) => toast.error(err)
            )
        },
        // Failure Callback
        (err) => {
            toast.error("OTP verification failed")
            setLoading(false);
        }
    )

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault()
        if (!phone) {
            toast.error("Please enter your phone number")
            return
        }
        sendOtp(phone)
        toast.info("Opening OTP widget...")
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full max-w-[450px]">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0">
                    <CardContent className="p-0">
                        <div className="flex flex-col p-4 md:p-12 justify-center">
                            <div className="space-y-1 text-left mb-8">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Welcome back
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Login to your account via OTP
                                </p>
                            </div>

                            <form onSubmit={handleSendOTP} className="grid gap-5">
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
                                    {loading ? "Verifying..." : "Login with OTP"}
                                </Button>
                            </form>

                            <div className="mt-8 text-center text-sm">
                                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                                <a href="/signup" className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div id="msg91-captcha" className="mt-4 flex justify-center"></div>
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




