"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';

interface Subscription {
  id: string;
  name: string;
  credits: number;
  price: number;
  limit: number;
}

interface User {
  id: string;
  subscription: Subscription | null;
  credits: number;
}

const AdminDashboard: React.FC = () => {
  const [usersWithSubscription, setUsersWithSubscription] = useState<User[] | null>(null);
  const [usersWithoutSubscription, setUsersWithoutSubscription] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/users');
        const { usersWithSubscription, usersWithoutSubscription } = response.data;
        setUsersWithSubscription(usersWithSubscription);
        setUsersWithoutSubscription(usersWithoutSubscription);
        setError(null);
      } catch (error) {
        console.error('Error fetching users', error);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">Admin Dashboard</Typography>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Users with Subscriptions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Subscription Name</TableCell>
            <TableCell>User Credits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersWithSubscription && usersWithSubscription.length > 0 ? (
            usersWithSubscription.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.subscription?.name ?? 'No Subscription'}</TableCell>
                <TableCell>{user.credits ?? '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No users with subscriptions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Users without Subscriptions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersWithoutSubscription && usersWithoutSubscription.length > 0 ? (
            usersWithoutSubscription.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No users without subscriptions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;