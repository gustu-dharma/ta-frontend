// app/dashboard/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Eye, Upload, Users, Activity, FileText, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { recentScansData } from "@/constants/data";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">IBrain2u Medical Platform</h1>
        <p className="text-muted-foreground mt-2">
          Advanced neuroimaging analysis and medical visualization platform
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">98.7%</div>
            <p className="text-xs text-muted-foreground">
              Accuracy rate this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">847</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Viewer
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">NIfTI</div>
            <p className="text-xs text-muted-foreground mb-3">
              View brain scans and medical images
            </p>
            <Link href="/dashboard/viewer">
              <Button size="sm" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Open Viewer
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Analysis
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">AI</div>
            <p className="text-xs text-muted-foreground mb-3">
              Brain analysis and segmentation
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>
              <Brain className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upload Files
            </CardTitle>
            <Upload className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Files</div>
            <p className="text-xs text-muted-foreground mb-3">
              Upload medical images
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>
              <Upload className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patient Records
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Patients</div>
            <p className="text-xs text-muted-foreground mb-3">
              Manage patient data
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>
              <Users className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Quick guide to using IBrain2u medical platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Open Medical Viewer</p>
                  <p className="text-sm text-muted-foreground">
                    Start by opening the NIfTI medical image viewer
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium">Load Brain Scans</p>
                  <p className="text-sm text-muted-foreground">
                    Enter URL or try example brain imaging data
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium">Analyze Multi-planar Views</p>
                  <p className="text-sm text-muted-foreground">
                    Explore Sagittal, Coronal, Axial, and 3D views
                  </p>
                </div>
              </div>
            </div>

            <Link href="/dashboard/viewer">
              <Button className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Start Medical Viewer
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Medical Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Medical Activity
            </CardTitle>
            <CardDescription>
              Latest scans and patient analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScansData.slice(0, 4).map((scan) => (
                <div key={scan.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {scan.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {scan.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {scan.lastScan}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={
                        scan.diagnosis === 'Normal' ? 'default' :
                        scan.diagnosis === 'Abnormal' ? 'destructive' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {scan.diagnosis}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Platform Features
          </CardTitle>
          <CardDescription>
            Comprehensive medical imaging and analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Multi-planar Visualization</span>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-medium">AI Brain Analysis</span>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5 text-green-600" />
                <span className="font-medium">DICOM Support</span>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Patient Management</span>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="font-medium">Automated Reports</span>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-red-600" />
                <span className="font-medium">Advanced Analytics</span>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Need Medical Imaging Support?
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Our team specializes in neuroimaging analysis and medical visualization. 
                Contact our support team for assistance with brain imaging, DICOM processing, 
                or advanced analysis features.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="bg-white">
                  Contact Support
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}