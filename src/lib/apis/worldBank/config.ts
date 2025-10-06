export const WORLD_BANK_CONFIG = {
  baseUrl: "https://api.worldbank.org/v2",
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,

  defaultParams: {
    format: "json",
    per_page: "1000",
    mrv: "1", // Most recent value
  },

  // SDG Indicators (0-100 scale only)
  indicators: {
    health: {
      measlesImmunization: "SH.IMM.MEAS",
    },
    education: {
      literacyRateAdult: "SE.ADT.LITR.ZS",
    },
    water: {
      cleanWaterAccess: "SH.H2O.BASW.ZS",
    },
    energy: {
      electricityAccessRural: "EG.ELC.ACCS.RU.ZS",
      renewableEnergyShare: "EG.FEC.RNEW.ZS",
    },
    employment: {
      unemploymentTotal: "SL.UEM.TOTL.ZS",
      unemploymentYouth: "SL.UEM.1524.ZS",
      employmentIndustry: "SL.IND.EMPL.ZS",
      employmentServices: "SL.SRV.EMPL.ZS",
      employmentAgriculture: "SL.AGR.EMPL.ZS",
    },
    connectivity: {
      internetUsers: "IT.NET.USER.ZS",
    },
    urban: {
      urbanPopulation: "SP.URB.TOTL.IN.ZS",
    },
    environment: {
      forestCover: "AG.LND.FRST.ZS",
      agriculturalLand: "AG.LND.AGRI.ZS",
    },
  },

  countries: [
    "US",
    "CA",
    "MX",
    "BR",
    "CL",
    "CR",
    "GB",
    "DE",
    "ES",
    "SE",
    "CN",
    "JP",
    "IN",
    "TH",
    "AU",
    "NG",
    "ZA",
  ] as const,

  rateLimiting: {
    requestsPerMinute: 100,
    burstLimit: 10,
    backoffMultiplier: 2,
  },
} as const;

// Helper functions
export function getAllIndicators(): string[] {
  return Object.values(WORLD_BANK_CONFIG.indicators).flatMap((category) =>
    Object.values(category),
  );
}

export function getIndicatorsByCategory(
  category: keyof typeof WORLD_BANK_CONFIG.indicators,
): string[] {
  return Object.values(WORLD_BANK_CONFIG.indicators[category]);
}

export function generateQuestion(
  indicatorCode: string,
  countryName: string,
): string {
  const questionMap: Record<string, (country: string) => string> = {
    // Health
    "SH.IMM.MEAS": (country) =>
      `What percentage of children in ${country} are vaccinated against measles?`,
    "SH.IMM.POL3": (country) =>
      `What percentage of children in ${country} receive polio vaccination?`,

    // Education
    "SE.ADT.LITR.ZS": (country) =>
      `What is the adult literacy rate in ${country}?`,
    "SE.ADT.1524.LT.ZS": (country) =>
      `What is the youth literacy rate in ${country}?`,

    // Water
    "SH.H2O.BASW.ZS": (country) =>
      `What percentage of people in ${country} have access to clean drinking water?`,

    // Energy
    "EG.ELC.ACCS.ZS": (country) =>
      `What percentage of the population in ${country} has access to electricity?`,
    "EG.ELC.ACCS.RU.ZS": (country) =>
      `What percentage of rural areas in ${country} have access to electricity?`,
    "EG.ELC.ACCS.UR.ZS": (country) =>
      `What percentage of urban areas in ${country} have access to electricity?`,
    "EG.FEC.RNEW.ZS": (country) =>
      `What percentage of ${country}'s energy consumption comes from renewable sources?`,

    // Employment
    "SL.UEM.TOTL.ZS": (country) =>
      `What is the unemployment rate in ${country}?`,
    "SL.UEM.1524.ZS": (country) =>
      `What is the youth unemployment rate in ${country}?`,
    "SL.TLF.CACT.ZS": (country) =>
      `What is the labor force participation rate in ${country}?`,
    "SL.IND.EMPL.ZS": (country) =>
      `What percentage of people in ${country} work in industry?`,
    "SL.SRV.EMPL.ZS": (country) =>
      `What percentage of people in ${country} work in services?`,
    "SL.AGR.EMPL.ZS": (country) =>
      `What percentage of people in ${country} work in agriculture?`,

    // Technology
    "IT.NET.USER.ZS": (country) =>
      `What percentage of people in ${country} use the internet?`,

    // Urban
    "SP.URB.TOTL.IN.ZS": (country) =>
      `What percentage of ${country}'s population lives in urban areas?`,

    // Environment
    "AG.LND.FRST.ZS": (country) =>
      `What percentage of ${country}'s land area is covered by forests?`,
    "ER.LND.PTLD.ZS": (country) =>
      `What percentage of ${country}'s land area is protected terrestrial areas?`,
    "AG.LND.AGRI.ZS": (country) =>
      `What percentage of ${country}'s land area is agricultural land?`,
  };

  const questionFn = questionMap[indicatorCode];

  if (questionFn) {
    return questionFn(countryName);
  }

  return `What is the value for indicator ${indicatorCode} in ${countryName}?`;
}

export type IndicatorCategory = keyof typeof WORLD_BANK_CONFIG.indicators;
export type CountryCode = (typeof WORLD_BANK_CONFIG.countries)[number];
