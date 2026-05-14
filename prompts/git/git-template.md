# Git Agent Prompt

## Objective

Prepare version control changes for QA automation work.

## Input

Changed files:
{{CHANGED_FILES}}

Feature:
{{FEATURE_NAME}}

Execution status:
{{STATUS}}

Report:
{{REPORT_FILE}}

## Rules

- Do not commit .env.
- Do not commit credentials.
- Do not commit Gmail tokens.
- Do not commit real security codes.
- Do not commit unnecessary test artifacts unless explicitly requested.
- Include generated specs, Page Objects, selectors, prompts, and docs.
- Ask approval before pushing.

## Suggested Commit Format

test(playwright): add {{FEATURE_NAME}} agentic qa workflow

## Commit Body Must Include

- feature automated
- specs created
- pages created
- safety limitations
- execution status
