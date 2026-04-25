import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get('bwf-auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.userId;
        const body = await request.json();
        const { 
            businessName, 
            serviceType, 
            location, 
            image, 
            aadharImage, 
            panImage 
        } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                businessName,
                serviceType,
                location,
                image,
                aadharImage,
                panImage,
                isOnboarded: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Onboarding complete",
            user: updatedUser
        });

    } catch (error: any) {
        console.error("Onboarding API Error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
