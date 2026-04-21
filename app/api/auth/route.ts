import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, phoneNumber, otp, role, name, email } = body;

        // ACTION: SEND OTP
        if (action === "send-otp") {
            if (!phoneNumber) {
                return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
            }

            // Generate a 6-digit random OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

            // Find or update/create user
            await prisma.user.upsert({
                where: { phoneNumber },
                update: {
                    otp: generatedOtp,
                    otpExpires,
                },
                create: {
                    phoneNumber,
                    otp: generatedOtp,
                    otpExpires,
                    role: (role?.toUpperCase() as any) || "PARTNER",
                    name: name || null,
                    email: email || null,
                },
            });

            // LOG OTP to console for development/mock purposes
            console.log(`\x1b[36m%s\x1b[0m`, `[MOCK OTP SERVICE] OTP for ${phoneNumber}: ${generatedOtp}`);

            return NextResponse.json({
                success: true,
                message: "OTP sent successfully",
                otp: process.env.NODE_ENV === "development" ? generatedOtp : undefined,
            });
        }

        // ACTION: VERIFY OTP
        if (action === "verify-otp") {
            if (!phoneNumber || !otp) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { phoneNumber },
            });

            if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
                return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
            }

            // Verification successful, clear OTP and ensure user is valid
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    otp: null,
                    otpExpires: null,
                },
            });

            // Generate application JWT
            const token = jwt.sign(
                {
                    userId: updatedUser.id,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            const response = NextResponse.json({
                success: true,
                message: "Authentication successful",
                token,
                user: {
                    id: updatedUser.id,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isOnboarded: updatedUser.isOnboarded,
                },
            });

            // Set secure auth cookie
            response.cookies.set('bwf-auth-token', token, {
                httpOnly: false,
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
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
