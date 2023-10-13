import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  // Ensure URL is provided
  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  // Ensure URL is valid
  if (!url.startsWith("https://pbs.twimg.com/profile_images/")) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Forward the status code and status text from the Twitter CDN response
      return new NextResponse(response.statusText, { status: response.status });
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("Content-Type");

    return new NextResponse(imageData, { headers: { "Content-Type": contentType! } });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
