# LLD Practice Platform — Research Note

## 1. Problem Understanding

Low-Level Design (LLD) interviews and practice exercises are difficult to evaluate because there is usually no single correct implementation.

Two learners can design the same system using different:

* Classes
* Interfaces
* Design patterns
* Object relationships
* Abstractions

Both solutions can still be valid.

Therefore, an LLD practice platform should focus on **design reasoning and trade-offs**, not only code correctness.

The learner should be able to:

1. Understand a realistic problem.
2. Identify entities and responsibilities.
3. Define relationships between objects.
4. Explain design decisions.
5. Submit an implementation or pseudocode.
6. Receive actionable feedback.
7. Review previous attempts.
8. Improve and try again.

---

## 2. What Should a Learner Provide?

A meaningful LLD attempt should contain three parts.

### Code / Class Design

The learner provides classes, interfaces or pseudocode demonstrating the proposed implementation.

For example, for Parking Lot:

```text
ParkingLot
Vehicle
ParkingSpot
Ticket
EntryGate
ExitGate
ParkingStrategy
```

This allows the evaluator to inspect responsibilities and relationships.

### Design Explanation

The learner explains:

* Why the classes exist
* Responsibilities of each class
* Relationships between objects
* Important design decisions
* How the system behaves

This is important because good LLD is not only about writing code.

### Trade-offs

The learner should explain alternatives and limitations.

For example:

> I used a strategy interface for spot allocation so that nearest-spot and first-available strategies can be introduced without changing ParkingLot.

This gives the evaluator insight into the learner's design reasoning.

---

## 3. What Makes Feedback Useful?

A simple score such as `72/100` is not enough.

Useful feedback should answer:

* What was done well?
* Which requirements were missed?
* Are responsibilities properly separated?
* Is the design extensible?
* Are classes too tightly coupled?
* Are SOLID principles being followed?
* What should be changed in the next attempt?

Therefore, LLD Forge provides feedback across multiple dimensions:

1. Architecture
2. SOLID principles
3. Extensibility
4. Requirement coverage
5. Code quality

The platform also returns strengths and improvement suggestions.

This makes feedback more actionable than a binary pass/fail result.

---

## 4. Evaluation Strategy

There are two practical approaches.

### Deterministic Evaluation

A rule-based evaluator can check predictable signals such as:

* Required concepts
* Expected entities
* Interfaces
* Problem-specific requirements
* Submission completeness
* Basic code-quality indicators

#### Advantages

* Predictable
* Fast
* Testable
* No API dependency
* No external cost

#### Limitations

It cannot fully understand whether a design is elegant or whether two alternative designs are equally valid.

---

### LLM-Based Evaluation

An LLM can evaluate more qualitative aspects such as:

* Responsibility allocation
* Coupling and cohesion
* Design pattern usage
* SOLID reasoning
* Trade-offs
* Alternative designs
* Architectural quality

#### Advantages

* Better qualitative reasoning
* Can explain design decisions
* Can handle different valid approaches

#### Limitations

* Non-deterministic
* Requires API access
* Adds latency and cost
* Requires careful prompting
* Needs protection against inconsistent scoring

---

## 5. Recommended Approach

For the MVP, a **hybrid evaluation model** is the best direction.

```text
                    Submission
                        │
                        ↓
                Deterministic Checks
                        │
                        ↓
                Structural Feedback
                        │
                        ↓
             Optional LLM Evaluation
                        │
                        ↓
             Combined Learner Feedback
```

The deterministic evaluator provides predictable baseline scoring.

An LLM evaluator can later provide deeper qualitative feedback.

This also allows the system to continue functioning when the LLM service is unavailable.

---

## 6. Extensibility

The evaluator should not be tightly coupled to one implementation.

A future abstraction can use:

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
       ├── RuleBasedEvaluator
       │
       ├── AIEvaluator
       │
       └── HybridEvaluator
```

This allows another evaluator or submission format to be introduced without changing the core submission flow.

---

## 7. Handling Slow or Failed Evaluation

Evaluation may eventually involve an external LLM service and therefore may take time or fail.

A production-oriented flow should support:

```text
SUBMITTED
    ↓
EVALUATING
    ↓
COMPLETED
```

If evaluation fails:

```text
EVALUATING
    ↓
FAILED
    ↓
RETRY
```

The learner should not lose the original submission.

The attempt should remain persisted independently from its evaluation result.

This allows evaluation to be retried without asking the learner to submit everything again.

---

## 8. MVP Scope

The platform should avoid unnecessary complexity during the initial implementation.

### Included

* Three LLD problems
* Problem requirements
* Code submission
* Design explanation
* Trade-offs
* Deterministic evaluation
* Multi-dimensional feedback
* Attempt history
* Retry flow
* Automated evaluator tests

### Deferred

* Authentication
* Admin dashboard
* Payment
* Microservices
* Kubernetes
* Real-time collaboration
* Advanced diagram editor
* Full LLM evaluation

This keeps the implementation focused on the core learning experience and LLD/domain design.

---

## 9. Key Product Insight

The most important product decision is to treat an LLD submission as a **design argument**, not just a code submission.

A strong practice platform should evaluate:

> **What did the learner design, why did they design it that way, and how well can that design evolve?**

This is the primary principle behind LLD Forge.
