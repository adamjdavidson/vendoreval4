# VendorEval3: AI Vendor Evaluation Framework

A systematic framework for Fortune 500 executives to evaluate AI vendors across 6 critical dimensions.

## Project Overview

VendorEval3 provides:
- **Interactive Evaluation Tool**: 20-question assessment with real-time scoring
- **Documentation Site**: Comprehensive framework explanation
- **Dual Voice Modes**: Direct (candid) and Suitable for Work (professional)
- **Professional Reports**: PDF and Markdown exports

## Quick Start

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url> vendoreval3
   cd vendoreval3
   ```

2. **Install dependencies for evaluation tool**
   ```bash
   cd apps/evaluation-tool
   npm install
   ```

3. **Install dependencies for docs**
   ```bash
   cd ../docs
   npm install
   ```

### Running the Applications

#### Evaluation Tool (React + Vite)

```bash
cd apps/evaluation-tool
npm run dev
```

Visit: http://localhost:5173

#### Documentation Site (Docusaurus)

```bash
cd apps/docs
npm start
```

Visit: http://localhost:3000

## Project Structure

```
vendoreval3/
├── apps/
│   ├── evaluation-tool/    # React 19 + Vite 6 interactive app
│   └── docs/               # Docusaurus 3 documentation site
├── shared/                 # Shared TypeScript types
│   └── types/
│       └── index.ts        # Core type definitions
├── specs/                  # SpecKit specifications
│   └── 001-ai-vendor-evaluation/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Implementation plan
│       ├── tasks.md        # Task breakdown
│       └── contracts/      # Type contracts
├── .specify/               # SpecKit configuration
├── .beads/                 # Beads issue tracking
└── README.md               # This file
```

## Development Workflow

This project uses **Spec-Driven Development** with **Beads** for issue tracking.

### Check Ready Work

```bash
bd ready --json
```

### View Project Stats

```bash
bd stats
```

### Run Tests

```bash
cd apps/evaluation-tool
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Build for Production

```bash
# Evaluation tool
cd apps/evaluation-tool
npm run build

# Documentation
cd apps/docs
npm run build
```

## Technology Stack

### Evaluation Tool
- **React 19**: Latest React with concurrent features
- **Vite 6**: Fast build tool with HMR
- **TypeScript**: Strict mode enabled
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Vitest + React Testing Library**: Testing framework

### Documentation
- **Docusaurus 3**: Static site generator
- **React 19**: Component framework
- **TypeScript**: Type safety

## Key Features

### 6-Dimension Evaluation Framework
1. **SEE**: Can you see how it works? (transparency)
2. **CHANGE**: Can you control it? (configurability)
3. **USE**: Is it actually useful? (output quality)
4. **ADAPT**: Can it evolve? (future-proofing)
5. **LEAVE**: Can you exit? (no vendor lock-in)
6. **LEARN**: Does it build capability? (skills transfer)

### Dual Voice Modes
- **Direct Mode**: Candid, cuts through marketing BS
- **Suitable for Work**: Professional, politically safe

### Client-Side Only
- No backend required
- LocalStorage persistence
- Works offline
- Privacy-focused

## Contributing

See [CLAUDE.md](./claude.md) for:
- Development guidelines
- SpecKit workflow
- Beads usage
- Code standards

## Documentation

- **Project Constitution**: `.specify/memory/constitution.md`
- **Specification**: `specs/001-ai-vendor-evaluation/spec.md`
- **Implementation Plan**: `specs/001-ai-vendor-evaluation/plan.md`
- **Developer Guide**: `specs/001-ai-vendor-evaluation/quickstart.md`

## Support

For issues or questions:
1. Check `bd list` for tracked issues
2. Review documentation in `apps/docs`
3. See developer quickstart in `specs/001-ai-vendor-evaluation/quickstart.md`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-19
**Status**: In Development (Phase 1 Setup Complete)
