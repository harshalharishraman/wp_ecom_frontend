# Graph Report - .  (2026-09-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 56 nodes · 54 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ef9048c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- frontend/package.json
- package.json
- .oxlintrc.json
- plugins
- dependencies
- repository
- bugs
- scripts

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `plugins` - 3 edges
3. `react` - 3 edges
4. `rules` - 3 edges
5. `repository` - 3 edges
6. `react/only-export-components` - 2 edges
7. `react` - 2 edges
8. `react-dom` - 2 edges
9. `@types/react` - 2 edges
10. `@types/react-dom` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 2 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, oxlint, @types/react (+3 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 2 - "package.json"
Cohesion: 0.20
Nodes (9): author, description, homepage, keywords, license, main, name, type (+1 more)

### Community 3 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 4 - "plugins"
Cohesion: 0.47
Nodes (4): plugins, App(), oxc, react

### Community 5 - "dependencies"
Cohesion: 0.40
Nodes (5): dependencies, react, react-dom, react, react-dom

### Community 6 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **32 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._