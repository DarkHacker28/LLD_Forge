# LLD Forge

**LLD Forge** is a focused practice platform for learning and evaluating Low-Level Design (LLD) through realistic software design problems.

The platform follows a simple learning loop:

**Choose Problem → Design → Submit → Get Feedback → Review → Try Again**

The MVP focuses on making LLD practice structured, explainable, and repeatable rather than simply checking whether code compiles.

---

## Features

* Practice curated LLD problems
* Problem requirements and constraints
* Submit:

  * Code
  * Design explanation
  * Trade-offs
* Deterministic submission evaluation
* Multi-dimensional feedback
* Overall score and category scores
* Strengths and improvement suggestions
* Attempt history
* Review previous submissions
* Retry problems
* Problem-specific evaluation rules

### Current Problems

1. **Parking Lot** — Medium
2. **Elevator System** — Medium
3. **Vending Machine** — Easy

---

## Core Product Flow

```text
                    ┌───────────────┐
                    │ Choose Problem│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Design / Think│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Submit Attempt│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    Evaluate   │
                    └───────┬───────┘
                            ↓
                 ┌─────────────────────┐
                 │ Feedback & Scoring  │
                 └──────────┬──────────┘
                            ↓
                    ┌───────────────┐
                    │ Review / Retry│
                    └───────────────┘
```

---

## Evaluation

LLD problems can have multiple valid designs, so the platform does not depend on a simple pass/fail model.

Submissions are evaluated across five dimensions:

| Category      | What is evaluated                                            |
| ------------- | ------------------------------------------------------------ |
| Architecture  | Structure, separation of responsibilities and overall design |
| SOLID         | Object-oriented design principles                            |
| Extensibility | Ability to support future requirements                       |
| Requirements  | Coverage of the problem requirements                         |
| Code Quality  | Structure, clarity and completeness                          |

The evaluator also produces:

* Overall score
* Category scores
* Summary
* Strengths
* Improvement suggestions

The current MVP uses deterministic rule-based evaluation so that results are predictable and testable.

An LLM-based evaluator can be added later without changing the learner-facing submission flow.

---

## LLD / Domain Design

The application uses a simple domain model:

```text
Problem
   │
   └──< Attempt
           │
           └── Evaluation
```

### Problem

Represents an LLD challenge.

Contains:

* Title
* Slug
* Difficulty
* Description
* Requirements

### Attempt

Represents a learner's submission.

Contains:

* Problem
* Code
* Design explanation
* Trade-offs
* Submission status
* Score
* Timestamp

### Evaluation

Represents feedback generated for an attempt.

Contains:

* Category scores
* Overall score
* Summary
* Strengths
* Improvements

---

## Submission Lifecycle

Attempts follow a simple lifecycle:

```text
SUBMITTED
    ↓
EVALUATING
    ↓
COMPLETED
```

If evaluation fails, the design can be extended to support:

```text
FAILED
   ↓
RETRY
```

The current MVP keeps the flow intentionally simple while leaving room for asynchronous evaluation later.

---

## Technology Stack

* **Next.js** — Application framework
* **TypeScript** — Type safety
* **Tailwind CSS** — UI styling
* **Prisma** — Database ORM
* **SQLite** — Lightweight MVP database
* **Vitest** — Automated testing

The application is intentionally implemented as a simple monolith because the assignment is focused on LLD/domain design rather than distributed systems.

---

## Project Structure

```text
lld-forge/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── attempts/
│   │   │   └── problems/
│   │   │
│   │   ├── feedback/
│   │   ├── history/
│   │   ├── practice/
│   │   ├── problems/
│   │   └── page.tsx
│   │
│   ├── __tests__/
│   │   └── evaluator.test.ts
│   │
│   └── lib/
│       ├── evaluator.ts
│       └── prisma.ts
│
├── AI_USAGE.md
├── README.md
├── prisma7.config.ts
├── vitest.config.ts
└── package.json
```

---

## API Endpoints

### Problems

```text
GET /api/problems
```

Returns the available LLD problems.

---

### Create Attempt

```text
POST /api/attempts
```

Creates a new submission for a problem.

---

### Get Attempt

```text
GET /api/attempts/:id
```

Returns a specific attempt and its problem.

---

### Evaluate Attempt

```text
POST /api/attempts/:id/evaluate
```

Evaluates the submission and stores the resulting feedback.

---

### Attempt History

```text
GET /api/attempts/history
```

Returns previous attempts with their evaluation results.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Seed the problems

```bash
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Testing

Run the automated test suite:

```bash
npx vitest run
```

Current tests cover:

* Incomplete submissions
* Parking Lot evaluation
* Elevator-specific requirements
* Score boundary validation

---

## Build Verification

The production build can be verified with:

```bash
npm run build
```

The project is expected to pass TypeScript compilation and Next.js production build checks.

---

## Design Decisions

### Why deterministic evaluation?

For the MVP, deterministic evaluation provides:

* Predictable results
* Easy testing
* No external API dependency
* No API cost
* Easy debugging

The evaluator is isolated from the API layer, making it possible to introduce additional evaluation strategies later.

### Why SQLite?

SQLite is sufficient for a focused assignment prototype and avoids unnecessary infrastructure.

The persistence layer can later be migrated to PostgreSQL with minimal changes to the application domain.

### Why a monolith?

The core challenge is LLD practice and domain modelling. Introducing microservices would add infrastructure complexity without improving the learning experience.

---

## Future Improvements

Potential next iterations include:

* LLM-powered qualitative evaluation
* Multiple evaluation strategies
* Diagram submission support
* Async evaluation jobs
* Authentication and learner profiles
* More LLD problems
* Leaderboards and progress tracking
* Reference solutions and solution comparison
* Richer test cases for design requirements

---

## AI Usage

AI-assisted engineering decisions and accepted/rejected suggestions are documented in:

`AI_USAGE.md`

The document explains where AI was used, which suggestions were accepted or rejected, and the reasoning behind those decisions.

---

## Assignment Focus

LLD Forge is intentionally scoped around the core learning journey rather than infrastructure complexity.

The implementation demonstrates:

* Domain modelling
* Clear class/entity responsibilities
* Separation of concerns
* Explainable evaluation
* Extensible evaluator design
* Persistence
* API design
* Automated testing
* End-to-end learner workflow
