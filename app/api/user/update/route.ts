import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await request.json();
    const { email, name, image } = body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        email: email || undefined,
        name: name || undefined,
        image: image || undefined,
      },
      select: {
          id: true,
          phoneNumber: true,
          email: true,
          name: true,
          image: true,
          role: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update User API Error:", error);
    if (error.name === "JsonWebTokenError") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
