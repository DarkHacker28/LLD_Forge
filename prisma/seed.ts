import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const problems = [
  {
    id: "parking-lot",
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "Medium",
    description:
      "Design a parking lot system that supports multiple vehicle types, parking spots, and ticket generation.",
    requirements:
      "Support cars, bikes and trucks. Handle parking spot allocation. Generate tickets. Allow vehicle exit and fee calculation.",
  },
  {
    id: "elevator",
    title: "Elevator System",
    slug: "elevator",
    difficulty: "Medium",
    description:
      "Design an elevator system that manages multiple elevators and handles floor requests efficiently.",
    requirements:
      "Support multiple elevators. Handle internal and external requests. Track elevator state and direction. Assign suitable elevators.",
  },
  {
    id: "vending-machine",
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "Easy",
    description:
      "Design a vending machine that manages products, inventory, payments and item dispensing.",
    requirements:
      "Support product selection. Manage inventory. Accept payments. Calculate change. Handle insufficient payment and out-of-stock cases.",
  },
];

async function main() {
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { id: problem.id },
      update: problem,
      create: problem,
    });
  }

  console.log("Problems seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });