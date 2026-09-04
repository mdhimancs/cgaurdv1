# CyberGuard — Executive Cybersecurity & Tech Debt Governance Platform

> **Location:** `/README.md`  
> **Target Audience:** Chief Information Security Officers (CISO), Senior Vice Presidents (SVP), Security Directors, Lead SecOps Engineers, and Enterprise Audit Committees.

---

## 🛡️ Executive Summary

**CyberGuard** is an enterprise-grade, high-density executive cybersecurity governance and technical debt management platform. Engineered for senior leadership and security operations teams, it unifies continuous security posture telemetry, identity governance, Zero Trust evaluation, audit issue remediation, legacy tech debt retirement, third-party risk management (TPRM), and firm-wide security training into a single glass pane.

---

## 🚀 Key Feature Modules & Capabilities

### 1. 📊 Executive Overview & Leadership Cockpit
* **Executive KPI Ribbon:** Real-time visibility into Firm-Wide Security Score, Active Threat Levels, Overdue Audit SLAs, Critical EOL Tech Debt, Phishing Resilience, and Mean Time to Remediate (MTTR).
* **Multi-Persona Role-Based Views:**
  * **SVP Global (Global View):** Enterprise-wide visibility across all business units, regulatory risks, and strategic capital expenditure.
  * **Group Manager:** Divisional aggregation across multi-disciplinary engineering squads.
  * **Business Unit Lead:** Tailored view focused strictly on specific BU assets, team compliance, and local remediations.
* **Live Telemetry Ticker:** Real-time status heartbeat across 12+ security data fabrics (Splunk SIEM, CrowdStrike Falcon, CyberArk PAM, AWS GuardDuty, Okta IGA, Wiz, Snyk, Tenable).
* **Business Unit Performance Matrix:** Granular comparative analytics across Global Markets, Consumer Tech, Retail Banking, Corporate Functions, and Wealth Management.
* **Executive Security Incident Feed:** Live tracking of ongoing and resolved incidents with severity, affected BU, time-to-mitigate, and financial/operational impact details.
* **Boardroom Deck Generator:** One-click automated compilation of executive board summaries, risk radars, and compliance attestations ready for presentation or print.

---

### 2. 🔑 Identity, PAM & Zero Trust Architecture (ZTNA)
* **Identity Governance & Privileged Access Management (IGA / PAM):**
  * Just-In-Time (JIT) ephemeral session tracking and password vault rotation compliance.
  * CyberArk safe checkout auditing with mandatory ITSM / ServiceNow ticket binding.
  * Emergency break-glass root account surveillance and unauthorized standing privilege deprecation.
  * Cloud Infrastructure Entitlement Management (CIEM) right-sizing for AWS IAM, Azure RBAC, and GCP IAM.
* **Zero Trust Network Access & Continuous Device Posture (ZTNA):**
  * NIST SP 800-207 compliant continuous device health attestation (EDR active, BitLocker/FileVault encryption).
  * Legacy flat-network VPN deprecation roadmap and Cloudflare/Zscaler ZPA micro-segmentation metrics.
  * Impossible-travel detection and real-time conditional risk-based step-up authentication.
  * Sub-45-second dynamic OAuth session token revocation and device quarantine playbooks.
* **Non-Human Identities (NHI) & Machine Secrets Governance:**
  * Complete discovery and inventory across 18,400+ machine credentials (service accounts, API tokens, bots).
  * Automated migration from long-lived static cloud keys (`AKIA...`) to AWS/GCP OIDC Workload Identity Federation.
  * Kubernetes `ServiceAccount` wildcard token isolation and pod volume mounting security.
  * Automated PKI/TLS certificate lifecycle renewal tracking for certificates expiring in <30 days.
  * Third-party enterprise OAuth application consent governance and tenant-wide permission stripping.
* **Identity Threat Detection & Response (ITDR):**
  * Real-time MITRE ATT&CK behavioral defense against Active Directory Kerberoasting (`T1558.003`) and AS-REP Roasting.
  * Distributed credential password spray detection and perimeter ASN proxy blocking.
  * MFA fatigue push-bombing mitigation via mandatory Okta/Entra number-matching and biometric step-up.
