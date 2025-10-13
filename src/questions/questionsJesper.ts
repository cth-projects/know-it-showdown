import { Game0To100CategoryType } from "@prisma/client";

const questions = [
  {
    question: "In what year in the 1900s was the United Nations founded?",
    answer: 45,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://www.un.org/en/about-us/history-of-the-un
  },
  {
    question: "How many Sustainable Development Goals are there?",
    answer: 17,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://www.un.org/sustainabledevelopment/development-goals/
  },
  {
    question:
      "By what year in the 2000s does the UN aim to achieve the Sustainable Development Goals?",
    answer: 30,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://www.un.org/sustainabledevelopment/development-goals/
  },
  {
    question: "How many official languages does the United Nations have?",
    answer: 6,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://www.un.org/en/our-work/official-languages
  },
  {
    question: "What percentage of Earth's land surface is covered by forests?",
    answer: 31,
    categoryName: Game0To100CategoryType.ENVIRONMENT,
    // Source: https://www.un.org/sustainabledevelopment/biodiversity/
  },
  {
    question: "What percentage of global plastic waste is recycled?",
    answer: 9,
    categoryName: Game0To100CategoryType.ENVIRONMENT,
    // Source: https://www.oecd.org/en/about/news/press-releases/2022/02/plastic-pollution-is-growing-relentlessly-as-waste-management-and-recycling-fall-short.html
  },
  {
    question: "How many percent of global CO2 emissions from transportation come from aviation?",
    answer: 12,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question: "How many percent of global CO2 emissions from transportation come from passenger vehicles(cars, motorcycles, and buses)?",
    answer: 45,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question: "How many percent of global CO2 emissions from transportation come from trains?",
    answer: 1,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question: "How many percent of the world's population has access to the internet?",
    answer: 68,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx
  },
  {
    question: "How many percent of global electricity is generated from solar power?",
    answer: 7,
    categoryName: Game0To100CategoryType.ENERGY,
    // Source: https://ourworldindata.org/grapher/share-electricity-solar
  },
  {
    question: "How many percent of global electricity is generated from coal?",
    answer: 34,
    categoryName: Game0To100CategoryType.ENERGY,
    // Source: https://ourworldindata.org/grapher/share-electricity-solar
  },
  {
    question: "How many percent of the world's population(15 years or older) are literate?",
    answer: 87,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://ourworldindata.org/literacy
  },
  {
    question: "How many percent of women globally(15 years or older) participate in the labor force?",
    answer: 47,
    categoryName: Game0To100CategoryType.EMPLOYMENT,
    // Source: https://data.worldbank.org/indicator/SL.TLF.CACT.FE.ZS
  },
  {
    question: "How many percent of the world's population lacks access to essential health services?",
    answer: 50,
    categoryName: Game0To100CategoryType.HEALTH,
    // Source: https://www.who.int/news/item/13-12-2017-world-bank-and-who-half-the-world-lacks-access-to-essential-health-services-100-million-still-pushed-into-extreme-poverty-because-of-health-expenses
  },
  {
    question: "How many percent of the global popoulation has access to clean drinking water?",
    answer: 74,
    categoryName: Game0To100CategoryType.WATER,
    // Source: https://data.unicef.org/topic/water-and-sanitation/drinking-water/
  },
  {
    question: "How many percent of all the worlds wealth is owned by the richest 1 percent?",
    answer: 48,
    categoryName: Game0To100CategoryType.INEQUALITY,
    // Source: https://inequality.org/facts/global-inequality/#global-wealth-inequality
  },
  {
    question: "Approximately how much of earths land surface is desert?",
    answer: 33,
    categoryName: Game0To100CategoryType.ENVIRONMENT,
    // Source: https://en.wikipedia.org/wiki/Desert
  },
  {
    question: "What percentage of global freshwater is used for agriculture?",
    answer: 70,
    categoryName: Game0To100CategoryType.WATER,
    // Source: https://ourworldindata.org/water-use-stress
  },
  {
    question: "How many percent of Swedens land surface consist of forest?",
    answer: 69,
    categoryName: Game0To100CategoryType.ENVIRONMENT,
    // Source: https://data.worldbank.org/indicator/AG.LND.FRST.ZS?locations=SE
  }
];

export default questions;
