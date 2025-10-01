import {
  WorldBankClient,
  type WorldBankResponse,
  type WorldBankDataPoint,
} from "./client";
import {
  WORLD_BANK_CONFIG,
  getAllIndicators,
  generateQuestion,
} from "./config";
import { PrismaClient, Game0To100CategoryType } from "@prisma/client";

const prisma = new PrismaClient();
export interface ProcessedIndicator {
  indicatorId: string;
  indicatorName: string;
  countryId: string;
  countryName: string;
  countryIso3Code: string;
  year: number;
  value: number;
  unit: string;
  category: Game0To100CategoryType;
  question: string;
  fetchedAt: Date;
}

export class WorldBankService {
  private client: WorldBankClient;

  constructor() {
    this.client = new WorldBankClient();
  }

  async fetchAndStoreAllIndicators(): Promise<{
    totalIndicators: number;
    totalDataPoints: number;
    successfulIndicators: number;
    failedIndicators: number;
    savedQuestions: number;
    emptyIndicators: string[];
  }> {
    console.log("[WorldBankService] Starting full data fetch");

    const allIndicators = getAllIndicators();
    const responses = await this.client.fetchMultipleIndicators(allIndicators);

    console.log(
      `[WorldBankService] Received ${responses.length}/${allIndicators.length} successful responses`,
    );

    const emptyIndicators: string[] = [];
    const allProcessedData: ProcessedIndicator[] = [];

    for (const { indicatorCode, response } of responses) {
      const processed = this.processResponseWithIndicator(
        response,
        indicatorCode,
      );

      if (processed.length === 0) {
        emptyIndicators.push(indicatorCode);
        console.warn(
          `[WorldBankService] No data returned for indicator: ${indicatorCode}`,
        );
      }

      allProcessedData.push(...processed);
    }

    const validData = allProcessedData.filter((item) =>
      this.isValidPercentageValue(item.value),
    );

    console.log(
      `[WorldBankService] Filtered ${validData.length}/${allProcessedData.length} valid data points`,
    );

    if (emptyIndicators.length > 0) {
      console.log(
        `[WorldBankService] Indicators with no data: ${emptyIndicators.join(", ")}`,
      );
    }

    const savedQuestions = await this.saveToDatabase(validData);

    return {
      totalIndicators: allIndicators.length,
      totalDataPoints: allProcessedData.length,
      successfulIndicators: responses.length,
      failedIndicators: allIndicators.length - responses.length,
      savedQuestions,
      emptyIndicators,
    };
  }

  private processResponseWithIndicator(
    response: WorldBankResponse,
    indicatorCode: string,
  ): ProcessedIndicator[] {
    const [metadata, dataArray] = response;

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      console.warn(
        `[WorldBankService] No data available for indicator ${indicatorCode}`,
        {
          total: metadata?.total || 0,
          pages: metadata?.pages || 0,
          lastUpdated: metadata?.lastupdated,
        },
      );
      return [];
    }

