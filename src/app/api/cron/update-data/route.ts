import { type NextRequest, NextResponse } from "next/server";
import { DataUpdateScheduler } from "@/lib/cron";

export async function POST(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const scheduler = new DataUpdateScheduler();
    const result = await scheduler.updateAllData();

    if (result.success) {
      return NextResponse.json(
        {
          message: result.message,
          results: result.results,
          totalDuration: result.totalDuration,
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          error: result.message,
          results: result.results,
          totalDuration: result.totalDuration,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("[API] Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
