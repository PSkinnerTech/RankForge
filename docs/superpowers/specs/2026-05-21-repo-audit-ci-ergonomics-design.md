# Repo Audit CI Ergonomics And Task Surfaces

Status: Draft scoping note, not approved implementation spec

## Goal

Make repo audits easier to consume in CI and developer workflows without changing the existing JSON schema incompatibly.

## Candidate Deliverables

- Compact summary.
- GitHub annotations.
- SARIF and JUnit emitters.
- Normalized issue projection combining page findings and repo source findings.
- Additive task/source mapping fields.
- One additional framework fixture.

## Constraints And Risks

- Keep readiness versus measured visibility language honest.
- Do not overfit SARIF or JUnit output to one CI provider.
- Source line numbers are sparse.
- Schema additions must be additive.
- Keep repo source findings separate in normal Markdown reports.

## Next Step

Run a full Superpowers brainstorming/spec pass before implementation.
