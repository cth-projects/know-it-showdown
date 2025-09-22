# Know-it Showdown

## Daily Development

Every time you start working on the project:

```bash
bun setup # Installs dependencies, runs migrations, and seeds database
bun dev # Runs the project
```

## First Time Setup

**Prerequisites:**

- [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) - Install and start Docker Desktop
- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [ESLint](vscode:extension/dbaeumer.vscode-eslint) and [Prettier](vscode:extension/esbenp.prettier-vscode) VS Code extensions

**Initial Setup:**

1. Install and start Docker Desktop
2. Run `./start-database.sh` to start the database
3. Run `bun setup` to install dependencies, run migrations, and seed the database

## Useful Commands

- `bun db:studio` - Open Prisma Studio to visually browse the database
- `bun db:seed` - Reseed database with sample data (safe to run multiple times)
- `bun db:migrate` - Run database migrations
- `bun db:generate` - Generate Prisma client after schema changes

## VS Code Extensions

**Recommended:**

- [ES7+ React/Redux/React-Native snippets](vscode:extension/dsznajder.es7-react-js-snippets) - React code snippets
- [Tailwind CSS IntelliSense](vscode:extension/bradlc.vscode-tailwindcss) - Tailwind autocomplete
- [Prisma](vscode:extension/Prisma.prisma) - Prisma schema support

## Tech Stack

This project uses the [T3 Stack](https://create.t3.gg/) with:

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - Type-safe APIs
- [NextAuth.js](https://next-auth.js.org) - Authentication

**Learn more:** [T3 Stack Documentation](https://create.t3.gg/) | [T3 Discord](https://t3.gg/discord)
