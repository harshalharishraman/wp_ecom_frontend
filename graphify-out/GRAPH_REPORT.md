# Graph Report - wp_ecom_frotnend  (2026-09-14)

## Corpus Check
- 46 files · ~16,211 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 228 nodes · 241 edges · 32 communities (28 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da746ae8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- frontend/package.json
- package.json
- Components
- Home.jsx
- What You Must Do When Invoked
- api.js
- Customer pages
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Admin pages
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- E-Commerce Frontend
- App.jsx

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 12 edges
2. `E-Commerce Frontend` - 12 edges
3. `/graphify` - 10 edges
4. `Components` - 9 edges
5. `Customer pages` - 9 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `Application control flow` - 6 edges
8. `Admin pages` - 6 edges
9. `Service files` - 6 edges
10. `react` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  frontend/src/components/Navbar.jsx → frontend/src/context/CartContext.jsx

## Import Cycles
- None detected.

## Communities (32 total, 4 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, oxlint, @types/react (+3 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.11
Nodes (18): axios, dependencies, axios, react, react-dom, react-router-dom, name, private (+10 more)

### Community 2 - "package.json"
Cohesion: 0.12
Nodes (16): author, bugs, url, description, homepage, keywords, license, main (+8 more)

### Community 3 - "Components"
Cohesion: 0.22
Nodes (9): Components, `src/components/CategoryCard.jsx`, `src/components/Footer.jsx`, `src/components/Loading.jsx`, `src/components/Navbar.jsx`, `src/components/ProductCard.jsx`, `src/components/ProductGrid.jsx`, `src/components/ProtectedRoute.jsx` (+1 more)

### Community 4 - "Home.jsx"
Cohesion: 0.11
Nodes (18): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, Footer(), Navbar(), CartContext (+10 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 6 - "api.js"
Cohesion: 0.24
Nodes (9): AuthContext, AuthProvider(), adminApi, api, apiError(), responseData(), storage, waiting (+1 more)

### Community 7 - "Customer pages"
Cohesion: 0.22
Nodes (9): Customer pages, `src/pages/Cart.jsx`, `src/pages/Checkout.jsx`, `src/pages/Home.jsx`, `src/pages/Login.jsx`, `src/pages/ProductDetails.jsx`, `src/pages/Products.jsx`, `src/pages/Profile.jsx` (+1 more)

### Community 8 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 10 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 11 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 12 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 13 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 14 - "Admin pages"
Cohesion: 0.33
Nodes (6): Admin pages, `src/pages/admin/AdminLogin.jsx`, `src/pages/admin/Categories.jsx`, `src/pages/admin/Dashboard.jsx`, `src/pages/admin/Products.jsx`, `src/pages/admin/Subcategories.jsx`

### Community 19 - "E-Commerce Frontend"
Cohesion: 0.08
Nodes (25): 1. Browser startup, 2. Routing, 3. Authentication flow, 4. Catalog flow, 5. Cart and checkout flow, Application control flow, Backend contract, Context files (+17 more)

### Community 33 - "App.jsx"
Cohesion: 0.18
Nodes (8): App(), Cart(), Checkout(), Login(), ProductDetails(), Products(), Profile(), Register()

## Knowledge Gaps
- **123 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `E-Commerce Frontend` connect `E-Commerce Frontend` to `Components`, `Admin pages`, `Customer pages`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `react` connect `Home.jsx` to `App.jsx`, `api.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Components` connect `Components` to `E-Commerce Frontend`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Home.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._