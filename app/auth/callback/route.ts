import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, createUserProfile } from '@/lib/db';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`);
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`);
    }

    // Check if user profile exists
    try {
      const profile = await getUserProfile(user.id);

      if (!profile) {
        // Create user profile for first-time users
        await createUserProfile({
          id: user.id,
          role: 'free',
          onboarding_completed: false,
          preferences: {
            currency: 'USD',
            theme: 'system',
          },
        });

        // Redirect to onboarding for new users
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
      }

      // Check if user has completed onboarding
      if (!profile.onboarding_completed) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
      }

      // Redirect to dashboard for existing users
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } catch (error) {
      console.error('Error checking user profile:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=profile_error`);
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
