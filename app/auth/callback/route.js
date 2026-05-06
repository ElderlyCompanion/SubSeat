import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const role = user.user_metadata?.role;

      if (role === 'business') {
        // Check if they have completed onboarding
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (business) {
          // Already onboarded — go straight to dashboard
          return NextResponse.redirect(`${origin}/dashboard`);
        } else {
          // First time — go to onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      } else {
        // Customer — go to discover
        return NextResponse.redirect(`${origin}/discover`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}