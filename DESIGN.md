# LLD Forge — Design Note

## 1. Architecture

LLD Forge uses a simple monolithic architecture built with Next.js and TypeScript.

```text
┌──────────────────────────────┐
│          Next.js UI          │
│                              │
│ Home                         │
│ Problem Details              │
│ Practice                     │
│ Feedback                     │
│ History                      │
└──────────────┬───────────────┘
               │
               ↓
┌──────────────────────────────┐
│       Next.js API Routes     │
│                              │
│ Problems                     │
│ Attempts                     │
│ Evaluation                   │
│ History                      │
└──────────────┬───────────────┘
               │
        ┌──────┴───────┐
        ↓              ↓
┌──────────────┐ ┌──────────────┐
│   Evaluator  │ │   Prisma     │
│              │ │              │
│ Rule-based   │ │ SQLite       │
│ evaluation   │ │ persistence  │
└──────────────┘ └──────────────┘
```

The architecture intentionally avoids unnecessary distributed-system complexity because the assignment focuses on LLD and domain modelling.

---

## 2. Core Domain Model

The core domain contains three entities.

```text
Problem
   │
   │ 1
   │
   │ *
   ↓
Attempt
   │
   │ 1
   │
   │ 0..1
   ↓
Evaluation
```

### Problem

Represents an LLD challenge.

Responsibilities:

* Store problem statement
* Store requirements
* Define difficulty
* Provide a stable problem identifier

### Attempt

Represents a learner's solution.

Responsibilities:

* Store submitted code
* Store design explanation
* Store trade-offs
* Track submission status
* Store final score

### Evaluation

Represents feedback generated for an attempt.

Responsibilities:

* Store category scores
* Store overall score
* Store strengths
* Store improvements
* Store evaluation summary

---

## 3. Submission Model

A meaningful attempt requires:

```text
Attempt
├── Code
├── Design Explanation
└── Trade-offs
```

### Code

Shows the learner's proposed class and interface structure.

### Design Explanation

Explains responsibilities, relationships and important design decisions.

### Trade-offs

Explains alternatives, limitations and decisions made by the learner.

This combination gives the evaluator enough information to judge both implementation and reasoning.

---

## 4. Evaluation Model

The evaluator produces five category scores:

```text
              Submission
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   Architecture  SOLID   Extensibility
        │          │          │
        └──────────┼──────────┘
                   ↓
          Requirements
                   │
                   ↓
             Code Quality
                   │
                   ↓
             Overall Score
```

Each category is scored independently before calculating the overall result.

This makes feedback more explainable than a single opaque score.

---

## 5. Evaluation Responsibilities

The evaluation logic is isolated inside:

```text
src/lib/evaluator.ts
```

The API route is responsible for:

1. Loading the attempt.
2. Loading the related problem.
3. Calling the evaluator.
4. Persisting the evaluation.
5. Updating the attempt status and score.
6. Returning the result.

The evaluator itself does not access the database.

This separation makes the evaluator easier to test and replace.

---

## 6. Future Evaluation Strategy

The current MVP uses deterministic evaluation.

The design can evolve toward:

```ts
interface EvaluationStrategy {
  evaluate(
    problem: string,
    code: string,
    explanation: string,
    tradeoffs: string
  ): Promise<EvaluationResult>;
}
```

Possible implementations:

```text
                 EvaluationStrategy
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
 RuleBasedEvaluator  AIEvaluator  HybridEvaluator
```

### RuleBasedEvaluator

Checks deterministic requirements and structural signals.

### AIEvaluator

Provides qualitative feedback using an LLM.

### HybridEvaluator

Combines deterministic checks with AI-generated design analysis.

This allows new evaluators to be introduced without changing the submission API or learner workflow.

---

## 7. Failure Handling

The submission should be persisted before evaluation.

Conceptually:

```text
SUBMITTED
    │
    ↓
EVALUATING
    │
    ├──────────────→ COMPLETED
    │
    └──────────────→ FAILED
                         │
                         ↓
                       RETRY
```

This prevents a temporary evaluator failure from losing the learner's work.

For the current MVP, evaluation is synchronous. The same persisted model can later support asynchronous workers or queues if evaluation becomes slow.

---

## 8. API Responsibilities

### `GET /api/problems`

Returns available problems.

### `POST /api/attempts`

Creates a learner attempt.

### `GET /api/attempts/:id`

Returns a specific attempt.

### `POST /api/attempts/:id/evaluate`

Runs evaluation and persists feedback.

### `GET /api/attempts/history`

Returns previous attempts and their evaluations.

The API is intentionally small and directly aligned with the product journey.

---

## 9. Data Persistence

SQLite is used for the MVP.

The database contains:

```text
Problem
Attempt
Evaluation
```

Relationships:

```text
Problem 1 ─────── * Attempt
Attempt 1 ─────── 0..1 Evaluation
```

Prisma provides the persistence abstraction, making a future migration to PostgreSQL straightforward.

---

## 10. Why This Design?

The design prioritizes:

* Clear domain responsibilities
* Simple implementation
* Explainable evaluation
* Testability
* Extensibility
* Fast development
* Minimal infrastructure

The system is deliberately not over-engineered for the MVP.

The main extensibility boundary is the **evaluation layer**, because evaluation is the part most likely to evolve from deterministic rules toward AI-assisted assessment.

---

## 11. Future Extensions

The architecture can support:

* LLM-based evaluation
* Multiple evaluator strategies
* Diagram submissions
* Asynchronous evaluation
* Authentication
* More LLD problems
* Reference solutions
* Progress tracking
* Leaderboards
* PostgreSQL
* Background evaluation workers

These can be introduced incrementally without changing the core learner journey.
