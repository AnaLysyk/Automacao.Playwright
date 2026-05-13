# QA Agent Workflow MVP

## Goal

Implement a safe, versionable agentic QA pipeline for Cidadao Smart flows.

Pipeline:
User Story -> Planner -> Explorer -> Generator -> Runner -> Healer -> Reporter -> Git Approval

## Current Repository Assets

- AGENTS.md with project rules and safety restrictions
- Prompt templates:
  - prompts/base/qa-agent-system.md
  - prompts/planner/planner-template.md
  - prompts/explorer/explorer-template.md
  - prompts/generator/generator-template.md
  - prompts/healer/healer-template.md
  - prompts/reporter/reporter-template.md
  - prompts/git/git-template.md
- Output folders:
  - specs/
  - test-results/exploration/
  - test-results/healing/
  - test-results/reports/

## MVP Scope

1. Accept execution input:
   - product, module, flow, start URL
   - user story, acceptance criteria, known risks
   - safe flags (dry run, no confirm, no cancel, manual CAPTCHA)
2. Run selected stages (planner, explorer, generator, runner, healer, reporter, git)
3. Persist artifacts and status per stage
4. Require explicit approval before commit or push

## Safety Defaults

- Dry run enabled by default
- Final confirmation disabled by default
- Cancellation disabled by default
- CAPTCHA manual by default
- Gmail UI automation forbidden

## Suggested Data Model

qa_agent_runs:
- id
- product
- feature
- flow
- start_url
- status
- dry_run
- created_by
- created_at

qa_agent_steps:
- id
- run_id
- step
- status
- started_at
- finished_at
- logs

qa_agent_artifacts:
- id
- run_id
- type
- file_path
- content
- created_at

qa_agent_findings:
- id
- run_id
- type
- title
- description
- evidence_path
- severity

## First Execution Recommended

1. Planner only for Emissao Online - Captura
2. Approve plan
3. Generator for isolated spec
4. Runner on single spec
5. Reporter summary
