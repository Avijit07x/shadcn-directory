<div align="center">
  <img src="./app/icon.svg" width="120" alt="Shadcn Directory Logo" />
  <h1>SHADCN // DIRECTORY.</h1>
  <p>An open-source, definitive catalog of premium components, templates, and UI kits crafted for modern web experiences.</p>

  <img src="./public/opengraph-image.svg" alt="Shadcn Directory Preview" style="max-width: 100%; border-radius: 8px;" />
</div>

## Overview

**ShadCN Directory** is a beautifully designed, high-performance web directory product engineered for discovering and sharing the best UI components, templates, and boilerplates built around the `shadcn/ui` ecosystem.

Designed with a strict, monochrome **Swiss Minimalist aesthetic**, it operates as a turn-key platform for developers to find premium building blocks for their next product, while also serving as a robust, scalable codebase that can be deployed as-is or customized for your own directory needs.

## Product Features

- **Curated Archives**: Browse a growing list of ShadCN resources with automatic OpenGraph metadata extraction.
- **Minimalist Aesthetic**: Sharp, editorial, and brutalist monochrome UI with carefully composed typography.
- **Authentication**: Secure Google OAuth integration via NextAuth.
- **Admin Dashboard**: Comprehensive moderation panel with metrics, tabbed filtering, and powerful **Bulk Selection Actions** (Approve, Reject, Delete).
- **User Profile**: A dedicated `/profile` section for users to manage their submissions and track status.
- **Rate Limiting**: Built-in API rate-limiting to protect server actions and prevent spam.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) & Mongoose
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Quick Start Guide

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### 1. Clone & Install

```bash
git clone https://github.com/avijit07x/shadcn-directory.git
cd shadcn-directory
pnpm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_random_string

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Access
# Comma-separated list of emails that should have admin access
ADMIN_EMAILS=admin@example.com,moderator@example.com
```

### 3. Launch Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`.

## Architecture & Structure

- `app/`: Next.js App Router pages (Home, Admin, User Profiles, API routes).
- `components/`: Reusable React components including the `DirectoryGrid` and `AdminTable`.
- `lib/`: Core utilities (MongoDB connection, Rate Limiting, OpenGraph Scraper).
- `models/`: Mongoose Database Models.
- `public/`: Static graphical assets like the OpenGraph preview image.

## Open Source License

This product is open-source and available under the [MIT License](LICENSE). Contributions, feature requests, and bug reports are welcome as we scale the product.
