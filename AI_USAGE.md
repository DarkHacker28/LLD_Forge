# AI Usage

AI tools were used as a development assistant during the implementation of LLD Forge. The goal was to accelerate implementation while keeping architectural and product decisions understandable and reviewable.

## 1. Database and Domain Model

**Decision:** Use Prisma with SQLite for the MVP.

**AI suggestion:** Use a simple relational model with `Problem`, `Attempt`, and `Evaluation` entities.

**Accepted:** Yes.

**Why:** The model directly represents the product flow:

Problem → Attempt → Evaluation

SQLite keeps the prototype simple and avoids unnecessary infrastructure for a 2-day assignment.

---

## 2. Evaluation Approach

**Decision:** Use deterministic rule-based evaluation for the MVP instead of depending entirely on an LLM.

**AI suggestion:** Evaluate submissions using problem-specific requirements, object-oriented structure, SOLID-related concepts, extensibility indicators and code-quality signals.

**Accepted:** Yes.

**Why:** Deterministic evaluation provides predictable results, works without external API failures or API costs, and makes the evaluation logic easy to test.

An LLM evaluator can be added later without changing the learner-facing submission flow.

---

## 3. Separation of Evaluation Logic

**Decision:** Extract evaluation logic from the API route into a reusable evaluator module.

**AI suggestion:** Keep database/HTTP responsibilities inside the route and move evaluation logic into `src/lib/evaluator.ts`.

**Accepted:** Yes.

**Why:** This follows separation of concerns and makes the evaluator independently testable. It also makes it easier to introduce additional evaluation strategies later.

---

## 4. Submission Feedback

**Decision:** Evaluate submissions across multiple dimensions instead of returning only one score.

**AI suggestion:** Provide scores for:

- Architecture
- SOLID
- Extensibility
- Requirements
- Code Quality

Also provide strengths, improvements and a summary.

**Accepted:** Yes.

**Why:** LLD problems can have multiple valid solutions, so a single pass/fail result would not provide enough learning value. Category-based feedback makes the evaluation more explainable.

---

## 5. Testing Strategy

**Decision:** Add automated tests for the evaluator.

**AI suggestion:** Test both strong and weak submissions, including problem-specific requirements.

**Accepted:** Yes.

**Why:** The evaluator is an important part of the product and should behave predictably. Tests currently cover incomplete submissions, Parking Lot evaluation, Elevator requirements and score boundaries.

---

## AI Decisions Rejected or Deferred

### Full LLM Evaluation

**Decision:** Not included in the initial MVP.

**Reason:** The assignment allows AI evaluation, but a deterministic evaluator was faster to implement, easier to test and does not require API credentials or external service availability.

### Microservices Architecture

**Decision:** Rejected.

**Reason:** The assignment specifically focuses on LLD/domain modelling and the prototype does not require distributed infrastructure. A simple monolithic Next.js application is more appropriate for the scope.

### Authentication

**Decision:** Deferred.

**Reason:** Login and user management are not required for demonstrating the core practice journey. Adding authentication would increase implementation complexity without improving the core LLD workflow.

### Advanced Diagram Editor

**Decision:** Deferred.

**Reason:** The learner can currently describe their design through code and explanation. A drag-and-drop diagram editor would add significant UI complexity and was not necessary for demonstrating the core product flow within the assignment timeline.