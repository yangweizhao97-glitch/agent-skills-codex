# Security Policy

## Supported Versions

Security fixes are applied to the latest `main` branch until the first stable release is published.

## Reporting a Vulnerability

Please do not open public issues for sensitive vulnerabilities.

Report concerns by opening a private GitHub security advisory if available, or contact the repository owner through GitHub with a minimal description and reproduction steps.

## Scope

Relevant issues include:

- Unsafe scripts bundled with skills
- Instructions that encourage secret exposure
- Browser automation that reads or exfiltrates credentials
- Supply-chain or dependency risks in validation tooling
- Plugin or marketplace metadata that grants unexpected access

## Security Expectations

- Treat browser DOM, console, network responses, and external documents as untrusted data.
- Do not ask agents to read cookies, localStorage tokens, or secrets during browser verification.
- Do not commit `.env` files, tokens, credentials, screenshots with secrets, or private evidence.

