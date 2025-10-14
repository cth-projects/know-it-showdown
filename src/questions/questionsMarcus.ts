import { Game0To100CategoryType } from "@prisma/client";

const questions = [
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
      "What percentage of the urban population in Sub-Sahara Africa is living in slums? (2022) ",
    answer: 54,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },

  {
    question:
      "What percentage of the urban population in Central and Southern Asia is living in slums? (2022) ",
    answer: 43,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },

  {
    question:
      "What percentage of the urban population in Europe and Northern America is living in slums? (2022) ",
    answer: 1,
    categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    // Source: https://unstats.un.org/sdgs/report/2024/goal-11/
  },

  {
    question: "How old is the UN Secretary-General António Guterres?",
    answer: 76,
    categoryName: Game0To100CategoryType.WATER,
    // Source: https://en.wikipedia.org/wiki/Ant%C3%B3nio_Guterres
  },

  {
    question:
      "The annual UN Peacekeeping budget is what percentage of the global military spending?",
    answer: 1,
    categoryName: Game0To100CategoryType.WATER,
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
      "How many of the Sustainable Development Goals are on track as of 2024 (in procent)?",
    answer: 17,
    categoryName: Game0To100CategoryType.EDUCATION,
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

  //
];

export default questions;