* **Segregation of Duties (SoD) & Toxic Access Governance Suite:**
  * **Continuous Entitlement Toxic Combination Scanner:** Integrated with SailPoint, Okta Identity Governance, and SAP GRC Access Control.
  * **Granular Toxic Combinations Matrix:** Detects critical dual-privilege violations across SAP AP Invoice creation vs. payment release, AWS IAM Admin vs. CloudTrail log deletion, Core Banking maker-checker overrides, and GitHub admin vs. production deployment signer.
  * **Interactive Role Revocation Workflows:** Instant strip & de-provision actions with live audit telemetry validation.
  * **SoD Policy & Rules Directory:** Complete regulatory rule catalog mapped to SOX 404, PCI-DSS 10.5, ISO 27001, FFIEC, and SOC 2 Type II.
  * **Access Certification Campaigns:** Re-attestation progress monitoring by Business Unit, tracking total entitlements, certifications, and auto-revocations.
  * **Dual-Control (Maker-Checker) 4-Eyes Telemetry:** Audits high-consequence operations across SWIFT payment gateways, AWS root IAM policies, and vendor master records.

---

### 3. 🎯 Attack Surface Posture (ASP) & Vulnerability Management
* **Vulnerability Assessment & Management (VAM):**
  * Real-time CVE inventory categorized by CVSS v3/v4, CISA KEV (Known Exploited Vulnerabilities), and EPSS exploit probability scores.
  * SLA deadline countdowns, overdue tracking, and automated patch trigger actions.
* **Open-Source Software (OSS) Mesh & Supply Chain Security:**
  * **Vulnerabilities & Reachability Analysis:** Distinguishes between packages reachable in active production execution paths vs. dead code to eliminate 68% of alert fatigue.
  * **EPSS Exploit Prediction & CISA KEV Badging:** Prioritizes active real-world weaponized exploits over theoretical severity.
  * **Automated Patch PR Merging:** One-click automated pull request merges upgrading vulnerable packages directly to safe versions.
  * **Open-Source License & Copyleft Governance:** Identifies viral SSPL/AGPL/GPL copyleft licenses threatening proprietary commercial intellectual property.
  * **SBOM CycloneDX & SPDX Registry:** Ingests and provides downloadable CycloneDX 1.5 JSON manifests cryptographically signed with Sigstore Cosign keys.
  * **Open-Source Telemetry Connectors:** Continuous health and event throughput metrics for DefectDojo, Wazuh XDR, OpenVAS/Greenbone, Cloud Custodian, TruffleHog, and Syft/Grype.
* **Responsive & Adaptive Data Tables (Word Wrap Enabled):**
  * All tables throughout the application (Overview, VAM, Audits, Tech Debt, ZTNA, NHI, ITDR, Training, SoD, OpenSource Mesh, MITRE SIEM, Boardroom Benchmark) feature enabled word wrapping (`table-auto`, `break-words`, `break-all`) ensuring that CVE identifiers, URLs, role strings, and descriptions remain readable without truncation or overflow.
* **Cloud Security Posture Management (CSPM):**
  * Real-time posture tracking across AWS, Microsoft Azure, and Google Cloud Platform (GCP).
  * Public storage bucket exposure detection, open security groups (0.0.0.0/0), and CIS Cloud Benchmark alignment.
* **Network & Perimeter Security:**
  * Ingress/egress anomaly detection, unmanaged port exposures, edge WAF rule efficiency, and deprecated TLS cipher suites.
* **CI/CD & Software Supply Chain Security:**
  * Hardcoded credential detection in source code repositories (TruffleHog / GitGuardian telemetry).
  * Software Bill of Materials (SBOM) ingestion, vulnerable transitive dependency scanning, and Cosign image signing verification.
* **Data Privacy, Residency & DLP Posture:**
  * Sensitive data discovery (PII, PCI, PHI) across databases and unstructured storage.
  * Cross-border data transfer compliance with GDPR, CCPA, and regional data residency mandates.
* **AI Security & LLM Governance:**
  * OWASP Top 10 for LLMs posture evaluation (prompt injection protection, training data privacy, API token security).
  * Shadow AI monitoring and data exfiltration guardrails for generative AI models.
* **Offensive Attack Paths & Choke Point Analysis:**
  * Graph-based visual attack path modeling from perimeter ingress points to critical crown jewel data stores.
* **Cyber Asset Attack Surface Management (CAASM):**
  * Unified inventory reconciling physical devices, cloud workloads, virtual instances, serverless functions, and shadow IT assets.
* **Open-Source Software (OSS) Mesh:**
  * Dependency graph hygiene, open-source license risk classification (GPL/AGPL vs. MIT/Apache), and container base image vulnerabilities.

---

