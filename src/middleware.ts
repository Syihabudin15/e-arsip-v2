import { refreshToken } from "@/components/utils/Auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await refreshToken(request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/users",
    "/roles",
    "/jenis-pemohon",
    "/permohonan-kredit",
    "/document",
    "/logs",
    "/request/:path*",
    // "/api/permohnan-kredit/:path*",
    // "/api/request",
  ],
};
