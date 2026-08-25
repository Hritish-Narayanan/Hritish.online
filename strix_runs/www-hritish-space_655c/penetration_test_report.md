# Security Penetration Test Report

**Generated:** 2026-08-24 17:42:37 UTC

# Executive Summary

# Executive Summary

An external security assessment of **https://www.hritish.space** found **no exploitable vulnerabilities**.

**Overall risk posture:** Low.

**What was assessed:** The site is a static, single-page personal portfolio ("HRITISH — Software, Security, Systems") hosted on Vercel edge infrastructure. The assessment covered infrastructure fingerprinting, port and service discovery, directory/content enumeration, subdomain enumeration, JavaScript and client-side code review, browser-based verification of all reachable paths, and checks for injection/reflection/XSS surface, cookies, authentication, and state-changing functionality.

**Key findings**
- No dynamic attack surface exists: no APIs, forms, query parameters, user inputs, cookies, or server-side processing were identified.
- No client-side XSS sinks processing attacker-controllable data were found in the site's JavaScript.
- The only observations are informational hardening gaps: a few standard security headers (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are not set on the static responses.

**Business impact:** None identified. Unauthorized data access, modification, or service disruption could not be demonstrated against this target.

# Methodology

# Methodology

The assessment was performed as a **black-box external review** following the **OWASP Web Security Testing Guide (WSTG)** methodology, scoped exclusively to `https://www.hritish.space`.

**Phase 1 — Reconnaissance & mapping:** Passive subdomain and certificate enumeration, TLS certificate inspection, DNS/edge-resolution analysis, bounded port scanning of the hosting IP, HTTP header and technology fingerprinting, directory/content fuzzing with multiple wordlists, hidden-parameter discovery attempts, full-page crawl of the single-page application, and collection/review of all client-side assets (HTML, CSS, JavaScript).

**Phase 2 — Browser-verified validation:** A real headless browser session (which passes the Vercel edge anti-bot challenge) was used to enumerate every link and interactive element, verify the true status of paths that appeared during fuzzing (`/wedding`, `/news`, `/newreply`), audit the site's JavaScript for client-side injection sinks, and test for reflection of URL-supplied parameters and for clickjacking-relevant behavior.

**Constraints:** All active traffic was directed only at the in-scope host. The site is served behind Vercel's edge Firewall, which challenges non-browser clients; all testing was adapted to that behavior to avoid false positives.

**Categories of testing performed:** reconnaissance and fingerprinting, content/path discovery, client-side code review, XSS and reflection testing, clickjacking/header assessment, and session/state functionality review.

# Technical Analysis

# Technical Analysis

**Result:** No vulnerabilities were confirmed. Zero findings met the reporting bar, and none were filed; all suspicious signals were investigated and resolved as benign.

**Areas tested and outcomes**

1. **Infrastructure:** Hosted on Vercel (CNAME to `*.vercel-dns-*.com`; A records in Vercel address space). TLS uses a valid Let's Encrypt certificate scoped to `www.hritish.space`. Only the standard web ports (80/443) serve the application; the additional open port (21) is a shared Vercel edge service with no banner or application behavior.

2. **Content discovery:** Directory fuzzing and hidden-parameter discovery were performed. Several apparent hits (`/wedding`, `/news`, `/newreply`) were artifacts of the Vercel Firewall bot-challenge (HTTP 403 with `X-Vercel-Mitigated: challenge`); browser-based verification showed all three serve the standard Vercel 404 (`X-Vercel-Error: NOT_FOUND`), identical to arbitrary non-existent paths.

3. **Attack surface:** The site serves one static HTML document, two images, one stylesheet, one JavaScript file, and `robots.txt`. There are no dynamic endpoints, APIs, forms, query parameters, cookies, sessions, or authentication mechanisms, and no attacker-controlled input reaches any server-side or client-side sink.

4. **Client-side code review:** The single JavaScript file (11.4 KB) was fully audited. It performs DOM text-scramble/animation using an internal constant seeded at runtime; the only DOM-write sinks are sourced exclusively from static, server-rendered content, not from URL, `location`, storage, or any user input. No reflection of URL parameters into the DOM was observed.

5. **Security headers:** `Strict-Transport-Security` is present. The following are absent on responses: `Content-Security-Policy` (including `frame-ancestors`), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. These are defense-in-depth hardening items; because the page is purely static with no state-changing actions, no functional impact (e.g., clickjacking, MIME confusion) could be demonstrated.

**Systemic themes:** The site has an effectively null attack surface (static content only), and the remaining observations are configuration-hygiene items with no demonstrated exploitation path.

# Recommendations

# Recommendations

No vulnerabilities were identified. Remain open for hardening the static site:

**Short-term**
1. Add the following security headers to the Vercel configuration/app: `Content-Security-Policy` (or at minimum `frame-ancestors 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy`. On Vercel this can be done in the project's headers configuration (`vercel.json`).
2. Consider a canonical redirect (e.g., apex to `www` or vice versa) so only one host identity is served, which simplifies caching and security monitoring.

**Ongoing**
3. Retain the Vercel Firewall bot-challenge configuration; it is correctly mitigating automated abuse.
4. Since the site has no dynamic endpoints, periodic re-assessment can be limited to a lightweight check for new paths, new client-side scripts, and header changes.

**Retest guidance:** After any header/configuration change, confirm the new headers appear on all responses (including the homepage and assets) with a fresh request/response review.

