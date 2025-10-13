import { type NextRequest, NextResponse } from "next/server";
import { insertQuestions } from "@/questions/insertQuestions";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    console.log("[API] Starting database seed...");
    const result = await insertQuestions();
    const duration = Date.now() - startTime;

    console.log(
      `[API] Database seeded with ${result.questionsSeeded} questions`,
    );
    console.log("[API] Questions per category:", result.categoryCounts);

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        results: result,
        totalDuration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API] Seed job failed:", error);
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
        totalDuration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
