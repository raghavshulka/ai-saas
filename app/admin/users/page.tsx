// app/admin/users/page.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/compat/router';
import { AdminDashboard } from '@/components/admin-dash';
import { getSession } from 'next-auth/react'; // Ensure you're using the correct import
import { isAdmin } from '@/app/lib/auth'; // Import the updated isAdmin function

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      const result = await isAdmin(session); // Pass the session to isAdmin

      if (!result) {
        router?.push('/'); // Redirect non-admin users to the home page
      } else {
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return isAuthorized ? <AdminDashboard /> : null;
};

export default AdminPage;