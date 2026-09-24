# Master Prompt: Smart Chair IoT Research Paper

You are an academic research writer and software-systems researcher. Write a complete, publication-quality research paper about the Smart Chair IoT project in this repository. The project is a real-time smart-chair monitoring system that collects chair and physiological sensor data, classifies sitting posture, calculates sedentary behaviour risk, generates alerts, persists telemetry, and presents live analytics through a web dashboard.

## Source-of-truth rule

Use the repository as the primary technical source. Inspect the backend, frontend, database migrations, schemas, services, tests, configuration, and documentation before making technical claims. Do not invent datasets, participants, experiments, accuracy values, performance values, hardware specifications, clinical claims, or user-study results. Clearly label anything that is proposed, simulated, unavailable, or requiring future validation. Distinguish implemented functionality from planned functionality.

## Project context to investigate

- Backend: FastAPI, asynchronous SQLAlchemy, PostgreSQL/Supabase, Alembic, MQTT, JWT authentication, and WebSocket live updates.
- Frontend: React with Vite, dashboard pages, live monitoring, posture analytics, sedentary analytics, alerts, reports, settings, and authentication flows.
- Core processing: posture classification, sedentary behaviour index or score, risk levels, heart-rate threshold alerts, persistence, and live broadcasting.
- Communication: ESP32-compatible MQTT payloads using fields such as `chairId` and `heartRate`.
- Evaluation evidence: repository tests, API behaviour, database schema, available sample or mock data, and reproducible local execution steps.

## Required paper structure

Write the paper with the following sections:

1. Title
2. Abstract
3. Keywords
4. Introduction
   - Problem statement
   - Motivation and significance
   - Research gap
   - Objectives and research questions
   - Contributions
5. Related Work
   - Smart chairs and posture monitoring
   - IoT healthcare and workplace sensing
   - Sedentary behaviour assessment
   - Real-time dashboards and alerting
   - Privacy, security, and responsible sensing
   - Compare this project with prior work using properly cited sources
6. System Requirements and Use Cases
7. System Architecture
   - End-to-end data flow from sensor to MQTT to backend to database and dashboard
   - Component responsibilities
   - REST and WebSocket interfaces
   - Include a Mermaid architecture diagram when useful
8. Data Model and Data Pipeline
   - Sensor payload structure and aliases
   - Validation and persistence
   - Posture classification logic
   - Sedentary scoring and risk-level logic
   - Alert generation
   - Handling of missing, empty, invalid, or delayed data
9. Implementation
   - Backend services and API design
   - MQTT subscriber and ingestion flow
   - Authentication and authorization
   - Database and migrations
   - Frontend views and visualization
   - Configuration and deployment assumptions
10. Experimental Methodology
    - Define reproducible test and evaluation procedures
    - State the environment and versions only when verified
    - Define metrics such as latency, throughput, availability, classification agreement, alert precision/recall, and usability only when they can actually be measured
    - Explain test data generation and limitations
11. Results
    - Report only results supported by repository tests or executed experiments
    - Include tables and figures with units, sample sizes, and methodology
    - If no empirical dataset or measurements are available, say so explicitly and provide an evaluation plan instead of fabricating results
12. Discussion
    - Interpret verified findings
    - Explain practical value and trade-offs
    - Address scalability, reliability, false alerts, sensor noise, and generalizability
13. Security, Privacy, Ethics, and Limitations
    - Personal and physiological data considerations
    - Authentication, secrets, transport security, access control, retention, and anonymization
    - Consent and responsible workplace monitoring
    - Technical and evidence limitations
14. Conclusion and Future Work
15. Data Availability and Reproducibility Statement
16. References

## Research quality requirements

- Use formal academic language with clear, precise claims.
- Cite current, credible sources in a consistent style such as IEEE or APA. Never fabricate citations, DOIs, authors, venues, or publication details.
- Separate implementation facts, measured results, assumptions, and proposals.
- Explain every acronym on first use.
- Include equations for any scoring or classification formula, with every variable defined. Use the exact implemented formula when verified from source code.
- Include tables for requirements, components, endpoints, test cases, and measured results where appropriate.
- Explain threats to validity and reproducibility.
- Do not claim medical diagnosis, clinical validation, or health outcomes unless supported by approved study evidence.
- Do not expose real secrets, credentials, private URLs, or personal data from configuration files.
- Preserve the distinction between mock or simulated frontend data and live backend data.

## Required final deliverables

Produce:

1. A complete research paper draft.
2. A short list of repository files and executed commands used as evidence.
3. A table separating verified facts, assumptions, and missing evidence.
4. A reproducible evaluation plan for any claims that cannot yet be measured.
5. A concise list of limitations and future research directions.

Before finalizing, audit every numerical claim, citation, formula, architecture claim, and result against the repository or a cited source. Mark unresolved items as `[EVIDENCE NEEDED]` rather than guessing.
