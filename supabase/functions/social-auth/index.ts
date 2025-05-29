import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { platform, code } = await req.json();

    // Validate input parameters
    if (!platform || !code) {
      return new Response(
        JSON.stringify({ 
          error: 'Platform and code are required',
          details: 'Both platform and authentication code must be provided' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          error: 'Authorization header is required',
          details: 'Please ensure you are logged in and your session is valid'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authentication token',
          details: 'Your session has expired. Please log in again.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    let platformData;

    try {
      switch (platform) {
        case 'telegram':
          platformData = await handleTelegramAuth(code);
          break;
        case 'instagram':
          platformData = await handleInstagramAuth(code);
          break;
        case 'tiktok':
          platformData = await handleTiktokAuth(code);
          break;
        default:
          return new Response(
            JSON.stringify({ 
              error: 'Invalid platform specified',
              details: `Platform "${platform}" is not supported. Supported platforms are: telegram, instagram, tiktok`
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
      }

      if (!platformData || !platformData.platformUserId || !platformData.accessToken) {
        throw new Error('Invalid platform response');
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: `Authentication failed for ${platform}`,
          details: error.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Store the platform data in the database
    const { data, error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: user.id,
        platform,
        platform_user_id: platformData.platformUserId,
        access_token: platformData.accessToken,
        refresh_token: platformData.refreshToken,
        expires_at: platformData.expiresAt,
        metadata: platformData.metadata || {}
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save account data',
          details: error.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Internal server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function handleTelegramAuth(code: string) {
  // Basic structure for Telegram auth
  // This is a placeholder that returns mock data
  // In production, implement actual Telegram Bot API integration
  return {
    platformUserId: 'telegram-test-user',
    accessToken: 'mock-telegram-token',
    metadata: {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User'
    }
  };
}

async function handleInstagramAuth(code: string) {
  // Basic structure for Instagram auth
  // This is a placeholder that returns mock data
  // In production, implement actual Instagram OAuth flow
  return {
    platformUserId: 'instagram-test-user',
    accessToken: 'mock-instagram-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    metadata: {
      username: 'testuser',
      fullName: 'Test User'
    }
  };
}

async function handleTiktokAuth(code: string) {
  // Basic structure for TikTok auth
  // This is a placeholder that returns mock data
  // In production, implement actual TikTok OAuth flow
  return {
    platformUserId: 'tiktok-test-user',
    accessToken: 'mock-tiktok-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    metadata: {
      username: 'testuser',
      displayName: 'Test User'
    }
  };
}