// Supabase Edge Function: Generate AI-powered report content using Claude API
// Feature: 003-ai-report-generation
// Feature: 004-analytical-report-format (synthesis)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk@0.27.0';
import { NO_BS_SYSTEM_PROMPT, buildNoBSPrompt, buildNoBSSynthesisPrompt } from './prompts/no-bs.ts';
import { CORPORATE_SYSTEM_PROMPT, buildCorporatePrompt, buildCorporateSynthesisPrompt } from './prompts/corporate.ts';

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
    const {
      vendorName,
      categoryAnalyses,
      researchFindings,
      voiceMode,
      userNotes,
      evaluationDate,
      completionStatus,
      requestType = 'synthesis' // 'synthesis' (new) or 'category' (legacy)
    } = await req.json();

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

    // Select system prompt based on voice mode
    const systemPrompt = voiceMode === 'no-bs' ? NO_BS_SYSTEM_PROMPT : CORPORATE_SYSTEM_PROMPT;

    // Build user prompt based on request type
    let userPrompt: string;
    if (requestType === 'synthesis') {
      // New analytical format: Cons/Pros/Extended synthesis
      const synthesisBuilder = voiceMode === 'no-bs' ? buildNoBSSynthesisPrompt : buildCorporateSynthesisPrompt;
      userPrompt = synthesisBuilder(
        vendorName,
        evaluationDate || new Date().toISOString().split('T')[0],
        completionStatus || '20/20 questions answered (100%)',
        categoryAnalyses,
        researchFindings || [],
        userNotes || {}
      );
    } else {
      // Legacy format: Category analyses only
      const promptBuilder = voiceMode === 'no-bs' ? buildNoBSPrompt : buildCorporatePrompt;
      userPrompt = promptBuilder(vendorName, categoryAnalyses, researchFindings || []);
    }

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

    // Return generated content (format depends on request type)
    if (requestType === 'synthesis') {
      // New format with Cons/Pros/Extended
      return new Response(
        JSON.stringify({
          headline: parsedReport.headline,
          cons: parsedReport.cons || parsedReport.considerations || '', // Support both voice modes
          pros: parsedReport.pros || parsedReport.strengths || '', // Support both voice modes
          extended: parsedReport.extended || parsedReport.analysis || '', // Support both voice modes
          categoryAnalyses: categoryAnalyses, // Pass through existing category analyses
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Legacy format
      return new Response(
        JSON.stringify({
          headline: parsedReport.headline,
          categoryAnalyses: parsedReport.categoryAnalyses,
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
