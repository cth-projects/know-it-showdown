import { Game0To100CategoryType } from "@prisma/client";

type QuestionMapping = {
  template: "percentage" | "rate" | "access" | "coverage" | "share";
  category: Game0To100CategoryType;
  description?: string;
  service?: string;
  type?: string;
  source?: string;
};

// Helper to create question mappings with defaults
const createQuestionMapping = (mapping: QuestionMapping): QuestionMapping => ({
  description: "DEFAULT",
  service: "DEFAULT",
  type: "DEFAULT",
  source: "DEFAULT",
  ...mapping,
});

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
      polioImmunization: "SH.IMM.POL3",
    },
    education: {
      literacyRateAdult: "SE.ADT.LITR.ZS",
      literacyRateYouth: "SE.ADT.1524.LT.ZS",
    },
    water: {
      cleanWaterAccess: "SH.H2O.BASW.ZS",
    },
    energy: {
      electricityAccess: "EG.ELC.ACCS.ZS",
      electricityAccessRural: "EG.ELC.ACCS.RU.ZS",
      electricityAccessUrban: "EG.ELC.ACCS.UR.ZS",
      renewableEnergyShare: "EG.FEC.RNEW.ZS",
    },
    employment: {
      unemploymentTotal: "SL.UEM.TOTL.ZS",
      unemploymentYouth: "SL.UEM.1524.ZS",
      laborForceParticipation: "SL.TLF.CACT.ZS",
      employmentIndustry: "SL.EMP.WORK.IN.ZS",
      employmentServices: "SL.EMP.WORK.SV.ZS",
      employmentAgriculture: "SL.EMP.WORK.AG.ZS",
    },
    connectivity: {
      internetUsers: "IT.NET.USER.ZS",
    },
    urban: {
      urbanPopulation: "SP.URB.TOTL.IN.ZS",
    },
    environment: {
      forestCover: "AG.LND.FRST.ZS",
      protectedTerrestrialAreas: "ER.LND.PTLD.ZS",
      agriculturalLand: "AG.LND.AGRI.ZS",
    },
  },

  countries: [
    "US",
    "CN",
    "JP",
    "DE",
    "GB",
    "FR",
    "IT",
    "CA",
    "BR",
    "IN",
    "SE",
    "NO",
    "DK",
    "FI",
    "IS",
    "NG",
    "ZA",
    "ID",
    "TH",
    "ES",
    "PL",
    "MX",
    "CR",
    "AR",
    "CL",
    "AU",
    "NZ",
  ] as const,

  // Rate limiting
  rateLimiting: {
    requestsPerMinute: 100,
    burstLimit: 10,
    backoffMultiplier: 2,
  },
} as const;

// Question templates
export const QUESTION_TEMPLATES = {
  percentage: "What percentage of {country}'s population {description}?",
  rate: "What is the {description} rate in {country}?",
  access: "What percentage of people in {country} have access to {service}?",
  coverage: "What percentage of {country}'s land area is {type}?",
  share: "What percentage of {country}'s {category} comes from {source}?",
} as const;

// Question mappings for indicators
export const QUESTION_MAPPINGS = {
  // Health
  "SH.IMM.MEAS": createQuestionMapping({
    template: "percentage",
    description: "are vaccinated against measles",
    category: Game0To100CategoryType.HEALTH,
  }),
  "SH.IMM.POL3": createQuestionMapping({
    template: "percentage",
    description: "receive polio vaccination",
    category: Game0To100CategoryType.HEALTH,
  }),

  // Education
  "SE.ADT.LITR.ZS": createQuestionMapping({
    template: "rate",
    description: "adult literacy",
    category: Game0To100CategoryType.EDUCATION,
  }),
  "SE.ADT.1524.LT.ZS": createQuestionMapping({
    template: "rate",
    description: "youth literacy (ages 15-24)",
    category: Game0To100CategoryType.EDUCATION,
  }),

  // Water
  "SH.H2O.BASW.ZS": createQuestionMapping({
    template: "access",
    service: "clean drinking water",
    category: Game0To100CategoryType.WATER,
  }),

  // Energy
  "EG.ELC.ACCS.ZS": createQuestionMapping({
    template: "access",
    service: "electricity",
    category: Game0To100CategoryType.ENERGY,
  }),
  "EG.ELC.ACCS.RU.ZS": createQuestionMapping({
    template: "access",
    service: "electricity (rural areas)",
    category: Game0To100CategoryType.ENERGY,
  }),
  "EG.ELC.ACCS.UR.ZS": createQuestionMapping({
    template: "access",
    service: "electricity (urban areas)",
    category: Game0To100CategoryType.ENERGY,
  }),
  "EG.FEC.RNEW.ZS": createQuestionMapping({
    template: "share",
    category: Game0To100CategoryType.ENERGY,
    source: "renewable sources",
  }),

  // Employment
  "SL.UEM.TOTL.ZS": createQuestionMapping({
    template: "rate",
    description: "unemployment",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),
  "SL.UEM.1524.ZS": createQuestionMapping({
    template: "rate",
    description: "youth unemployment (ages 15-24)",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),
  "SL.TLF.CACT.ZS": createQuestionMapping({
    template: "rate",
    description: "labor force participation",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),
  "SL.EMP.WORK.IN.ZS": createQuestionMapping({
    template: "percentage",
    description: "work in industry",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),
  "SL.EMP.WORK.SV.ZS": createQuestionMapping({
    template: "percentage",
    description: "work in services",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),
  "SL.EMP.WORK.AG.ZS": createQuestionMapping({
    template: "percentage",
    description: "work in agriculture",
    category: Game0To100CategoryType.EMPLOYMENT,
  }),

  // Connectivity
  "IT.NET.USER.ZS": createQuestionMapping({
    template: "percentage",
    description: "use the internet",
    category: Game0To100CategoryType.TECHNOLOGY,
  }),

  // Urban
  "SP.URB.TOTL.IN.ZS": createQuestionMapping({
    template: "percentage",
    description: "live in urban areas",
    category: Game0To100CategoryType.URBAN_DEVELOPMENT,
  }),

  // Environment
  "AG.LND.FRST.ZS": createQuestionMapping({
    template: "coverage",
    type: "covered by forests",
    category: Game0To100CategoryType.ENVIRONMENT,
  }),
  "ER.LND.PTLD.ZS": createQuestionMapping({
    template: "coverage",
    type: "protected terrestrial areas",
    category: Game0To100CategoryType.ENVIRONMENT,
  }),
  "AG.LND.AGRI.ZS": createQuestionMapping({
    template: "coverage",
    type: "agricultural land",
    category: Game0To100CategoryType.ENVIRONMENT,
  }),
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
  const mapping =
    QUESTION_MAPPINGS[indicatorCode as keyof typeof QUESTION_MAPPINGS];

  if (!mapping) {
    return `What is the value of indicator ${indicatorCode} in ${countryName}?`;
  }

  const template = QUESTION_TEMPLATES[mapping.template];

  return template
    .replace("{country}", countryName)
    .replace("{description}", mapping.description ?? "")
    .replace("{service}", mapping.service ?? "")
    .replace("{type}", mapping.type ?? "")
    .replace("{category}", mapping.category ?? Game0To100CategoryType.DEFAULT)
    .replace("{source}", mapping.source ?? "");
}

export type IndicatorCategory = keyof typeof WORLD_BANK_CONFIG.indicators;
export type QuestionTemplate = keyof typeof QUESTION_TEMPLATES;
export type CountryCode = (typeof WORLD_BANK_CONFIG.countries)[number];
