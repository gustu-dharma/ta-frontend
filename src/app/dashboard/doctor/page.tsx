"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  FileText, 
  Users, 
  Calendar,
  Search,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Edit,
  Star,
  Activity,
  TrendingUp,
  Stethoscope,
  ClipboardList,
  UserCheck
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for doctor dashboard
const mockDoctorStats = {
  totalPatients: 89,
  pendingReviews: 12,
  completedToday: 7,
  urgentCases: 3,
  monthlyProgress: {
    reviewsCompleted: 156,
    avgResponseTime: '2.3 hours',
    patientSatisfaction: 4.8
  }
};

const mockPendingScans = [
  {
    id: '1',
    patientCode: 'P000123',
    patientName: 'Sarah Johnson',
    scanType: 'T1',
    bodyPart: 'brain',
    uploadDate: '2024-06-29',
    priority: 'urgent',
    labStaff: 'Mike Chen',
    status: 'pending'
  },
  {
    id: '2',
    patientCode: 'P000124',
    patientName: 'Robert Wilson',
    scanType: 'FLAIR',
    bodyPart: 'brain',
    uploadDate: '2024-06-28',
    priority: 'high',
    labStaff: 'Lisa Park',
    status: 'pending'
  },
  {
    id: '3',
    patientCode: 'P000125',
    patientName: 'Emily Davis',
    scanType: 'DTI',
    bodyPart: 'brain',
    uploadDate: '2024-06-28',
    priority: 'normal',
    labStaff: 'Mike Chen',
    status: 'pending'
  }
];

const mockMyPatients = [
  {
    id: '1',
    patientCode: 'P000123',
    name: 'Sarah Johnson',
    age: 34,
    lastScan: '2024-06-29',
    totalScans: 3,
    status: 'active',
    condition: 'Multiple Sclerosis',
    nextAppointment: '2024-07-05'
  },
  {
    id: '2',
    patientCode: 'P000124', 
    name: 'Robert Wilson',
    age: 56,
    lastScan: '2024-06-28',
    totalScans: 8,
    status: 'follow-up',
    condition: 'Brain Tumor',
    nextAppointment: '2024-07-02'
  },
  {
    id: '3',
    patientCode: 'P000125',
    name: 'Emily Davis',
    age: 28,
    lastScan: '2024-06-28',
    totalScans: 2,
    status: 'new',
    condition: 'Headache Investigation',
    nextAppointment: '2024-07-08'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'review_completed',
    description: 'Completed review for Sarah Johnson - T1 Brain MRI',
    timestamp: '2 hours ago',
    priority: 'normal'
  },
  {
    id: '2',
    type: 'comment_added',
    description: 'Added findings comment for Robert Wilson scan',
    timestamp: '4 hours ago', 
    priority: 'normal'
  },
  {
    id: '3',
    type: 'urgent_case',
    description: 'New urgent case assigned - Emily Davis',
    timestamp: '6 hours ago',
    priority: 'urgent'
  },
  {
    id: '4',
    type: 'appointment_scheduled',
    description: 'Follow-up appointment scheduled for Sarah Johnson',
    timestamp: '1 day ago',
    priority: 'normal'
  }
];

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review_completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'comment_added': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'urgent_case': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'appointment_scheduled': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Patient management and medical imaging review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockDoctorStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Active patients under care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockDoctorStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockDoctorStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              Reviews completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockDoctorStats.urgentCases}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockDoctorStats.monthlyProgress.reviewsCompleted}</div>
              <p className="text-sm text-muted-foreground">Reviews Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockDoctorStats.monthlyProgress.avgResponseTime}</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                {mockDoctorStats.monthlyProgress.patientSatisfaction}
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your recent actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                  {activity.priority === 'urgent' && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Urgent
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending MRI Reviews
                  </CardTitle>
                  <CardDescription>Scans awaiting your medical review</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Scan Type</TableHead>
                    <TableHead>Body Part</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Lab Staff</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPendingScans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{scan.patientName}</div>
                          <div className="text-sm text-gray-500">{scan.patientCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{scan.scanType}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{scan.bodyPart}</TableCell>
                      <TableCell>{scan.uploadDate}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadgeColor(scan.priority)}>
                          {scan.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{scan.labStaff}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
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

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    My Patients
                  </CardTitle>
                  <CardDescription>Patients under your care</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Total Scans</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>Next Appointment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMyPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.patientCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.totalScans}</Badge>
                      </TableCell>
                      <TableCell>{patient.lastScan}</TableCell>
                      <TableCell>{patient.nextAppointment}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Calendar className="h-4 w-4" />
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

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your appointments and tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Patient Consultation - Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Review MRI results and treatment plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">09:00 AM</p>
                    <p className="text-sm text-gray-500">30 minutes</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">MRI Review Session</p>
                      <p className="text-sm text-gray-600">Review pending brain scans</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">11:00 AM</p>
                    <p className="text-sm text-gray-500">2 hours</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Department Meeting</p>
                      <p className="text-sm text-gray-600">Weekly radiology department meeting</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-600">02:00 PM</p>
                    <p className="text-sm text-gray-500">1 hour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Reports
                  </CardTitle>
                  <CardDescription>Generate and manage medical reports</CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Brain MRI Report</h3>
                        <p className="text-sm text-gray-500">Comprehensive analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Follow-up Report</h3>
                        <p className="text-sm text-gray-500">Patient progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Statistical Report</h3>
                        <p className="text-sm text-gray-500">Monthly summary</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Recent Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Brain MRI Analysis - Sarah Johnson</p>
                        <p className="text-sm text-gray-500">Generated on June 28, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Follow-up Report - Robert Wilson</p>
                        <p className="text-sm text-gray-500">Generated on June 27, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-medium">Monthly Statistics Report</p>
                        <p className="text-sm text-gray-500">Generated on June 26, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Panel */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Medical Review Assistant
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Use our AI-powered tools to assist with MRI analysis, generate preliminary findings, 
                and streamline your review process. Access advanced visualization tools and 
                collaborate with your medical team efficiently.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="bg-white">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Team Chat
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;