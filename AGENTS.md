# AGENTS.md

This repository contains an unofficial Stanford CS336 study guide for software engineers who may have no prior AI or machine-learning background.

These instructions apply to the entire repository. Follow them for every AI-assisted change unless the user explicitly gives a conflicting instruction.

## Project goals

Optimize every change for these priorities, in order:

1. Conceptual correctness and faithful representation of the current CS336 materials.
2. A gentle learning path for experienced software engineers with no AI background.
3. Accessibility, including readers with dyslexia, attention limitations, low vision, or keyboard-only navigation.
4. Easy long-term maintenance by a small number of contributors.
5. Static deployment to GitHub Pages.

Do not optimize for visual novelty, content volume, or sounding academically sophisticated.

## Required reading before content work

Before creating or substantially editing study-note content, read:

- `src/content/docs/meta/writing-guide.md`
- `src/content/docs/meta/note-template.mdx`
- The existing pages immediately before and after the page being changed
- The relevant official CS336 lecture, source file, handout, or assignment page

Before changing layout or components, also read:

- `astro.config.mjs`
- `src/styles/custom.css`
- The affected component files in `src/components/`

Do not rely on memory for current course schedules, assignments, policies, library APIs, or deployment instructions. Verify unstable facts against primary sources.

## Sources and factual accuracy

- Prefer the current official course site: `https://cs336.stanford.edu/`.
- Prefer official `stanford-cs336` GitHub repositories, lecture source files, assignment handouts, and primary research papers.
- Clearly distinguish official course content from this repository's explanation, analogy, inference, or experiment.
- Add links to the original material near claims that readers may want to verify.
- Include the course offering or date last checked at the end of a completed lecture note.
- Never copy large passages from course materials, papers, books, or articles. Paraphrase and attribute.
- If a detail cannot be verified, state the uncertainty or omit it. Do not invent missing lecture content.

## Honor code and assignment boundaries

- Treat official assignment repositories, handouts, tests, and policies as authoritative.
- Explain concepts, interfaces, invariants, debugging strategies, small independent examples, and test design.
- Do not provide a complete submission-ready solution to a current CS336 assignment.
- Do not copy third-party assignment solutions into this repository.
- Mark pseudocode and intentionally incomplete examples clearly.
- Prefer examples that use different toy inputs or reduced problems rather than mirroring graded tasks exactly.
- When discussing an assignment, remind readers to follow the current course AI policy and honor code.

## Audience assumptions

Assume the reader:

- Can program in Python and understands common software-engineering concepts.
- May not know machine learning, deep learning, PyTorch, probability, linear algebra, GPUs, or research terminology.
- May be reading in a second language.
- May need to pause frequently or read sections out of order.

Do not use “obvious,” “trivial,” “simply,” or “just” for concepts that are new to this audience.

## Required lecture-note structure

Substantial lecture notes should normally include:

1. Official-material notice and source links
2. Learning outcomes
3. The topic's position in the end-to-end language-model pipeline
4. Motivation: what problem is being solved
5. A software-engineering mental model, including where the analogy breaks
6. Precise definitions, inputs, outputs, and tensor shapes where relevant
7. A minimal worked example
8. Engineering trade-offs and resource costs
9. Common misconceptions or failure modes
10. Small experiments that can run on CPU when possible
11. Layered comprehension checks
12. Connection to the relevant assignment without providing its solution
13. Summary and official references

Use the existing template rather than inventing a new structure for each page.

## Progressive disclosure

- Start each long page with what the reader should learn and how to read the page.
- Put the mental model before detailed derivations.
- Separate first-pass knowledge from second-pass details.
- Keep one main idea per paragraph.
- Prefer short sections with descriptive headings over long uninterrupted prose.
- For long pages, keep the right-hand table of contents shallow, normally headings level 2 only.
- Provide optional details using callouts or native `<details>` when hiding them does not block the main learning path.
- Never hide essential instructions or safety information behind expandable controls.

## Terminology

- Keep the English term because code, papers, and error messages use English.
- Explain a new term at its first meaningful occurrence.
- In MDX, use `src/components/Term.astro` for short, interrupt-free definitions when helpful.
- Add important recurring terms to `src/content/docs/reference/glossary.md`.
- A definition should first answer “what is it?” and “why is it needed?”
- Do not introduce more than three unexplained technical terms in one paragraph.
- Spell out an abbreviation before first use, for example Byte Pair Encoding (BPE).

## Mathematics and notation

- Explain the purpose and inputs of a formula before showing it.
- Define every symbol close to its first use.
- State shapes for vectors, matrices, and tensors.
- Prefer a small numeric example after an abstract equation.
- Use `$...$` and `$$...$$` for math; KaTeX support is configured globally.
- Do not use a formula when plain language or a small table is clearer.
- Keep notation consistent with `src/content/docs/reference/notation.md`.

## Code examples

