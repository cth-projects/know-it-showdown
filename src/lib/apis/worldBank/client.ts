import { WORLD_BANK_CONFIG } from "./config";

export interface WorldBankMetadata {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid?: string;
  lastupdated?: string;
}

export interface WorldBankDataPoint {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export type WorldBankResponse = [WorldBankMetadata, WorldBankDataPoint[]];

export interface WorldBankResponseWithIndicator {
  indicatorCode: string;
  response: WorldBankResponse;
}

export class WorldBankClient {
  private baseUrl = WORLD_BANK_CONFIG.baseUrl;

  async fetchIndicator(
    indicatorCode: string,
    countries: string[] = WORLD_BANK_CONFIG.countries as unknown as string[],
  ): Promise<WorldBankResponse> {
    const countriesParam = countries.join(";");
    const searchParams = new URLSearchParams(WORLD_BANK_CONFIG.defaultParams);

    const url = `${this.baseUrl}/country/${countriesParam}/indicator/${indicatorCode}?${searchParams}`;

    return this.makeRequest(url);
  }

  async fetchMultipleIndicators(
    indicatorCodes: string[],
    countries?: string[],
  ): Promise<WorldBankResponseWithIndicator[]> {
    const requests = indicatorCodes.map(async (code) => ({
      indicatorCode: code,
      result: await this.fetchIndicator(code, countries).catch((error) => {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.warn(`[WorldBank] Failed to fetch ${code}:`, message);
        return null;
      }),
    }));

    const results = await Promise.allSettled(requests);

    return results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          indicatorCode: string;
          result: WorldBankResponse | null;
        }> => result.status === "fulfilled" && result.value.result !== null,
      )
      .map((result) => ({
        indicatorCode: result.value.indicatorCode,
        response: result.value.result!,
      }));
  }

  private async makeRequest(
    url: string,
    retries: number = WORLD_BANK_CONFIG.retries,
  ): Promise<WorldBankResponse> {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "SDG-Question-Generator/1.0",
        },
        signal: AbortSignal.timeout(WORLD_BANK_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as WorldBankResponse;

      return data;
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `[WorldBank] Request failed, retrying... (${retries} left)`,
        );
        await this.delay(WORLD_BANK_CONFIG.retryDelay);
        return this.makeRequest(url, retries - 1);
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`World Bank API request failed: ${message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
