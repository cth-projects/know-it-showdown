import { WorldBankService } from "../src/lib/apis/worldBank/service";

async function testWorldBankService() {
  console.log("Testing World Bank Service...\n");

  const service = new WorldBankService();

  try {
    console.log("Running full data fetch and store...");
    const result = await service.fetchAndStoreAllIndicators();

    console.log("\nResults:");
    console.log(`   Total Indicators: ${result.totalIndicators}`);
    console.log(`   Successful API calls: ${result.successfulIndicators}`);
    console.log(`   Failed API calls: ${result.failedIndicators}`);
    console.log(`   Total Data Points: ${result.totalDataPoints}`);
    console.log(`   Saved Questions: ${result.savedQuestions}`);

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("\nTest failed:", error);
    process.exit(1);
  }
}

async function main() {
  await testWorldBankService();
}

main().catch(console.error);
