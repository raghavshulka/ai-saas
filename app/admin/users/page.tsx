"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dash';
import { isAdmin } from '@/app/lib/auth';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await isAdmin();

      if (!result) {
        router.push('/'); // Redirect non-admin users to the home page
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
