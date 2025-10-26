// Supabase Edge Function: Generate AI-powered report content using Claude API
// Feature: 003-ai-report-generation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk@0.27.0';
import { NO_BS_SYSTEM_PROMPT, buildNoBSPrompt } from './prompts/no-bs.ts';
import { CORPORATE_SYSTEM_PROMPT, buildCorporatePrompt } from './prompts/corporate.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { vendorName, categoryAnalyses, researchFindings, voiceMode } = await req.json();

    // Validate required fields
    if (!vendorName || !categoryAnalyses || !voiceMode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: vendorName, categoryAnalyses, voiceMode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Anthropic client
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Select voice mode prompts
    const systemPrompt = voiceMode === 'no-bs' ? NO_BS_SYSTEM_PROMPT : CORPORATE_SYSTEM_PROMPT;
    const promptBuilder = voiceMode === 'no-bs' ? buildNoBSPrompt : buildCorporatePrompt;

    // Construct prompt
    const userPrompt = promptBuilder(vendorName, categoryAnalyses, researchFindings || []);

    // Call Claude API with prompt caching
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }  // Cache system prompt for 5 minutes
        }
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Parse Claude's response (strip markdown code fences if present)
    let content = message.content[0].text;

    // Remove markdown code fences if Claude wrapped the JSON
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (content.includes('```')) {
      content = content.replace(/```\n?/g, '').trim();
    }

    const parsedReport = JSON.parse(content);

    // Return generated content
    return new Response(
      JSON.stringify({
        headline: parsedReport.headline,
        categoryAnalyses: parsedReport.categoryAnalyses,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
