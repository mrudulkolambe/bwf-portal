"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppInput } from "@/components/app/input"
import Link from 'next/link'

const PartnerLogin = () => {
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login Data:', formData)
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-0 md:p-10">
            <div className="w-full max-w-[450px]">
                <Card className="md:border-border border-none shadow-none rounded-2xl p-0">
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1">
                            <div className="flex flex-col p-4 md:p-12 justify-center">
                                <div className="space-y-1 text-left mb-8">
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
                                    <p className="text-sm text-muted-foreground">Login to your Partner account</p>
                                </div>
                                <div className="grid gap-5">
                                    <AppInput
                                        id="phone"
                                        type="tel"
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        className="h-11 shadow-sm"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />

                                    <AppInput
                                        id="password"
                                        type="password"
                                        label="Password"
                                        placeholder="Enter your password"
                                        className="h-11 shadow-sm"
                                        labelExtra={
                                            <a href="#" className="text-xs text-muted-foreground hover:text-foreground font-medium underline underline-offset-4 transition-colors">
                                                Forgot your password?
                                            </a>
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                    <Link href={"/onboard"}>
                                        <Button className="w-full h-11">
                                            Login
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-8 text-center text-sm">
                                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                                    <a href="/signup" className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                                        Sign up
                                    </a>
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

export default PartnerLogin



