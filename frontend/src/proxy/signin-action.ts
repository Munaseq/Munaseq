'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signinAction(formData: FormData) {
  const signinData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });


    if (response.status === 404 || response.status === 401 || response.status === 400) {
      throw new Error('AUTHENTICATION_FAILED');
    }

    if (!response.ok) {
      throw new Error('ERROR');
    }

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      throw new Error('ERROR');
    }

    const cookieStore = cookies();
    cookieStore.set('token', token, { maxAge: 259200, path: '/', httpOnly: true });
  } catch (error: any) {
    return { message: error.message };
  }
  redirect('/discover');
}