    return dataArray
      .filter((item) => this.isValidDataPoint(item))
      .map((item) => this.transformDataPoint(item))
      .filter((item): item is ProcessedIndicator => item !== null);
  }

  private isValidDataPoint(item: WorldBankDataPoint): boolean {
    return !!(
      item &&
      item.value !== null &&
      item.value !== undefined &&
      !isNaN(item.value) &&
      item.indicator?.id &&
      item.country?.id &&
      item.date
    );
  }

  private transformDataPoint(
    item: WorldBankDataPoint,
  ): ProcessedIndicator | null {
    try {
      const category = this.getIndicatorCategory(item.indicator.id);
      if (!category) {
        console.warn(
          `[WorldBankService] Unknown indicator: ${item.indicator.id}`,
        );
        return null;
      }

      const question = generateQuestion(item.indicator.id, item.country.value);

      return {
        indicatorId: item.indicator.id,
        indicatorName: item.indicator.value,
        countryId: item.country.id,
        countryName: item.country.value,
        countryIso3Code: item.countryiso3code,
        year: parseInt(item.date) || new Date().getFullYear(),
        value: Number(item.value),
        unit: item.unit || "",
        category,
        question,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error("[WorldBankService] Error transforming data point:", error);
      return null;
    }
  }

  private getIndicatorCategory(
    indicatorId: string,
  ): Game0To100CategoryType | null {
    for (const [categoryKey, indicators] of Object.entries(
      WORLD_BANK_CONFIG.indicators,
    )) {
      if ((Object.values(indicators) as string[]).includes(indicatorId)) {
        return this.mapCategoryToEnum(categoryKey);
      }
    }
    return null;
  }

  private mapCategoryToEnum(categoryKey: string): Game0To100CategoryType {
    const mapping: Record<string, Game0To100CategoryType> = {
      health: Game0To100CategoryType.HEALTH,
      education: Game0To100CategoryType.EDUCATION,
      water: Game0To100CategoryType.WATER,
      energy: Game0To100CategoryType.ENERGY,
      employment: Game0To100CategoryType.EMPLOYMENT,
      connectivity: Game0To100CategoryType.TECHNOLOGY,
      urban: Game0To100CategoryType.URBAN_DEVELOPMENT,
      environment: Game0To100CategoryType.ENVIRONMENT,
    };

    return mapping[categoryKey] ?? Game0To100CategoryType.EDUCATION;
  }

  private isValidPercentageValue(value: number): boolean {
    return value >= 0 && value <= 100 && !isNaN(value);
  }

  private async saveToDatabase(data: ProcessedIndicator[]): Promise<number> {
    if (data.length === 0) {
      console.log("[WorldBankService] No data to save");
      return 0;
    }

    try {
      await this.ensureCategoriesExist();

      const questionsToUpsert = data.map((item) => ({
        question: item.question,
        answer: Math.round(item.value),
        categoryName: item.category,
      }));

      const uniqueQuestions = questionsToUpsert.filter(
        (question, index, array) =>
          array.findIndex((q) => q.question === question.question) === index,
      );

      console.log(
        `[WorldBankService] Upserting ${uniqueQuestions.length} unique questions`,
      );

      let upsertedCount = 0;

      for (const questionData of uniqueQuestions) {
        await prisma.game0To100Question.upsert({
          where: {
            question: questionData.question,
          },
          update: {
            answer: questionData.answer,
            categoryName: questionData.categoryName,
          },
          create: {
            question: questionData.question,
            answer: questionData.answer,
            categoryName: questionData.categoryName,
          },
        });

        upsertedCount++;
      }

      console.log(
        `[WorldBankService] Successfully upserted ${upsertedCount} questions to database`,
      );

      return upsertedCount;
    } catch (error) {
      console.error("[WorldBankService] Error saving to database:", error);
      throw new Error(
        `Failed to save data to database: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async ensureCategoriesExist(): Promise<void> {
    const categories = [
      {
        name: Game0To100CategoryType.HEALTH,
        title: "Good Health and Well-Being",
        sdgNumber: 3,
        description:
          "Ensure healthy lives and promote well-being for all at all ages. This includes reducing maternal mortality, ending preventable deaths of children, combating diseases, and ensuring access to healthcare services.",
        color: "#4C9F38",
      },
      {
        name: Game0To100CategoryType.EDUCATION,
        title: "Quality Education",
        sdgNumber: 4,
        description:
          "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. This includes achieving literacy, numeracy, and ensuring equal access to education.",
        color: "#C5192D",
      },
      {
        name: Game0To100CategoryType.WATER,
        title: "Clean Water and Sanitation",
        sdgNumber: 6,
        description:
          "Ensure availability and sustainable management of water and sanitation for all. This includes achieving access to safe drinking water, adequate sanitation, and improved water quality.",
        color: "#26BDE2",
      },
      {
        name: Game0To100CategoryType.ENERGY,
        title: "Affordable and Clean Energy",
        sdgNumber: 7,
        description:
          "Ensure access to affordable, reliable, sustainable and modern energy for all. This includes increasing the share of renewable energy and improving energy efficiency.",
        color: "#FCC30B",
      },
      {
        name: Game0To100CategoryType.EMPLOYMENT,
        title: "Decent Work and Economic Growth",
        sdgNumber: 8,
        description:
          "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all. This includes reducing unemployment and promoting safe working environments.",
        color: "#A21942",
      },
      {
        name: Game0To100CategoryType.TECHNOLOGY,
        title: "Industry, Innovation and Infrastructure",
        sdgNumber: 9,
        description:
          "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation. This includes increasing access to information and communication technology.",
        color: "#FD6925",
      },
      {
        name: Game0To100CategoryType.URBAN_DEVELOPMENT,
        title: "Sustainable Cities and Communities",
        sdgNumber: 11,
        description:
          "Make cities and human settlements inclusive, safe, resilient and sustainable. This includes ensuring access to adequate housing, sustainable transport systems, and inclusive urbanization.",
        color: "#FD9D24",
      },
      {
        name: Game0To100CategoryType.ENVIRONMENT,
        title: "Life on Land",
        sdgNumber: 15,
        description:
          "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss.",
        color: "#56C02B",
      },
    ];

    for (const categoryData of categories) {
      await prisma.game0To100Category.upsert({
        where: { name: categoryData.name },
        update: {
          title: categoryData.title,
          sdgNumber: categoryData.sdgNumber,
          description: categoryData.description,
          color: categoryData.color,
        },
        create: categoryData,
      });
    }
  }
}
