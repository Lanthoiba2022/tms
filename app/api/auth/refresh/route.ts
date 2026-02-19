import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      return NextResponse.json(
        { error: "User not found or session expired" },
        { status: 401 }
      );
    }

    // Verify the refresh token matches the one stored in DB
    const isTokenValid = await compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Rotate: issue new access + refresh tokens
    const newAccessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const newRefreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const hashedRefreshToken = await hash(newRefreshToken, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    await setRefreshTokenCookie(newRefreshToken);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