- Keep examples small enough to understand without scrolling through a long function.
- State expected inputs, outputs, shapes, dtype, and device where relevant.
- Show the correctness-first version before discussing optimization.
- Explain the invariant or failure mode demonstrated by each example.
- Prefer deterministic examples with fixed toy inputs.
- Do not add a dependency when a small standard-library example is sufficient.
- Do not present unexecuted code as tested. Run relevant examples or label them as pseudocode.
- Avoid lines so long that mobile readers must scroll horizontally unnecessarily.

## Accessibility

- Preserve semantic heading order; do not skip heading levels for visual styling.
- Use descriptive link text, never “click here.”
- Do not communicate meaning through color alone.
- Do not remove keyboard focus indicators.
- Respect `prefers-reduced-motion`; never make animation the only explanation.
- Maintain readable contrast in both light and dark themes.
- Write paragraphs of roughly 2–5 sentences when possible.
- Use tables only for actual comparisons or mappings, not general page layout.
- Ensure pages remain usable at 200% zoom and at 320px width.
- Interactive elements must work with keyboard and touch, and require an accessible name.
- Do not override Starlight accessibility primitives without a concrete, tested reason.

## Teaching diagrams and images

- Add a visual only when it materially reduces the effort needed to understand a relationship, sequence, shape change, comparison, or system boundary.
- Do not add decorative stock images to technical pages.
- Prefer repository-native SVG for architecture, flow, and comparison diagrams.
- Store reusable diagrams in `src/assets/diagrams/` using lowercase kebab-case names.
- Every informational image needs meaningful alt text and a nearby `figcaption`.
- SVG files must include `<title>` and `<desc>`.
- Pair colors with labels, shapes, or line styles.
- Keep diagram text large and concise.
- If a horizontal diagram becomes unreadable at 320–390px, create a vertical mobile variant and switch with `<picture>` at `40rem`.
- The surrounding prose must communicate the diagram's core conclusion for readers who cannot see it.
- When the facts, shapes, or terminology change, update both the diagram source and the surrounding prose.

## Routing and information architecture

Keep content in the existing sections:

- `start-here/`: onboarding, routes, and environment setup
- `foundations/`: prerequisites for readers new to AI
- `lessons/`: lecture notes in official course order
- `assignments/`: dependency maps and non-solution guidance
- `reference/`: glossary and notation lookup
- `meta/`: authoring and maintenance documentation

- Keep URLs descriptive and stable.
- Register new pages in `astro.config.mjs` when they belong in the sidebar.
- Do not create deep route nesting without a clear reader benefit.
- Check all links with the configured GitHub Pages base path.
- Prefer site-relative or Astro-resolved asset paths; do not assume deployment at `/`.

## Maintainability

- Content should remain Markdown or MDX unless a reusable component is clearly justified.
- Prefer existing Starlight components and styles over creating custom UI.
- Keep custom components small, accessible, and content-agnostic.
- Avoid client-side JavaScript for behavior that HTML or CSS can express reliably.
- Do not add a framework or runtime service to a static content feature.
- Pin important production dependencies consistently with the existing package policy.
- Update `README.md`, the writing guide, or the note template when a change creates a new authoring convention.
- Avoid one-off CSS selectors tied to a single paragraph or page.

## GitHub Pages and build constraints

- The site must remain statically buildable.
- Preserve `site` and `base` behavior in `astro.config.mjs` unless deployment requirements change.
- Internal links, favicons, imported images, glossary links, and generated assets must work under `/stanford-cs336-study-notes/`.
- Do not add server-only routes or secrets.
- Keep the deployment workflow compatible with the repository's `main` branch and GitHub Pages environment.

## Required validation

Run validation proportional to the change. For any content, layout, dependency, or configuration change, run at minimum:

```bash
npm run build
```

The expected result is:

- Astro check reports 0 errors and 0 warnings.
- All static routes build.
- Pagefind search indexing completes.
- No deprecated configuration warnings are introduced.

Also perform the applicable checks:

- Inspect the changed page in a browser.
- Check both desktop and approximately 390px mobile widths for layout changes.
- Verify no horizontal page overflow.
- Verify math renders with KaTeX when formulas changed.
- Verify `alt`, `figcaption`, SVG `<title>`, and SVG `<desc>` when images changed.
- Test keyboard focus and activation when interaction changed.
- Confirm new internal links include the GitHub Pages base path in built HTML.
- Run `git diff --check` before handoff.

Do not claim a check passed unless it was actually run.

## Scope and repository safety

- Preserve unrelated user changes in a dirty worktree.
- Do not rewrite, delete, or revert work outside the requested scope.
- Do not use destructive Git commands.
- Do not commit, push, deploy, or change repository settings unless the user explicitly requests it.
- Before adding a large dependency or changing the site architecture, explain the maintenance cost.

## Handoff checklist

When finishing a substantial change, report concisely:

- What reader-facing outcome changed
- Which important files changed
- Which official source/version was used
- What validation was run and its result
- Whether the change is only local or has been committed/pushed/deployed

Do not make the user infer whether the live GitHub Pages site contains the latest local changes.
