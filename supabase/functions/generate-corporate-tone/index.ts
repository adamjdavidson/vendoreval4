// Edge Function: generate-corporate-tone
// Generates corporate-friendly version from no-bs content using Claude API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TONE_CONVERSION_PROMPT = `You are a professional tone translator. Convert the following "No BS" documentation content into a "Corporate Friendly" version.

Rules:
1. Preserve all technical meaning and accuracy
2. Replace informal language with professional equivalents
3. Soften direct/blunt statements while maintaining honesty
4. Keep structure and formatting (Markdown) identical
5. Maintain all links, code examples, and technical details

Example transformations:
- "This is broken and won't work" → "This approach has known limitations"
- "Don't be an idiot" → "Please exercise caution"
- "Magic black box" → "Proprietary system with limited transparency"
- "BS" → "marketing content" or "unsubstantiated claims"
- "Cut through the crap" → "Focus on essential information"

Convert the following content:`;

serve(async (req) => {
  try {
    // 1. Verify request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Get Supabase client for auth verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // 3. Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Verify user is admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .is('revoked_at', null)
      .single();

    if (adminError || !adminData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Extract no-bs content from request
    const { noBsContent } = await req.json();

    if (!noBsContent || typeof noBsContent !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid noBsContent field' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Call Claude API
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: TONE_CONVERSION_PROMPT,
        messages: [
          {
            role: 'user',
            content: noBsContent,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate corporate tone' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const claudeData = await claudeResponse.json();
    const corporateContent = claudeData.content[0].text;

    // 7. Return corporate version
    return new Response(
      JSON.stringify({ corporateContent }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-corporate-tone:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
