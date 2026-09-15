import { describe, expect, it } from "vitest";
import { evaluateSubmission } from "@/lib/evaluator";

describe("LLD Evaluator", () => {
  it("should give a low score to an incomplete submission", () => {
    const result = evaluateSubmission(
      "parking-lot",
      "class ParkingLot {}",
      "This is a simple parking lot design.",
      ""
    );

    expect(result.overallScore).toBeLessThan(50);
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it("should recognize a reasonable Parking Lot design", () => {
    const code = `
      interface Vehicle {
        getType(): string;
      }

      interface ParkingStrategy {
        findSpot(vehicle: Vehicle): string;
      }

      class ParkingLot {
        private spots: string[];

        public parkVehicle(vehicle: Vehicle) {
          return "ticket";
        }

        public exitVehicle(ticketId: string) {
          return "fee";
        }
      }

      class Car implements Vehicle {}
      class Bike implements Vehicle {}
      class Truck implements Vehicle {}
      class ParkingSpot {}
      class Ticket {}
    `;

    const explanation = `
      The parking lot uses Vehicle abstraction for car, bike and truck.
      ParkingStrategy handles allocation. ParkingLot manages parking,
      tickets and exit behaviour. Responsibilities are separated using
      composition and interfaces. The design follows SOLID principles
      and can support future vehicle types.
    `;

    const tradeoffs = `
      Strategy adds some classes but makes allocation rules easier to
      change later without modifying the ParkingLot itself.
    `;

    const result = evaluateSubmission(
      "parking-lot",
      code,
      explanation,
      tradeoffs
    );

    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.architectureScore).toBeGreaterThanOrEqual(70);
    expect(result.requirementsScore).toBeGreaterThanOrEqual(70);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("should evaluate Elevator requirements separately", () => {
    const code = `
      interface Scheduler {
        selectElevator(): string;
      }

      class Elevator {
        public moveToFloor(floor: number) {
          return floor;
        }
      }

      class ElevatorController {
        private scheduler: Scheduler;

        public request(floor: number, direction: string) {
          return "elevator";
        }
      }
    `;

    const explanation = `
      The elevator controller receives floor requests and delegates
      scheduling to a scheduler strategy. Elevator handles movement
      and direction. The design supports multiple elevators and future
      scheduling strategies through interfaces.
    `;

    const tradeoffs = `
      Using a scheduler interface adds abstraction, but it allows the
      scheduling algorithm to change without modifying the controller.
    `;

    const result = evaluateSubmission(
      "elevator",
      code,
      explanation,
      tradeoffs
    );

    expect(result.requirementsScore).toBeGreaterThanOrEqual(70);
    expect(result.extensibilityScore).toBeGreaterThanOrEqual(70);
  });

  it("should return a valid score between 0 and 100", () => {
    const result = evaluateSubmission(
      "vending-machine",
      "",
      "",
      ""
    );

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });
});