import { Game0To100CategoryType } from "@prisma/client";

const questions = [
  {
    question:
      "What percentage of tobacco users live in low- or middle-income countries?",
    answer: 80,
    categoryName: Game0To100CategoryType.HEALTH,
    // Source: World Health Organization (WHO) https://www.who.int/news-room/fact-sheets/detail/tobacco
  },
  {
    question: "What percentage of the oxygen you breathe comes from the ocean?",
    answer: 50,
    categoryName: Game0To100CategoryType.OCEANS,
    // Source: National Ocean and Atmospheric Administration (NOAA) https://oceanservice.noaa.gov/facts/ocean-oxygen.html
  },
  {
    question:
      "What percentage of heat-related deaths is caused by human-induced climate change?",
    answer: 37,
    categoryName: Game0To100CategoryType.CLIMATE,
    // SOURCE World Health Organization (WHO) https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health
  },
  {
    question:
      "What percentage of the global population is exposed to unsafe air pollution levels?",
    answer: 99,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // SOURCE https://www.who.int/data/gho/data/themes/air-pollution
  },
  {
    question: "What percentage of the global population uses the internet?",
    answer: 67,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // SOURCE https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx
  },
  {
    question:
      "What percentage of the world's population was living in extreme poverty in 2024-2025?",
    answer: 9,
    categoryName: Game0To100CategoryType.INEQUALITY,
    // SOURCE United Nations Sustainable Development https://www.un.org/sustainabledevelopment/development-goals/
  },
  {
    question:
      "What percentage of the sustainable development goals (SDG) targets are progressing too slowly (not on track)?",
    answer: 47,
    categoryName: Game0To100CategoryType.EDUCATION,
    // SOURCE United Nations Sustainable Development https://www.un.org/sustainabledevelopment/development-goals/
  },
  {
    question:
      "What percentage of people in extreme poverty are estimated to be children (under 18)?",
    answer: 50,
    categoryName: Game0To100CategoryType.INEQUALITY,
    // SOURCE UNDP Sustainable Development Goals https://www.undp.org/sustainable-development-goals
  },
  {
    question:
      "What percentage of marine and coastal ecosystems face threats from pollution and ocean acidification?",
    answer: 35,
    categoryName: Game0To100CategoryType.OCEANS,
    // SOURCE UNDP Sustainable Development Goals https://www.undp.org/sustainable-development-goals
  },
  {
    question:
      "What is the global upper secondary school completion rate as of 2024?",
    answer: 60,
    categoryName: Game0To100CategoryType.EDUCATION,
    // SOURCE United Nations Sustainable Development https://www.un.org/sustainabledevelopment/education/
  },
  {
    question:
      "What is the value in billions of dollars of clean and renewable energy support to developing countries in 2023?",
    answer: 21,
    categoryName: Game0To100CategoryType.ENERGY,
    // SOURCE United Nations Sustainable Development https://www.un.org/sustainabledevelopment/energy/
  },
  {
    question:
      "How many countries participated in sustainable consumption and production initiatives as of 2025?",
    answer: 71,
    categoryName: Game0To100CategoryType.EDUCATION,
    // SOURCE United Nations Sustainable Development https://sdgs.un.org/goals/goal12
  },
  {
    question:
      "How many kilograms of food does each person waste annually on average?",
    answer: 79,
    categoryName: Game0To100CategoryType.CONSUMPTION,
    // SOURCE UN SDG Indicators https://unstats.un.org/sdgs/report/2024/Goal-12/
  },
  {
    question: "What percentage of global food waste occurs in households?",
    answer: 60,
    categoryName: Game0To100CategoryType.CONSUMPTION,
    // SOURCE UN SDG Indicators https://unstats.un.org/sdgs/report/2024/Goal-12/
  },
  {
    question: "What percent of billionaires are men?",
    answer: 88,
    categoryName: Game0To100CategoryType.INEQUALITY,
    // SOURCE Forbes Billionaires List 2024 & World Economic Forum Gender Gap Report https://www.forbes.com/billionaires/
  },
  {
    question:
      "If the world's richest 1% cut their carbon emissions by half, what percent of global emissions could be reduced?",
    answer: 15,
    categoryName: Game0To100CategoryType.CLIMATE,
    // SOURCE Oxfam & Stockholm Environment Institute Carbon Inequality Report https://www.oxfam.org/en/research/carbon-inequality-era
  },
  {
    question: "What percent of people in low-income countries own a car?",
    answer: 5,
    categoryName: Game0To100CategoryType.POVERTY,
    // SOURCE World Bank Transport Data & Our World in Data Vehicle Ownership https://ourworldindata.org/grapher/number-of-cars-per-capita
  },
  {
    question: "What percent of refugees worldwide are under the age of 18?",
    answer: 41,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // SOURCE UNHCR Global Trends Report 2024 https://www.unhcr.org/global-trends
  },
  {
    question:
      "What percent of people worldwide live in countries where same-sex marriage is legal?",
    answer: 17,
    categoryName: Game0To100CategoryType.INEQUALITY,
    // SOURCE Pew Research Center Global Same-Sex Marriage Laws https://www.pewresearch.org/religion/2025/01/16/same-sex-marriage-laws-around-the-world/
  },
  {
    question: "What percentage of global data centers use renewable energy?",
    answer: 45,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: International Energy Agency (IEA) https://www.iea.org/reports/data-centres-and-data-transmission-networks
  },
];

export default questions;
