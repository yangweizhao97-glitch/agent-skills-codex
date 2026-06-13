# Backend Bundle

## Use When

- The task changes APIs, auth, database writes, queues, jobs, webhooks, external integrations, or production behavior.

## Skills

- `api-and-interface-design`
- `test-driven-development`
- `backend-reliability-review`
- `security-and-hardening`
- `observability-and-instrumentation` when production diagnosis matters

## Completion Requires

- API or integration tests for expected and error paths
- Authorization and validation reviewed
- Idempotency, concurrency, and retry behavior considered when relevant
- Error response shape verified
- Logs or observability considered for production-facing behavior

## Failure Conditions

- Auth or authorization only enforced in frontend
- Invalid input paths untested
- Repeated submissions or retries can corrupt data
- Error responses leak secrets or internal stack traces

