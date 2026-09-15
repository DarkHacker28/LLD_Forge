export type EvaluationResult = {
  architectureScore: number;
  solidScore: number;
  extensibilityScore: number;
  requirementsScore: number;
  codeQualityScore: number;
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export interface EvaluationStrategy {
  evaluate(
    problemSlug: string,
    code: string,
    explanation: string,
    tradeoffs: string
  ): EvaluationResult;
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function calculateRequirementScore(
  text: string,
  requirements: string[]
) {
  const matches = requirements.filter((item) =>
    text.includes(item)
  );

  const percentage = Math.round(
    (matches.length / requirements.length) * 100
  );

  return {
    matches,
    score: Math.max(40, Math.min(95, percentage)),
  };
}

export class RuleBasedEvaluator implements EvaluationStrategy {
  evaluate(
    problemSlug: string,
    codeInput: string,
    explanationInput: string,
    tradeoffsInput: string
  ): EvaluationResult {
    const code = codeInput.toLowerCase();
    const explanation = explanationInput.toLowerCase();
    const tradeoffs = tradeoffsInput.toLowerCase();

    const allText = `${code} ${explanation} ${tradeoffs}`;

    const hasCode = code.trim().length >= 100;
    const hasExplanation = explanation.trim().length >= 50;
    const hasTradeoffs = tradeoffs.trim().length >= 30;

    const hasClass = containsAny(code, [
      "class ",
      "interface ",
      "abstract class",
    ]);

    const hasMethods = containsAny(code, [
      "public ",
      "private ",
      "protected ",
      "void ",
      "return ",
      "function ",
    ]);

    const hasAbstraction = containsAny(allText, [
      "interface",
      "abstract",
      "strategy",
      "factory",
      "polymorphism",
      "composition",
      "dependency injection",
    ]);

    let requirements: string[] = [];

    let futureExtensionText =
      "future changes and new behaviours without major redesign.";

    if (problemSlug === "parking-lot") {
      requirements = [
        "car",
        "bike",
        "truck",
        "parking spot",
        "allocation",
        "ticket",
        "exit",
        "fee",
      ];

      futureExtensionText =
        "future vehicle types, pricing rules or parking allocation strategies without major changes.";
    } else if (problemSlug === "elevator") {
      requirements = [
        "elevator",
        "floor",
        "request",
        "direction",
        "up",
        "down",
        "scheduler",
        "controller",
      ];

      futureExtensionText =
        "multiple elevators, scheduling strategies, directions or new request policies without major changes.";
    } else if (problemSlug === "vending-machine") {
      requirements = [
        "product",
        "inventory",
        "stock",
        "coin",
        "payment",
        "change",
        "dispense",
        "state",
      ];

      futureExtensionText =
        "new products, payment methods, inventory rules or machine states without major changes.";
    } else {
      requirements = [
        "class",
        "interface",
        "object",
        "responsibility",
        "method",
      ];
    }

    const requirementResult = calculateRequirementScore(
      allText,
      requirements
    );

    const requirementMatches = requirementResult.matches;

    let requirementsScore = requirementResult.score;

    let architectureScore = 45;

    if (hasClass) architectureScore += 15;
    if (hasMethods) architectureScore += 10;
    if (hasAbstraction) architectureScore += 15;
    if (hasCode && hasExplanation) architectureScore += 10;

    architectureScore = Math.min(architectureScore, 100);

    const solidKeywords = [
      "solid",
      "single responsibility",
      "open/closed",
      "liskov",
      "interface segregation",
      "dependency inversion",
      "dependency injection",
    ];

    const solidMatches = solidKeywords.filter((keyword) =>
      allText.includes(keyword)
    );

    let solidScore = 50;

    if (solidMatches.length >= 3) {
      solidScore = 90;
    } else if (solidMatches.length === 2) {
      solidScore = 80;
    } else if (solidMatches.length === 1) {
      solidScore = 68;
    }

    if (hasAbstraction) {
      solidScore += 5;
    }

    solidScore = Math.min(solidScore, 100);

    const extensibilityKeywords = [
      "extensible",
      "extension",
      "strategy",
      "interface",
      "factory",
      "open/closed",
      "future",
      "scale",
      "scalable",
      "new ",
      "without changing",
      "without modifying",
    ];

    const extensibilityMatches = extensibilityKeywords.filter(
      (keyword) => allText.includes(keyword)
    );

    let extensibilityScore = 50;

    if (extensibilityMatches.length >= 4) {
      extensibilityScore = 90;
    } else if (extensibilityMatches.length >= 2) {
      extensibilityScore = 78;
    } else if (extensibilityMatches.length === 1) {
      extensibilityScore = 65;
    }

    if (hasAbstraction) {
      extensibilityScore += 5;
    }

    extensibilityScore = Math.min(extensibilityScore, 100);

    let codeQualityScore = 45;

    if (hasCode) codeQualityScore += 15;
    if (hasClass) codeQualityScore += 10;
    if (hasMethods) codeQualityScore += 10;

    if (code.includes("const ") || code.includes("private ")) {
      codeQualityScore += 5;
    }

    if (code.length > 500) {
      codeQualityScore += 5;
    }

    codeQualityScore = Math.min(codeQualityScore, 100);

    if (!hasCode || !hasExplanation) {
      architectureScore = Math.min(architectureScore, 40);
      solidScore = Math.min(solidScore, 35);
      extensibilityScore = Math.min(extensibilityScore, 35);
      requirementsScore = Math.min(requirementsScore, 40);
      codeQualityScore = Math.min(codeQualityScore, 35);
    }

    if (!hasTradeoffs) {
      extensibilityScore = Math.min(extensibilityScore, 70);
    }

    const overallScore = Math.round(
      (architectureScore +
        solidScore +
        extensibilityScore +
        requirementsScore +
        codeQualityScore) /
        5
    );

    const strengths: string[] = [];

    if (hasCode && hasClass) {
      strengths.push(
        "The submission contains a concrete object-oriented implementation."
      );
    }

    if (
      requirementMatches.length >=
      Math.ceil(requirements.length * 0.6)
    ) {
      strengths.push(
        `The design addresses ${requirementMatches.length} of the ${requirements.length} key problem requirements.`
      );
    }

    if (hasAbstraction) {
      strengths.push(
        "The design shows evidence of abstraction through interfaces, strategies, factories or composition."
      );
    }

    if (solidMatches.length >= 2) {
      strengths.push(
        "The explanation demonstrates awareness of multiple SOLID principles."
      );
    }

    if (extensibilityMatches.length >= 2) {
      strengths.push(
        "The design considers future changes and extensibility."
      );
    }

    if (strengths.length === 0) {
      strengths.push(
        "The submission provides a starting point, but the design needs more concrete domain modelling."
      );
    }

    const improvements: string[] = [];

    if (requirementMatches.length < requirements.length) {
      const missing = requirements.filter(
        (item) => !allText.includes(item)
      );

      improvements.push(
        `Explicitly address missing requirements: ${missing.join(", ")}.`
      );
    }

    if (!hasAbstraction) {
      improvements.push(
        "Introduce clear interfaces or abstractions for behaviours that may change."
      );
    }

    if (solidMatches.length < 2) {
      improvements.push(
        "Explain how responsibilities are separated and how the design follows SOLID principles."
      );
    }

    if (extensibilityMatches.length < 2) {
      improvements.push(
        `Explain how the design can support ${futureExtensionText}`
      );
    }

    if (!hasTradeoffs) {
      improvements.push(
        "Add trade-offs and explain why you selected this design over reasonable alternatives."
      );
    }

    if (!hasCode) {
      improvements.push(
        "Provide a meaningful code-level design with classes, interfaces and important methods."
      );
    }

    if (!hasExplanation) {
      improvements.push(
        "Provide a detailed explanation of responsibilities and interactions between the main classes."
      );
    }

    const summary =
      overallScore >= 85
        ? "Strong LLD submission. The design covers the core requirements and demonstrates good abstraction and extensibility."
        : overallScore >= 70
          ? "Good foundation. The main domain behaviour is present, but responsibilities, SOLID principles and extensibility can be made clearer."
          : overallScore >= 50
            ? "The submission shows some useful ideas, but several core requirements and design decisions need more detail."
            : "The submission needs significant improvement before it represents a complete LLD solution.";

    return {
      architectureScore,
      solidScore,
      extensibilityScore,
      requirementsScore,
      codeQualityScore,
      overallScore,
      summary,
      strengths,
      improvements,
    };
  }
}

export const ruleBasedEvaluator = new RuleBasedEvaluator();

export function evaluateSubmission(
  problemSlug: string,
  code: string,
  explanation: string,
  tradeoffs: string
): EvaluationResult {
  return ruleBasedEvaluator.evaluate(
    problemSlug,
    code,
    explanation,
    tradeoffs
  );
}