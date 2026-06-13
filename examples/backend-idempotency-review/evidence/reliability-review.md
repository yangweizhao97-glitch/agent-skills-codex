# Backend Reliability Review

## Validation

- Required fields are validated at the API boundary.
- Invalid email and unsupported interest return 422.

## Authorization

- Public lead creation is intentionally unauthenticated.
- Admin lead listing and status updates require authenticated admin access.

## Idempotency and Repeated Submission

- Duplicate email returns 409.
- Retry behavior is safe for users because the existing lead is not duplicated.

## Error Shape

All errors use:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Remaining Risk

- In-memory storage is acceptable for demo use but not production durability.