### 4. 📑 Governance, Risk, Compliance (GRC) & Operations
* **Audit Issue Management:**
  * Centralized lifecycle tracking for internal audit findings and external regulatory reviews (SOX 404, ISO 27001, PCI-DSS, SOC 2, NIST CSF).
  * Detailed Management Action Plans (MAP), progress percentages, assigned lead auditors, and accountable BU VPs.
  * Interactive issue status lifecycle transitions (Open, In Progress, Under Review, Remediated, Overdue).
* **Legacy Technical Debt & EOL Modernization Tracker:**
  * Inventory of aging infrastructure (Legacy OS, End-of-Life Databases, Monolithic Core Apps, Deprecated Protocols).
  * Modernization capital budgeting, annual maintenance cost burden, and target retirement roadmaps.
* **Third-Party Risk Management (TPRM):**
  * Tier 1, Tier 2, and Tier 3 vendor risk scores, SOC 2 report validity, DORA (Digital Operational Resilience Act) compliance, and fourth-party concentration risk analysis.
* **SIEM & SOAR Security Operations Center (SOC):**
  * Ingestion telemetry (24h event volumes), mean time to detect (MTTD), mean time to contain (MTTC), false-positive rates, and SOAR automated playbook execution metrics.
* **Key Risk & Assurance Indicators (KRI / KAR / KPI):**
  * Real-time directional trends, threshold boundary alerts, and executive ownership mapping.
* **Firm-Wide Security Awareness & Phishing Resilience:**
  * Annual mandatory compliance training completion rates by business unit.
  * Phishing simulation click vs. report ratios, delinquent employee escalation queues, and gamified BU security maturity ratings.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies & Standards |
| :--- | :--- |
| **Frontend Framework** | React 18+ with TypeScript & Vite |
| **Styling & Design System** | Tailwind CSS (Executive high-density layout, mathematical padding scales, accessible contrast) |
| **Icons** | Lucide React |
| **Data Visualization & Charts** | Recharts, Custom SVG Data Meshes, Dynamic KPI Progress Bars |
| **State Management** | Local reactive state with real-time simulated telemetry sync & live notifications |
| **Security Standards** | NIST SP 800-207 (Zero Trust), MITRE ATT&CK, CIS Benchmarks, SOC 2, SOX 404, ISO 27001, DORA |

---

## 📂 Project Directory Structure

```text
/
├── README.md                      # Complete system feature documentation (This file)
├── metadata.json                  # Application metadata & platform permissions
├── package.json                   # Dependencies and build scripts
├── index.html                     # HTML5 entry point
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration
└── src/
    ├── main.tsx                   # Application bootstrap entry point
    ├── App.tsx                    # Primary dashboard container, navigation & persona router
    ├── index.css                  # Global Tailwind CSS imports
    ├── types/
    │   └── dashboard.ts           # Core TypeScript types, interfaces, and domains
    ├── data/
    │   └── mockData.ts            # Enterprise dataset (Findings, KRIs, Audits, Tech Debt, Vendors)
    └── components/
        ├── AttackPathsView.tsx     # Graph-based multi-hop attack path visualizer
        ├── BoardroomModal.tsx      # CISO executive boardroom deck presentation generator
        ├── CaasmView.tsx           # Cyber Asset Attack Surface Management inventory
        ├── ItdrView.tsx            # Identity Threat Detection & Response (ITDR) module
        ├── KarKriView.tsx          # Key Risk & Assurance Indicators (KRI/KAR) dashboard
        ├── LiveTelemetryTicker.tsx # Continuous multi-fabric security telemetry stream
        ├── MitreSiemView.tsx       # MITRE ATT&CK technique mapping matrix
        ├── NhiSecretsView.tsx      # Non-Human Identity (NHI) & Machine Secrets governance
        ├── OpenSourceMeshView.tsx  # Open-source dependency & software supply chain mesh
        ├── PostureDetailView.tsx   # Granular vulnerability & domain posture table viewer
        ├── SiemSoarView.tsx        # Security Operations Center (SIEM/SOAR) performance
        ├── SodGovernanceView.tsx   # Segregation of Duties (SoD) conflict manager
        ├── TprmView.tsx            # Third-Party Risk Management (TPRM) & vendor tracker
        ├── TrainingView.tsx        # Security awareness training & phishing simulation analytics
        ├── VulnerabilityView.tsx   # Granular CVE / VAM vulnerability triage table
        └── ZtnaView.tsx            # Zero Trust Network Access & device health attestation
```

---

## ⚡ Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Local Development Server:**
   ```bash
   npm run dev
   ```
   The dev server will launch on `http://localhost:3000`.
3. **Build for Production:**
   ```bash
   npm run build
   ```

---
*Maintained by the Enterprise Information Security & Risk Governance Architecture Team.*
