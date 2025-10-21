/**
 * Check Discord Membership Edge Function
 *
 * Verifies if a user is a member of the configured Discord guild
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache for membership checks (24h TTL)
const membershipCache = new Map<string, { isMember: boolean; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting: track requests per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 50; // 50 requests
const RATE_LIMIT_WINDOW_MS = 1000; // per second

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN');
    const DISCORD_GUILD_ID = Deno.env.get('DISCORD_GUILD_ID');

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      throw new Error('Missing required environment variables');
    }

    // Parse request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(userId);

    if (userRateLimit) {
      if (now > userRateLimit.resetTime) {
        // Reset window
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else if (userRateLimit.count >= RATE_LIMIT_MAX) {
        // Rate limit exceeded
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Increment count
        userRateLimit.count++;
      }
    } else {
      // First request for this user
      rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // Check cache
    const cached = membershipCache.get(userId);
    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
      return new Response(
        JSON.stringify({ isMember: cached.isMember, guildId: cached.isMember ? DISCORD_GUILD_ID : null, cached: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's Discord ID from Supabase auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Extract Discord ID from user metadata
    const discordId = user.user?.identities?.find(
      (identity) => identity.provider === 'discord'
    )?.id;

    if (!discordId) {
      return new Response(
        JSON.stringify({ isMember: false, guildId: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check Discord guild membership
    const discordResponse = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const isMember = discordResponse.status === 200;

    // Update cache
    membershipCache.set(userId, { isMember, timestamp: now });

    return new Response(
      JSON.stringify({ isMember, guildId: isMember ? DISCORD_GUILD_ID : null, cached: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking Discord membership:', error);

    // Determine appropriate error status
    let status = 500;
    let errorMessage = error.message;

    if (error.message === 'User not found') {
      status = 404;
    } else if (error.message === 'Missing required environment variables') {
      status = 503;
      errorMessage = 'Service temporarily unavailable';
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
