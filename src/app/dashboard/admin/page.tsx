"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  Brain, 
  FileText, 
  UserPlus, 
  Search,
  Settings,
  Shield,
  TrendingUp,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockStats = {
  totalUsers: 1847,
  totalPatients: 1234,
  totalScans: 2847,
  pendingReviews: 23,
  monthlyGrowth: {
    users: 12.5,
    patients: 8.2,
    scans: 15.3
  },
  usersByRole: {
    admin: 5,
    doctor: 45,
    lab_staff: 23,
    patient: 1774
  },
  scansByStatus: {
    pending: 23,
    processing: 12,
    completed: 2795,
    error: 17
  }
};

const mockRecentUsers = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hospital.com', role: 'doctor', status: 'active', createdAt: '2024-06-28' },
  { id: '2', name: 'Mike Chen', email: 'mike.chen@lab.com', role: 'lab_staff', status: 'active', createdAt: '2024-06-27' },
  { id: '3', name: 'Emily Davis', email: 'emily.davis@email.com', role: 'patient', status: 'pending', createdAt: '2024-06-26' },
  { id: '4', name: 'Dr. Robert Wilson', email: 'robert.wilson@hospital.com', role: 'doctor', status: 'active', createdAt: '2024-06-25' },
];

const mockSystemLogs = [
  { id: '1', action: 'User Login', user: 'Dr. Sarah Johnson', timestamp: '2024-06-29 14:30:22', level: 'info' },
  { id: '2', action: 'MRI Upload', user: 'Mike Chen', timestamp: '2024-06-29 14:25:10', level: 'info' },
  { id: '3', action: 'Failed Login Attempt', user: 'unknown', timestamp: '2024-06-29 14:15:33', level: 'warning' },
  { id: '4', action: 'User Created', user: 'Admin', timestamp: '2024-06-29 13:45:12', level: 'info' },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'doctor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab_staff': return 'bg-green-100 text-green-800 border-green-200';
      case 'patient': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            System administration and user management
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.monthlyGrowth.users}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.monthlyGrowth.patients}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mockStats.totalScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.monthlyGrowth.scans}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Users by Role
            </CardTitle>
            <CardDescription>Distribution of user roles in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockStats.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      role === 'admin' ? 'bg-red-500' :
                      role === 'doctor' ? 'bg-blue-500' :
                      role === 'lab_staff' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">{role.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{count}</span>
                    <div className={`h-2 w-16 rounded-full ${
                      role === 'admin' ? 'bg-red-200' :
                      role === 'doctor' ? 'bg-blue-200' :
                      role === 'lab_staff' ? 'bg-green-200' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-full rounded-full ${
                          role === 'admin' ? 'bg-red-500' :
                          role === 'doctor' ? 'bg-blue-500' :
                          role === 'lab_staff' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(count / mockStats.totalUsers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Scan Status Overview
            </CardTitle>
            <CardDescription>Current status of all MRI scans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockStats.scansByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {status === 'processing' && <Activity className="h-4 w-4 text-blue-500" />}
                    {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{count}</span>
                    <div className="h-2 w-16 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'processing' ? 'bg-blue-500' :
                          status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(count / mockStats.totalScans) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage system users and their permissions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity Logs
              </CardTitle>
              <CardDescription>Monitor system activities and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  File Upload Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Registration Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  MRI Processing Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Configuration
                </CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Role Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Session Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Audit Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Security Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">New Users</span>
                    <span className="text-sm font-medium text-green-600">+{mockStats.monthlyGrowth.users}%</span>
                  </div>
                  <div className="h-2 bg-green-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${mockStats.monthlyGrowth.users * 2}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">New Patients</span>
                    <span className="text-sm font-medium text-blue-600">+{mockStats.monthlyGrowth.patients}%</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mockStats.monthlyGrowth.patients * 2}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">MRI Scans</span>
                    <span className="text-sm font-medium text-purple-600">+{mockStats.monthlyGrowth.scans}%</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mockStats.monthlyGrowth.scans * 2}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1.2GB</div>
                  <p className="text-sm text-muted-foreground">Storage Used Today</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;