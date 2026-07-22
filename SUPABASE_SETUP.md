# Supabase Integration & Database Setup Guide

This guide explains how the Repository Abstraction operates and how to provision Supabase for production deployments on Vercel.

---

## 🗄️ 1. Database SQL Schema

Copy and run the following SQL script inside your Supabase **SQL Editor**:

```sql
-- Create investigations table for storing report JSON objects
create table if not exists investigations (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table investigations enable row level security;

-- Policy: Allow service role and anon full read/write access (adjust for multi-tenant auth as needed)
create policy "Allow full access for service role"
  on investigations
  for all
  using (true)
  with check (true);
```

---

## 🔑 2. Environment Variables Setup

Add the following environment variables to your `.env.local` locally and to your **Vercel Project Settings > Environment Variables**:

```env
# OpenRouter API Key for AI Model Batch Execution
OPENROUTER_KEY=your_openrouter_api_key_here

# Supabase Credentials (Required for Vercel Production Persistence)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

---

## 🏗️ 3. Repository Abstraction Architecture

The application persistence layer is completely decoupled from business logic via the `IInvestigationRepository` interface (`src/lib/repositories/IInvestigationRepository.ts`).

The Factory (`src/lib/repositories/index.ts`) automatically selects the storage backend based on environment:

1. **`SupabaseInvestigationRepository`**: Used when `NEXT_PUBLIC_SUPABASE_URL` and keys are present.
2. **`FileInvestigationRepository`**: Used in local offline development (`data/investigation.json`).
3. **`InMemoryInvestigationRepository`**: Fallback mode for Vercel preview builds if database credentials are not yet configured (prevents read-only filesystem crash).
