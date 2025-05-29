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
    const { postId } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Get the post and account details
    const { data: post, error: postError } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        social_accounts!inner(*)
      `)
      .eq('id', postId)
      .eq('user_id', user.id)
      .single();

    if (postError || !post) {
      throw new Error('Post not found');
    }

    // Publish to the appropriate platform
    let result;
    switch (post.platform) {
      case 'telegram':
        result = await publishToTelegram(post);
        break;
      case 'instagram':
        result = await publishToInstagram(post);
        break;
      case 'tiktok':
        result = await publishToTiktok(post);
        break;
      default:
        throw new Error('Invalid platform');
    }

    // Update the post status
    const { error: updateError } = await supabase
      .from('scheduled_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

async function publishToTelegram(post: any) {
  // Implement Telegram publishing
  throw new Error('Not implemented');
}

async function publishToInstagram(post: any) {
  // Implement Instagram publishing
  throw new Error('Not implemented');
}

async function publishToTiktok(post: any) {
  // Implement TikTok publishing
  throw new Error('Not implemented');
}