import { Game0To100CategoryType, type Prisma } from "@prisma/client";

export const SDG_CATEGORIES: Prisma.Game0To100CategoryCreateInput[] = [
  {
    name: Game0To100CategoryType.POVERTY,
    title: "No Poverty",
    sdgNumber: 1,
    description:
      "End poverty in all its forms everywhere. This includes eradicating extreme poverty, reducing poverty by half, and ensuring equal rights to economic resources and basic services.",
    color: "#E5243B",
  },
  {
    name: Game0To100CategoryType.HUNGER,
    title: "Zero Hunger",
    sdgNumber: 2,
    description:
      "End hunger, achieve food security and improved nutrition and promote sustainable agriculture. This includes ending all forms of malnutrition and doubling agricultural productivity.",
    color: "#DDA63A",
  },
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
    name: Game0To100CategoryType.GENDER,
    title: "Gender Equality",
    sdgNumber: 5,
    description:
      "Achieve gender equality and empower all women and girls. This includes ending discrimination, violence, and harmful practices against women and girls, and ensuring equal opportunities in leadership.",
    color: "#FF3A21",
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
    name: Game0To100CategoryType.INEQUALITY,
    title: "Reduced Inequalities",
    sdgNumber: 10,
    description:
      "Reduce inequality within and among countries. This includes promoting social, economic and political inclusion, ensuring equal opportunity, and reducing inequalities of outcome.",
    color: "#DD1367",
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
    name: Game0To100CategoryType.CONSUMPTION,
    title: "Responsible Consumption and Production",
    sdgNumber: 12,
    description:
      "Ensure sustainable consumption and production patterns. This includes achieving sustainable management of natural resources, reducing waste generation, and promoting sustainable practices.",
    color: "#BF8B2E",
  },
  {
    name: Game0To100CategoryType.CLIMATE,
    title: "Climate Action",
    sdgNumber: 13,
    description:
      "Take urgent action to combat climate change and its impacts. This includes strengthening resilience to climate-related hazards, integrating climate measures into policies, and improving education on climate change.",
    color: "#3F7E44",
  },
  {
    name: Game0To100CategoryType.OCEANS,
    title: "Life Below Water",
    sdgNumber: 14,
    description:
      "Conserve and sustainably use the oceans, seas and marine resources. This includes reducing marine pollution, protecting marine ecosystems, and regulating fishing practices.",
    color: "#0A97D9",
  },
  {
    name: Game0To100CategoryType.ENVIRONMENT,
    title: "Life on Land",
    sdgNumber: 15,
    description:
      "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss.",
    color: "#56C02B",
  },
  {
    name: Game0To100CategoryType.PEACE,
    title: "Peace, Justice and Strong Institutions",
    sdgNumber: 16,
    description:
      "Promote peaceful and inclusive societies, provide access to justice for all and build effective, accountable institutions. This includes reducing violence, combating corruption, and ensuring responsive decision-making.",
    color: "#00689D",
  },
  {
    name: Game0To100CategoryType.PARTNERSHIPS,
    title: "Partnerships for the Goals",
    sdgNumber: 17,
    description:
      "Strengthen the means of implementation and revitalize global partnerships for sustainable development. This includes improving international cooperation, enhancing capacity-building, and promoting effective partnerships.",
    color: "#19486A",
  },
];

export function getSDGCategories(): Prisma.Game0To100CategoryCreateInput[] {
  return SDG_CATEGORIES;
}
