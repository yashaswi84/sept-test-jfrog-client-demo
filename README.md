# jfrog-client-demo

A deliberately vulnerable Node.js Express API used to demonstrate JFrog security scanning capabilities.

## Vulnerabilities Included

### Dependencies (caught by jf audit + jf scan)
- lodash 4.17.15 — Prototype pollution (CVE-2021-23337)
- axios 0.21.1 — SSRF vulnerability (CVE-2021-3749)
- minimist 1.2.5 — Prototype pollution
- serialize-javascript 3.0.0 — XSS (CVE-2020-7660)
- jsonwebtoken 8.5.1 — Algorithm confusion (CVE-2022-23529)
- express 4.17.1 — ReDoS and open redirect CVEs
- node-uuid 1.4.7 — Deprecated package
- mongoose 5.9.7 — Prototype pollution via query injection

### Code Issues (caught by JAS SAST)
- Hardcoded secrets (JWT, AWS keys, DB password, Stripe key)
- Path traversal via unsanitized file path input
- SSRF via unvalidated user-controlled URL
- eval() of user input
- JWT none algorithm allowed

### License Violations (caught by jf build-scan)
- Package marked as UNLICENSED

## Security Scanning
This project is scanned by:
- jf audit — source code dependency scan
- jf scan — artifact scan
- jf build-scan — full build record scan in Artifactory
