# StreamForge Web

Frontend for **StreamForge**, an open-source protocol for transparent contribution tracking and reward streaming.

Built with **Next.js, TypeScript, and TailwindCSS**.

---

## Overview

StreamForge enables open-source communities to:

- Track contributor activity
- Calculate contribution impact
- Stream rewards transparently

This repository contains the **web interface** for interacting with the StreamForge ecosystem.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS

---

## Project Structure

```
src
 ├── app          # Next.js routes and layouts
 ├── components   # Reusable UI components
 ├── features     # Feature-based modules
 ├── hooks        # Custom React hooks
 ├── lib          # Utilities and helpers
 └── styles       # Global styles
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## Contributing

We welcome contributions from developers of all experience levels.

Before contributing:

1. Check existing issues
2. Discuss major changes
3. Follow the project structure

---

## Related Repositories

StreamForge is composed of multiple services:

- `streamforge-web` — frontend interface
- `streamforge-api` — backend service (NestJS)
- `streamforge-contract` — core protocol engine (Rust)

---

## License

MIT