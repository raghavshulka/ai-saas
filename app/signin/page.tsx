'use client'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInComponent() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Redirect to the pricing section after sign-in
      router.push('/home#pricing');
    }
  }, [session, router]);

  if (session) {
    return (
      <>
        {/* Signed in as {session?.user?.email} <br /> */}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      {/* Not signed in <br /> */}
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
