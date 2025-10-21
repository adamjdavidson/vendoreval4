#!/usr/bin/env tsx
/**
 * Generate TypeScript types from Supabase schema
 * 
 * Usage: npm run generate-types
 * 
 * This script runs: supabase gen types typescript --local > apps/evaluation-tool/src/types/database.ts
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

const outputPath = resolve(__dirname, '../apps/evaluation-tool/src/types/database.ts');

try {
  console.log('Generating TypeScript types from Supabase schema...');
  
  execSync(`supabase gen types typescript --local > ${outputPath}`, {
    stdio: 'inherit',
    cwd: resolve(__dirname, '..'),
  });
  
  console.log(`✓ Types generated successfully at: ${outputPath}`);
} catch (error) {
  console.error('✗ Failed to generate types:', error);
  process.exit(1);
}
