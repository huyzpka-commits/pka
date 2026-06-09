import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchCloudPhotos } from "@/lib/cloud-fetch";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session?.provider) {
    return NextResponse.json(
      { error: "Chưa đăng nhập. Vui lòng kết nối cloud trước." },
      { status: 401 }
    );
  }

  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

  const result = await fetchCloudPhotos(
    session.provider,
    session.accessToken,
    cursor
  );

  if (result.error) {
    return NextResponse.json(
      { error: result.error, photos: [], nextCursor: null },
      { status: 502 }
    );
  }

  return NextResponse.json({
    photos: result.photos,
    nextCursor: result.nextCursor,
  });
}
