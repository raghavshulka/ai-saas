// app/admin/feedbacks/page.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

interface Feedback {
  id: string;
  content: string;
  user: {
    id: string;
    email: string;
  };
}

const AdminFeedbacksPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await axios.get('/api/admin/feedbacks');
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks', error);
      }
    }

    fetchFeedbacks();
  }, []);

  return (
    <div>
      <Typography variant="h4">User Feedback</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Email</TableCell>
            <TableCell>Feedback Content</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.user.email}</TableCell>
              <TableCell>{feedback.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminFeedbacksPage;
