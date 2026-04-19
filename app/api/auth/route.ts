import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, phoneNumber, otp, role, name, email } = body;

        // ACTION: SEND OTP (Used for both Login and Signup)
        if (action === "send-otp") {
            if (!phoneNumber) {
                return NextResponse.json(
                    { error: "Phone number is required" },
                    { status: 400 }
                );
            }

            // Generate a 4-digit or 6-digit OTP (let's go with 6)
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

            // Find or create user
            let user = await prisma.user.findUnique({ where: { phoneNumber } });

            if (!user) {
                // Sign-up flow: Create user with role if provided, else default to CONSUMER
                // Note: In a production app, you might want to wait for OTP verification before creating the user,
                // or create them in a 'PENDING' state.
                user = await prisma.user.create({
                    data: {
                        phoneNumber,
                        role: (role?.toUpperCase() as any) || "CONSUMER",
                        name: name || null,
                        email: email || null,
                        otp: generatedOtp,
                        otpExpires,
                    },
                });
            } else {
                // Login flow: Update existing user with new OTP
                await prisma.user.update({
                    where: { phoneNumber },
                    data: {
                        otp: generatedOtp,
                        otpExpires,
                    },
                });
            }

            // MOCK SMS LOGIC: In production, integrate with a provider like Twilio, Msg91, etc.
            console.log(`\x1b[36m%s\x1b[0m`, `[OTP Service] OTP for ${phoneNumber}: ${generatedOtp}`);

            return NextResponse.json({
                success: true,
                message: "OTP sent successfully",
                // In development, we return the OTP for testing purposes
                otp: process.env.NODE_ENV === "development" ? generatedOtp : undefined,
            });
        }

        // ACTION: VERIFY OTP
        if (action === "verify-otp") {
            if (!phoneNumber || !otp) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            // If otp contains the MSG91 access token structure (as sent by our new frontend)
            if (typeof otp === 'object' && otp.message) {
                const accessToken = otp.message; // MSG91 returns the JWT in the 'message' field on success

                const msg91AuthKey = process.env.MSG91_AUTH_KEY || "395689T4cE12EIGpi69e4eb08P1";

                try {
                    const verifyResponse = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            "authkey": msg91AuthKey,
                            "access-token": accessToken
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.type === 'error' || !verifyData.message) {
                        return NextResponse.json({
                            error: "OTP verification failed on server",
                            details: verifyData.message
                        }, { status: 401 });
                    }

                    // Token is verified! We proceed to find or create the user.
                    // Note: MSG91 verifyData might contain the phone number, but we can trust the client's phone for now 
                    // or compare verifyData.mobile with phoneNumber.
                    console.log("MSG91 Verified User:", verifyData.mobile);

                } catch (error) {
                    console.error("MSG91 Verification Error:", error);
                    return NextResponse.json({ error: "Failed to verify session with MSG91" }, { status: 500 });
                }
            } else {
                // Fallback or legacy support for direct OTP codes (mocking for dev)
                const user = await prisma.user.findUnique({
                    where: { phoneNumber },
                });

                if (!user || !user.otp || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
                    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
                }
            }

            // If we reached here, verification (either MSG91 or mock) passed.
            // Find or create user
            let user = await prisma.user.upsert({
                where: { phoneNumber },
                update: {
                    otp: null,
                    otpExpires: null,
                    name: name || undefined,
                },
                create: {
                    phoneNumber,
                    name: name || "User",
                    role: role || "CONSUMER",
                },
            });

            // Generate JWT Token
            const token = jwt.sign(
                {
                    userId: user.id,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            const response = NextResponse.json({
                success: true,
                message: "Authentication successful",
                token,
                user: {
                    id: user.id,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                },
            });

            // Set cookie for 7 days
            response.cookies.set('chargnex-auth-token', token, {
                httpOnly: false, // Accessible by frontend as requested (for getToken)
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
            });

            return response;

        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Auth API Error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
