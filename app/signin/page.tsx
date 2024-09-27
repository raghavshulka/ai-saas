'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInComponent() {
  const { data: session } = useSession();

  // useEffect(() => {
  //   if (session) {
  //     router.push('/home#pricing');
  //   }
  // }, [session, router]);

  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </>
  );
}
