/**
 * Database Seed Script
 *
 * Populates the database with initial data from JSON files:
 * - categories.json
 * - questions.json
 * - vendors.json (includes official vendor evaluations)
 *
 * Run with: deno run --allow-read --allow-env --allow-net seed.ts
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Load environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  Deno.exit(1);
}

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🌱 Starting database seeding...\n');

// Load JSON data files
const categoriesData = JSON.parse(
  await Deno.readTextFile('./data/categories.json')
);
const questionsData = JSON.parse(await Deno.readTextFile('./data/questions.json'));
const vendorsData = JSON.parse(await Deno.readTextFile('./data/vendors.json'));

console.log(`📊 Loaded data files:`);
console.log(`   - ${categoriesData.length} categories`);
console.log(`   - ${questionsData.length} questions`);
console.log(`   - ${vendorsData.length} vendors\n`);

// ==============================================================================
// 1. Seed Categories
// ==============================================================================
console.log('📁 Seeding categories...');
const { data: categories, error: categoriesError } = await supabase
  .from('categories')
  .upsert(categoriesData, { onConflict: 'key' })
  .select();

if (categoriesError) {
  console.error('❌ Error seeding categories:', categoriesError);
  Deno.exit(1);
}
console.log(`✅ Seeded ${categories?.length || 0} categories\n`);

// ==============================================================================
// 2. Seed Questions
// ==============================================================================
console.log('❓ Seeding questions...');

// Build category key -> ID mapping
const categoryMap = new Map(categories?.map((c) => [c.key, c.id]) || []);

// Transform questions data to use category_id instead of category_key
const questionsWithCategoryId = questionsData.map((q: any) => {
  const { category_key, key, ...rest } = q;
  const category_id = categoryMap.get(category_key);

  if (!category_id) {
    console.error(`❌ Unknown category key: ${category_key} for question ${key}`);
    Deno.exit(1);
  }

  return {
    key,
    category_id,
    ...rest,
  };
});

const { data: questions, error: questionsError } = await supabase
  .from('questions')
  .upsert(questionsWithCategoryId, { onConflict: 'key' })
  .select();

if (questionsError) {
  console.error('❌ Error seeding questions:', questionsError);
  Deno.exit(1);
}
console.log(`✅ Seeded ${questions?.length || 0} questions\n`);

// ==============================================================================
// 3. Seed Vendors (Official Pre-Analyzed Vendors)
// ==============================================================================
console.log('🏢 Seeding vendors...');

for (const vendor of vendorsData) {
  const { evaluation_data, ...vendorFields } = vendor;

  // Insert vendor
  const { data: insertedVendor, error: vendorError } = await supabase
    .from('vendors')
    .upsert(vendorFields, { onConflict: 'slug' })
    .select()
    .single();

  if (vendorError) {
    console.error(`❌ Error seeding vendor ${vendor.name}:`, vendorError);
    continue;
  }

  console.log(`   ✓ Vendor: ${vendor.name}`);

  // Insert vendor evaluation answers
  if (evaluation_data && insertedVendor) {
    const { answers } = evaluation_data;

    // Build question key -> ID mapping
    const questionMap = new Map(questions?.map((q) => [q.key, q.id]) || []);

    // Transform each answer to database format
    const evaluationRows = answers.map((answer: any) => {
      const question_id = questionMap.get(answer.question_key);

      if (!question_id) {
        console.error(
          `❌ Unknown question key: ${answer.question_key} for vendor ${vendor.name}`
        );
        return null;
      }

      return {
        vendor_id: insertedVendor.id,
        question_id,
        answer: answer.answer,
        evidence_no_bs: answer.notes_no_bs || null,
        evidence_corporate: answer.notes_corporate || null,
      };
    }).filter(Boolean); // Remove nulls

    const { data: insertedEvaluations, error: evaluationError } = await supabase
      .from('vendor_evaluations')
      .upsert(evaluationRows, { onConflict: 'vendor_id,question_id' })
      .select();

    if (evaluationError) {
      console.error(
        `❌ Error seeding evaluation for ${vendor.name}:`,
        evaluationError
      );
    } else {
      console.log(`     ✓ Evaluation with ${evaluationRows.length} answers`);
    }
  }
}

console.log(`\n✅ Seeded ${vendorsData.length} vendors with evaluations\n`);

// ==============================================================================
// Summary
// ==============================================================================
console.log('🎉 Database seeding complete!\n');
console.log('📊 Summary:');
console.log(`   - ${categories?.length || 0} categories`);
console.log(`   - ${questions?.length || 0} questions`);
console.log(`   - ${vendorsData.length} vendors`);
console.log(`   - ${vendorsData.length} vendor evaluations`);
console.log('\n✨ Ready to use!\n');
