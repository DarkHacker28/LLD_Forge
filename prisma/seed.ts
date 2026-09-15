import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.problem.upsert({
    where: { slug: "parking-lot" },
    update: {},
    create: {
      id: "parking-lot",
      title: "Parking Lot",
      slug: "parking-lot",
      difficulty: "Easy",
      description:
        "Design a parking lot system that supports multiple vehicle types and parking spot types.",
      requirements: JSON.stringify([
        "Support cars, bikes, and trucks",
        "Support different parking spot types",
        "Assign an appropriate spot when a vehicle enters",
        "Release the spot when a vehicle exits",
        "Calculate parking fees",
      ]),
    },
  });

  await prisma.problem.upsert({
    where: { slug: "elevator" },
    update: {},
    create: {
      id: "elevator",
      title: "Elevator System",
      slug: "elevator",
      difficulty: "Medium",
      description:
        "Design an elevator system that manages multiple elevators and requests efficiently.",
      requirements: JSON.stringify([
        "Support multiple elevators",
        "Accept floor requests",
        "Assign elevators to requests",
        "Track elevator state and direction",
        "Handle concurrent requests",
      ]),
    },
  });

  await prisma.problem.upsert({
    where: { slug: "vending-machine" },
    update: {},
    create: {
      id: "vending-machine",
      title: "Vending Machine",
      slug: "vending-machine",
      difficulty: "Easy",
      description:
        "Design a vending machine that manages products, inventory, payments, and dispensing.",
      requirements: JSON.stringify([
        "Support multiple products",
        "Track inventory",
        "Accept payments",
        "Dispense selected products",
        "Return change",
        "Handle invalid or insufficient payments",
      ]),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed successfully.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });