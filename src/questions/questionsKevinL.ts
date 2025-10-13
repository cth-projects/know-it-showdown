import { Game0To100CategoryType } from "@prisma/client";

export const sampleQuestions = [
  {
    question:
      "How many years of life expectancy did humans gain globally between 1950 and 2020?",
    answer: 26,
    categoryName: Game0To100CategoryType.HEALTH,
    // source: https://ourworldindata.org/life-expectancy
  },
  {
    question:
      "How many centimeters has the global sea level risen between 1900 and 2020?",
    answer: 24,
    categoryName: Game0To100CategoryType.OCEANS,
    // source: https://www.climate.gov/news-features/understanding-climate/climate-change-global-sea-level
  },
  {
    question: "How many countries in the world are landlocked?",
    answer: 44,
    categoryName: Game0To100CategoryType.PARTNERSHIPS,
    // source: https://en.wikipedia.org/wiki/Landlocked_country
  },
  {
    question:
      "How many kilograms of food did the average household waste in 2021?",
    answer: 74,
    categoryName: Game0To100CategoryType.HUNGER,
    // source: https://www.unep.org/resources/report/unep-food-waste-index-report-2021
  },
  {
    question:
      "How many hours per week did the average woman globally spend on unpaid care work in 2018?",
    answer: 31,
    categoryName: Game0To100CategoryType.GENDER,
    // source: https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@dcomm/@publ/documents/publication/wcms_633135.pdf
  },
  {
    question:
      "How many thousands of liters of water does it take to produce one kilogram of beef? (2010)",
    answer: 15,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many thousands of liters of water does it take to produce one kilogram of chicken? (2010)",
    answer: 4,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many hundreds of liters of water does it take to produce one kilogram of fruit? (2010)",
    answer: 10,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many hundreds of liters of water does it take to produce one kilogram of eggs? (2010)",
    answer: 33,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many hundreds of liters of water does it take to produce one kilogram of butter? (2010)",
    answer: 56,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many hundreds of liters of water does it take to produce one kilogram of pork? (2010)",
    answer: 60,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many hundreds of liters of water does it take to produce one kilogram of vegetables? (2010)",
    answer: 3,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many more hundreds of liters of water does it take to produce one kilogram of pork compared to chicken? (2010)",
    answer: 17,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many more thousands of liters of water does it take to produce one kilogram of beef compared to vegetables? (2010)",
    answer: 15,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many millimeters of rain does the Atacama Desert in Chile receive per year?",
    answer: 15,
    categoryName: Game0To100CategoryType.CLIMATE,
    // source: https://www.worldatlas.com/articles/the-driest-place-on-earth.html
  },
  {
    question:
      "What percentage of countries (out of 184 measured) met the ILO standard of at least 14 weeks paid maternity leave in 2021?",
    answer: 64,
    categoryName: Game0To100CategoryType.GENDER,
    // source: https://blogs.worldbank.org/en/developmenttalk/four-revealing-graphs-paid-family-leave
  },
  {
    question:
      "How many megacities (over 10 million people) existed in the world in 2025?",
    answer: 54,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // source: https://en.wikipedia.org/wiki/Megacity
  },
  {
    question: "How many decibels is normal conversation?",
    answer: 60,
    categoryName: Game0To100CategoryType.HEALTH,
    // source: https://www.nidcd.nih.gov/news/2020/do-you-know-how-loud-too-loud
  },
  {
    question: "How many armed conflicts were active globally in 2023?",
    answer: 59,
    categoryName: Game0To100CategoryType.PEACE,
    // source: https://www.uu.se/en/press/press-releases/2024/2024-06-03-ucdp-record-number-of-armed-conflicts-in-the-world
  },
  {
    question:
      "How many minutes of vigorous exercise per week does WHO recommend as a minimum for adults?",
    answer: 75,
    categoryName: Game0To100CategoryType.HEALTH,
    // source: https://www.who.int/news-room/fact-sheets/detail/physical-activity
  },
  {
    question:
      "How many dollars per day defines extreme poverty according to the World Bank in 2025?",
    answer: 3,
    categoryName: Game0To100CategoryType.POVERTY,
    // source: https://www.worldbank.org/en/topic/poverty/overview
  },
];
