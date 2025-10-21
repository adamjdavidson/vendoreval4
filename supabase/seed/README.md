# Database Seeding

This directory contains seed data and scripts to populate the database with initial content.

## Files

- **`data/categories.json`** - 6 evaluation categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN)
- **`data/questions.json`** - 20 evaluation questions with dual-tone help text
- **`data/vendors.json`** - Pre-analyzed vendor evaluations (e.g., Glean)
- **`seed.ts`** - Deno TypeScript script to load data into Supabase

## Running the Seed Script

### Prerequisites

1. Supabase local environment running (`supabase start`)
2. Deno installed (`brew install deno`)

### Steps

1. Navigate to the seed directory:
   ```bash
   cd supabase/seed
   ```

2. Get your Supabase service role key:
   ```bash
   # Key is displayed when running `supabase start`
   # Or retrieve it from:
   supabase status
   ```

3. Run the seed script:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key deno run --allow-read --allow-env --allow-net seed.ts
   ```

   For local development, you can use the default local key:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU \
   deno run --allow-read --allow-env --allow-net seed.ts
   ```

## What Gets Seeded

- ✅ **6 Categories** - SEE, CHANGE, USE, ADAPT, LEAVE, LEARN with dual-tone content
- ✅ **20 Questions** - All evaluation questions with help text (no-bs and corporate versions)
- ✅ **1 Vendor** - Glean with complete evaluation across all 20 questions
- ✅ **1 Vendor Evaluation** - Pre-analyzed Glean evaluation with category grades

## Verifying Seeded Data

After seeding, verify the data was loaded:

```bash
# Connect to local database
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Check counts
SELECT COUNT(*) FROM categories;  -- Should return 6
SELECT COUNT(*) FROM questions;   -- Should return 20
SELECT COUNT(*) FROM vendors;     -- Should return 1
SELECT COUNT(*) FROM vendor_evaluations; -- Should return 1
```

Or use Supabase REST API:

```bash
# Categories
curl 'http://127.0.0.1:54321/rest/v1/categories?select=*' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"

# Questions
curl 'http://127.0.0.1:54321/rest/v1/questions?select=*' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"

# Vendors with evaluations
curl 'http://127.0.0.1:54321/rest/v1/vendors?select=*,vendor_evaluations(*)' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

## Modifying Seed Data

To add or update seed data:

1. Edit the JSON files in `data/`
2. Run the seed script again - it uses `upsert` so it will update existing records
3. For vendors, the script upserts by `key` field
4. For vendor evaluations, it upserts by `vendor_id` (one evaluation per vendor)

## Resetting the Database

To start fresh:

```bash
# Reset database (drops all data and reapplies migrations)
supabase db reset

# Then re-run seed script
cd supabase/seed
SUPABASE_SERVICE_ROLE_KEY=your-key deno run --allow-read --allow-env --allow-net seed.ts
```

## Notes

- The seed script uses the **service role key** which bypasses Row Level Security (RLS)
- This allows seeding official vendor data and categories that would normally be admin-only
- Never commit your production service role key to version control
- The local default service role key is safe to use in local development
