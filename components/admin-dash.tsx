"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Users, CreditCard, DollarSign } from "lucide-react";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const AdminDashboard = () => {
  const [usersWithSubscription, setUsersWithSubscription] = useState<
    User[] | null
  >(null);
  const [usersWithoutSubscription, setUsersWithoutSubscription] = useState<
    User[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/users");
        const { usersWithSubscription, usersWithoutSubscription } =
          response.data;
        setUsersWithSubscription(usersWithSubscription);
        setUsersWithoutSubscription(usersWithoutSubscription);
        setError(null);
      } catch (error) {
        console.error("Error fetching users", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const subscriptionData =
    usersWithSubscription?.reduce((acc, user) => {
      if (user.subscription) {
        const existingSubscription = acc.find(
          (item) => item.name === user.subscription?.name
        );
        if (existingSubscription) {
          existingSubscription.value++;
        } else {
          acc.push({ name: user.subscription.name, value: 1 });
        }
      }
      return acc;
    }, [] as { name: string; value: number }[]) || [];

  const creditDistributionData =
    usersWithSubscription?.map((user) => ({
      name: user.id,
      credits: user.credits,
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-black/90 text-white ">
    
      <main className="flex-1 p-8 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(usersWithSubscription?.length || 0) +
                  (usersWithoutSubscription?.length || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Users with Subscription
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersWithSubscription?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Users without Subscription
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersWithoutSubscription?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Credits
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersWithSubscription?.reduce(
                  (total, user) => total + user.credits,
                  0
                ) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Credit Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={creditDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="with-subscription" className="mt-4">
          <TabsList>
            <TabsTrigger value="with-subscription">
              Users with Subscription
            </TabsTrigger>
            <TabsTrigger value="without-subscription">
              Users without Subscription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="with-subscription">
            <Card>
              <CardHeader>
                <CardTitle>Users with Subscriptions</CardTitle>
                <CardDescription>
                  A list of users who have active subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Subscription Name</TableHead>
                        <TableHead>User Credits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithSubscription &&
                      usersWithSubscription.length > 0 ? (
                        usersWithSubscription.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>
                              {user.subscription?.name ?? "No Subscription"}
                            </TableCell>
                            <TableCell>{user.credits ?? "-"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No users with subscriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="without-subscription">
            <Card>
              <CardHeader>
                <CardTitle>Users without Subscriptions</CardTitle>
                <CardDescription>
                  A list of users who do not have active subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithoutSubscription &&
                      usersWithoutSubscription.length > 0 ? (
                        usersWithoutSubscription.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell className="text-center">
                            No users without subscriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
