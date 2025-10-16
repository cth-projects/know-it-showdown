import { Game0To100CategoryType } from "@prisma/client";

export const questions = [
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
      "How many hundreds of liters of water more does it take to produce one kilogram of pork compared to chicken? (2010)",
    answer: 17,
    categoryName: Game0To100CategoryType.WATER,
    // source: https://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/
  },
  {
    question:
      "How many thousands of liters of water more does it take to produce one kilogram of beef compared to vegetables? (2010)",
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
    question:
      "How many percent of global CO2 emissions from transportation come from aviation?",
    answer: 12,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question:
      "How many percent of global CO2 emissions from transportation come from passenger vehicles(cars, motorcycles, and buses)?",
    answer: 45,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question:
      "How many percent of global CO2 emissions from transportation come from trains?",
    answer: 1,
    categoryName: Game0To100CategoryType.CLIMATE,
    // Source: https://ourworldindata.org/co2-emissions-from-transport
  },
  {
    question:
      "How many percent of the world's population has access to the internet?",
    answer: 68,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx
  },
  {
    question:
      "How many percent of global electricity is generated from solar power?",
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
    question:
      "How many percent of the world's population(15 years or older) are literate?",
    answer: 87,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source: https://ourworldindata.org/literacy
  },
  {
    question:
      "How many percent of women globally(15 years or older) participate in the labor force?",
    answer: 47,
    categoryName: Game0To100CategoryType.EMPLOYMENT,
    // Source: https://data.worldbank.org/indicator/SL.TLF.CACT.FE.ZS
  },
  {
    question:
      "How many percent of the world's population lacks access to essential health services?",
    answer: 50,
    categoryName: Game0To100CategoryType.HEALTH,
    // Source: https://www.who.int/news/item/13-12-2017-world-bank-and-who-half-the-world-lacks-access-to-essential-health-services-100-million-still-pushed-into-extreme-poverty-because-of-health-expenses
  },
  {
    question:
      "How many percent of the global popoulation has access to clean drinking water?",
    answer: 74,
    categoryName: Game0To100CategoryType.WATER,
    // Source: https://data.unicef.org/topic/water-and-sanitation/drinking-water/
  },
  {
    question:
      "How many percent of all the worlds wealth is owned by the richest 1 percent?",
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
    question:
      "What percentage of the population in lower-middle-income countries is living below $2.15/day? (2022)",
    answer: 12,
    categoryName: Game0To100CategoryType.POVERTY,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-01/
  },
  {
    question:
      "What percentage of the population in high-income countries is living below $2.15/day? (2022)",
    answer: 1,
    categoryName: Game0To100CategoryType.POVERTY,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-01/
  },
  {
    question:
      "What percentage of the world populationis living below $2.15/day? (2022)",
    answer: 9,
    categoryName: Game0To100CategoryType.POVERTY,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-01/
  },
  {
    question:
      "By how many percentage did the civilian deaths in armed conflict increase between 2022 to 2023?",
    answer: 75,
    categoryName: Game0To100CategoryType.PEACE,
    // Source:https://unstats.un.org/sdgs/report/2024/goal-16/
  },
  {
    question:
      "What proportion of primary schools in central and Southern Asia have access to internet?",
    answer: 18,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source:https://unstats.un.org/sdgs/report/2024/goal-04/
  },
  {
    question:
      "What proportion of primary schools in Latin America and the Caribbean have access to internet?",
    answer: 40,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source:https://unstats.un.org/sdgs/report/2024/goal-04/
  },
  {
    question:
      "What proportion of primary schools in Europe and Northern America have access to internet?",
    answer: 97,
    categoryName: Game0To100CategoryType.EDUCATION,
    // Source:https://unstats.un.org/sdgs/report/2024/goal-04/
  },
  {
    question:
      "What percentage of the urban population in Sub-Sahara Africa are living in slums? (2022) ",
    answer: 54,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },
  {
    question:
      "What percentage of the urban population in Central and Southern Asia are living in slums? (2022) ",
    answer: 43,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },
  {
    question:
      "What percentage of the urban population in Europe and Northern America are living in slums? (2022) ",
    answer: 1,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },
  {
    question:
      "The annual UN Peacekeeping budget is what percentage of the global military spending?",
    answer: 1,
    categoryName: Game0To100CategoryType.PEACE,
    // Source: https://unfoundation.org/blog/post/10-things-may-not-know-un/
  },
  {
    question:
      "The number of people without electricity grew by how many millions in 2022?",
    answer: 10,
    categoryName: Game0To100CategoryType.ENERGY,
    // Source: https://unstats.un.org/sdgs/report/2024/
  },
  {
    question:
      "What percentage of the population in Sub-Saharan Africa is covered by a mobile network(4G)? (2022)",
    answer: 49,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: https://unstats.un.org/sdgs/report/2023/Goal-09/
  },
  {
    question:
      "What percentage of the population in Central and Southern Asia is covered by a mobile network(4G)? (2022)",
    answer: 94,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: https://unstats.un.org/sdgs/report/2023/Goal-09/
  },
  {
    question:
      "What percentage of the population in Europe and Northern America is covered by a mobile network(4G)? (2022)",
    answer: 99,
    categoryName: Game0To100CategoryType.TECHNOLOGY,
    // Source: https://unstats.un.org/sdgs/report/2023/Goal-09/
  },
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
