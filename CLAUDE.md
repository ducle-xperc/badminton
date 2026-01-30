# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Badminton tournament web application built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Uses Bun as the package manager.

## Commands

```bash
# Development
bun dev              # Start dev server (http://localhost:3000)

# Build & Production
bun build            # Build for production
bun start            # Start production server

# Linting
bun lint             # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router (React Server Components by default)
- **React 19** (latest)
- **Tailwind CSS v4** using `@import "tailwindcss"` syntax in globals.css
- **TypeScript** with strict mode, path alias `@/*` → `./src/*`

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `types/` - TypeScript definitions (auto-generated route types, cache lifecycle types)
- `public/` - Static assets
- `home.html` - Standalone UI mockup for badminton tournament (to be integrated)

### Styling
- Tailwind v4 with CSS variables for theming (`--background`, `--foreground`)
- Geist font family (sans and mono) loaded via Next.js local fonts
- Dark mode support via `prefers-color-scheme`

## Current State

The project contains:
1. Default Next.js App Router setup in `src/app/`
2. A complete badminton tournament UI prototype in `home.html` that needs integration into the Next.js app

The `home.html` file contains the "XPERC Badminton World Cup" design with tournament schedules, location info, and custom styling that should be the reference for the application's visual design.
