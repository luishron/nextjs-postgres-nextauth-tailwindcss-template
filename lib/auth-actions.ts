'use server';

import {
  signIn as authSignIn,
  signOut as authSignOut,
  signInWithMagicLink as authSignInWithMagicLink,
} from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(email: string, password: string) {
  const result = await authSignIn(email, password);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signInWithMagicLink(email: string) {
  const result = await authSignInWithMagicLink(email);

  if (result.error) {
    return { error: result.error };
  }

  return { success: true };
}

export async function signOut() {
  await authSignOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
