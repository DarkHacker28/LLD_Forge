import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const problems = [
  {
    id: "parking-lot",
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "Easy",
    description:
      "Design a parking lot system that can manage vehicles, parking spots, entry, exit, and availability.",
    requirements:
      "Support different vehicle types and parking spot types. Assign suitable spots, track occupied/free spots, handle vehicle entry and exit, and calculate parking duration.",
  },
  {
    id: "elevator",
    title: "Elevator System",
    slug: "elevator",
    difficulty: "Medium",
    description:
      "Design an elevator system that manages multiple elevators, floor requests, movement, and scheduling.",
    requirements:
      "Support multiple elevators, internal and external requests, elevator movement, request assignment, and handling concurrent requests efficiently.",
  },
  {
    id: "vending-machine",
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "Easy",
    description:
      "Design a vending machine that manages products, inventory, payments, and item dispensing.",
    requirements:
      "Support product selection, inventory management, accepting money, validating payments, dispensing products, returning change, and handling insufficient balance or out-of-stock products.",
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

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });