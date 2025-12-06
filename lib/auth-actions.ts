'use server';

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';
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

export async function signOut() {
  await authSignOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
