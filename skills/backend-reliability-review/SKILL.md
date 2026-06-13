---
name: backend-reliability-review
description: Reviews backend and full-stack changes for production reliability risks. Use when creating or modifying APIs, database writes, authentication or authorization logic, payments, orders, queues, webhooks, background jobs, external integrations, or any backend behavior where validation, permissions, transactions, concurrency, idempotency, error handling, security, performance, or observability determine whether the change is safe.
---

# Backend Reliability Review

## Overview

Review backend behavior beyond "the endpoint runs." Passing requests and green unit tests are not sufficient when user data, money, permissions, shared resources, or production operations are involved. Verify that the backend is correct under invalid input, unauthorized access, repeated submissions, concurrent operations, dependency failures, and operational debugging.

Use this skill alongside `api-and-interface-design`, `security-and-hardening`, `test-driven-development`, and `observability-and-instrumentation` when a backend change has user or production impact.

## When to Use

Use this skill for backend or full-stack work that touches:

- API endpoints, handlers, resolvers, controllers, or service methods
- Authentication, authorization, sessions, roles, tenants, or resource ownership
- Database writes, migrations, transactions, queues, or background jobs
- Payments, orders, inventory, balances, bookings, notifications, or email sends
- Webhooks, third-party APIs, retries, rate limits, or timeouts
- File uploads, imports, exports, or data processing
- Caching, pagination, search, filtering, or performance-sensitive queries

Do not use this skill for frontend-only visual changes with no backend contract or data-flow impact.

## Core Workflow

### 1. Identify the Backend Contract

List the operation being reviewed:

- Entry point: route, job, command, webhook, or service method
- Caller: user role, system actor, external service, or scheduled process
- Inputs: required fields, optional fields, types, ranges, IDs, files, headers
- Side effects: database writes, external calls, emails, events, cache changes
- Expected result: response shape, status code, persisted state, emitted event

If the contract is unclear, inspect the tests, docs, schema, routes, and callers before reviewing reliability.

### 2. Check Validation and API Semantics

Verify:

- Required fields are enforced
- Types, lengths, ranges, enum values, and formats are validated
- Unknown or extra fields are handled intentionally
- Invalid IDs, missing records, and deleted records return clear errors
- Error responses use consistent status codes and shapes
- Pagination, sorting, filtering, and limits have safe defaults
- Large inputs, empty inputs, and malformed payloads cannot crash the handler

Do not accept "the happy path works" as API correctness.

### 3. Check Authorization and Data Boundaries

Verify:

- Authentication is required where appropriate
- Role checks match the business rule
- Resource ownership or tenant isolation is enforced server-side
- Users cannot read, update, delete, or infer another user's data
- Admin-only, internal-only, and webhook-only paths cannot be called by ordinary users
- Sensitive fields are not returned accidentally
- Secrets, tokens, and internal IDs are not logged or exposed

If authorization depends only on UI hiding, the backend is not reliable.

### 4. Check State Changes and Consistency

For write paths, verify:

- Database updates that must succeed together run in a transaction
- Rollback behavior is correct when a later step fails
- Repeated submissions do not create duplicate orders, charges, emails, or records
- State transitions are legal and cannot skip required states
- Soft-deleted, archived, expired, or locked records are handled
- Cache invalidation or revalidation happens after writes
- Events or background jobs are emitted only after durable state is committed

For workflows involving money, inventory, bookings, quotas, likes, votes, or limited resources, explicitly review race conditions.

### 5. Check Concurrency and Idempotency

Ask what happens when the same operation runs twice or at the same time.

Verify:

- Unique constraints or locks protect resources that must be unique
- Counters, balances, inventory, and quotas cannot go negative or double-count
- Payment, order creation, webhook processing, and email sending are idempotent
- Retries are safe and do not multiply side effects
- External callbacks can arrive late, out of order, or more than once
- Long-running jobs can resume or fail without corrupting data

If the operation cannot be safely retried, document why and add guardrails.

### 6. Check Failure Handling and Observability

Verify:

- Expected failures return actionable errors, not generic 500s
- Unexpected exceptions are logged with enough context to debug
- Logs avoid secrets and personal data
- Timeouts, retries, and circuit-breaker behavior are intentional for external calls
- Metrics or traces exist for high-risk paths
- The system can distinguish validation failures, permission failures, dependency failures, and internal bugs
- Users see a safe error state while operators get enough evidence to diagnose

Production failures should become queries, not archaeology.

### 7. Check Performance and Scale

Verify:

- Queries avoid N+1 behavior
- Large lists use pagination or streaming
- Database filters use appropriate indexes
- Expensive work is moved to a job when request latency would suffer
- Caching does not serve stale or unauthorized data
- Request body size, upload size, and rate limits are enforced where needed

Measure when performance is a requirement or the code path handles large data.

## Common Rationalizations

| Rationalization | Counter |
|---|---|
| "The endpoint returns 200." | A 200 only proves one path. Reliability requires invalid input, unauthorized access, repeated calls, and failure paths. |
| "The frontend prevents that." | Backend rules must hold when the UI is bypassed. Treat every client as untrusted. |
| "This cannot happen in practice." | Concurrency, retries, duplicate webhooks, and stale clients happen in production. Add proof or guardrails. |
| "The database will handle it." | Only explicit constraints, transactions, locks, and isolation choices handle consistency. |
| "We can debug it from logs." | Logs must contain the right context before the incident. Missing telemetry is a product bug. |

## Verification

A backend or full-stack task is incomplete if reliability evidence is missing for the relevant risk areas.

Minimum exit checklist:

- [ ] Input validation and error semantics checked
- [ ] Authentication, authorization, and resource ownership checked
- [ ] Data consistency, transaction, and rollback behavior checked for writes
- [ ] Concurrency and idempotency checked for repeated or parallel operations
- [ ] External dependency failure behavior checked where applicable
- [ ] Security risks checked for untrusted input and sensitive data exposure
- [ ] Performance risks checked for large data, N+1 queries, and missing limits
- [ ] Logs, metrics, or traces checked for diagnosability on high-risk paths
- [ ] Tests or manual evidence added for the highest-risk paths

## Report Format

```markdown
Backend reliability review:
- Operation reviewed: [route/job/service]
- Highest-risk areas: [validation/auth/consistency/concurrency/idempotency/etc.]
- Result: Pass/Fail
- Evidence: [tests, code references, logs, request examples, DB constraints]
- Issues fixed: [summary]
- Remaining risks: [explicitly accepted risks]
```

## Red Flags

Stop and review reliability if you see:

- Authorization only enforced in the frontend
- Database writes split across multiple steps without transaction reasoning
- Payment, webhook, order, or email flows without idempotency
- Counters, inventory, balance, or quota updates without concurrency protection
- Catch-all error handling that hides root causes
- Logs containing secrets or missing request/user/resource context
- List endpoints without pagination or limits
- Tests covering only the happy path
