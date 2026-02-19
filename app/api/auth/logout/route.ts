import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  getRefreshTokenFromCookie,
  clearRefreshTokenCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenFromCookie();

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);

      if (payload?.userId) {
        // Clear the refresh token from DB
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      }
    }

    await clearRefreshTokenCookie();

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    // Even if something fails, clear the cookie
    await clearRefreshTokenCookie();
    return NextResponse.json({ message: "Logged out successfully" });
  }
}
