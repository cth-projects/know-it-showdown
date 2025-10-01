import { WorldBankService } from "@/lib/apis/worldBank";

interface DataUpdateResult {
  source: string;
  success: boolean;
  message: string;
  stats?: Record<string, unknown>;
  duration?: number;
}

export class DataUpdateScheduler {
  private worldBankService: WorldBankService;

  constructor() {
    this.worldBankService = new WorldBankService();
  }

  async updateAllData(): Promise<{
    success: boolean;
    message: string;
    results: DataUpdateResult[];
    totalDuration: number;
  }> {
    const startTime = Date.now();
    const results: DataUpdateResult[] = [];

    console.log("[Scheduler] Starting weekly data update for all sources...");

    const updateTasks = [
      this.updateWorldBankData(),
      // Future API updates go here:
    ];

    for (const task of updateTasks) {
      results.push(await task);
    }

    const totalDuration = Date.now() - startTime;
    const successfulUpdates = results.filter((r) => r.success).length;
    const failedUpdates = results.filter((r) => !r.success).length;

    const success = failedUpdates === 0;
    const message = success
      ? `All ${successfulUpdates} data sources updated successfully`
      : `${successfulUpdates} successful, ${failedUpdates} failed updates`;

    console.log(
      `[Scheduler] Weekly data update completed: ${message} (${totalDuration}ms)`,
    );

    return {
      success,
      message,
      results,
      totalDuration,
    };
  }

  async updateWorldBankData(): Promise<DataUpdateResult> {
    const startTime = Date.now();

    try {
      console.log("[Scheduler] Starting WorldBank data update...");

      const result = await this.worldBankService.fetchAndStoreAllIndicators();
      const duration = Date.now() - startTime;

      console.log(
        `[Scheduler] WorldBank update completed: ${result.savedQuestions} questions saved (${duration}ms)`,
      );

      return {
        source: "WorldBank",
        success: true,
        message: `Successfully updated ${result.savedQuestions} questions from ${result.successfulIndicators} indicators`,
        stats: {
          totalIndicators: result.totalIndicators,
          savedQuestions: result.savedQuestions,
          emptyIndicators: result.emptyIndicators,
        },
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[Scheduler] WorldBank update failed:", error);

      return {
        source: "WorldBank",
        success: false,
        message: `WorldBank data update failed: ${message}`,
        duration,
      };
    }
  }
}
