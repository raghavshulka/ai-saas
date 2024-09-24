import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

// Define the expected structure of Subscription and User
interface Subscription {
  id: string;
  name: string;
  credits: number;
  price: number;
  limit: number;
}

interface User {
  id: string;
  subscription: Subscription | null;  // User may or may not have a subscription
}

const AdminDashboard: React.FC = () => {
  const [usersWithSubscription, setUsersWithSubscription] = useState<User[]>([]);
  const [usersWithoutSubscription, setUsersWithoutSubscription] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/admin/users');
        const { usersWithSubscription, usersWithoutSubscription } = response.data;
        setUsersWithSubscription(usersWithSubscription);
        setUsersWithoutSubscription(usersWithoutSubscription);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <Typography variant="h4">Admin Dashboard</Typography>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Users with Subscriptions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Subscription Name</TableCell>
            <TableCell>Subscription Credits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersWithSubscription.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              {/* Ensure subscription exists before accessing properties */}
              <TableCell>{user.subscription?.name ?? 'No Subscription'}</TableCell>
              <TableCell>{user.subscription?.credits ?? '-'}</TableCell>
            </TableRow>
          ))}
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
          {usersWithoutSubscription.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
