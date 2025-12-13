'use client';

import * as React from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { redirect, useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DeleteConfirmationCard from '../../ui/delete-confirmation';
// import { Button } from "@/components/ui/button"

// Employee data type
export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  location: string;
  salary?: string;
  manager?: string;
  employeeType?: string;
  bio?: string;
  skills?: string[];
};

// Mock employee data - in real app, this would come from your API
const mockEmployeeData: Employee[] = [
  {
    id: 'emp001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2022-01-15',
    status: 'Active',
    location: 'New York, NY',
    salary: '$95,000',
    manager: 'Sarah Johnson',
    employeeType: 'Full-time',
    bio: 'Experienced software developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and mentoring junior developers.',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'GraphQL'],
  },
  {
    id: 'emp002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2021-11-20',
    status: 'Active',
    location: 'Los Angeles, CA',
    salary: '$78,000',
    manager: 'Michael Brown',
    employeeType: 'Full-time',
    bio: 'Creative marketing professional with 8+ years of experience in digital marketing, brand management, and campaign development.',
    skills: [
      'Digital Marketing',
      'SEO',
      'Content Strategy',
      'Analytics',
      'Adobe Creative Suite',
    ],
  },
  {
    id: 'emp003',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    position: 'Sales Representative',
    joinDate: '2023-03-10',
    status: 'Active',
    location: 'Chicago, IL',
    salary: '$65,000',
    manager: 'Lisa Davis',
    employeeType: 'Full-time',
    bio: 'Results-driven sales professional with a track record of exceeding targets and building strong client relationships.',
    skills: ['Sales', 'CRM', 'Client Relations', 'Negotiation', 'Presentation'],
  },
  {
    id: 'emp004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1 (555) 456-7890',
    department: 'HR',
    position: 'HR Specialist',
    joinDate: '2022-07-05',
    status: 'On Leave',
    location: 'Boston, MA',
    salary: '$58,000',
    manager: 'Robert Taylor',
    employeeType: 'Full-time',
    bio: 'HR professional specializing in talent acquisition, employee relations, and organizational development.',
    skills: [
      'Recruitment',
      'Employee Relations',
      'HR Policies',
      'Training',
      'Compliance',
    ],
  },
  {
    id: 'emp005',
    name: 'David Brown',
    email: 'david.brown@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    position: 'Frontend Developer',
    joinDate: '2023-01-12',
    status: 'Active',
    location: 'Seattle, WA',
    salary: '$72,000',
    manager: 'John Doe',
    employeeType: 'Full-time',
    bio: 'Frontend developer with a passion for creating beautiful and intuitive user interfaces using modern web technologies.',
    skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'UI/UX Design', 'Figma'],
  },
];

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const [showDeleteCard, setShowDeleteCard] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // In real app, you'd get this from URL params
  // For React Router: const { id } = useParams()
  // For Next.js: const { id } = useRouter().query or useParams()
  const [employeeId, setEmployeeId] = React.useState('emp001'); // Mock ID for demo
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Mock function to simulate getting ID from URL
  // Replace this with your actual URL parameter extraction
  React.useEffect(() => {
    // Simulate getting ID from URL params
    // In real app: setEmployeeId(id from URL params)

    // Mock API call
    const fetchEmployee = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find employee by ID
      const foundEmployee = mockEmployeeData.find(
        (emp) => emp.id === employeeId
      );
      setEmployee(foundEmployee || null);
      setLoading(false);
    };

    fetchEmployee();
  }, [employeeId]);

  // Mock navigation functions - replace with your actual routing
  const handleGoBack = () => {
    // For React Router: navigate('/admin/employees')
    // For Next.js: router.push('/admin/employees')
    // For now:
    // console.log("Navigate back to employee list")
    // alert("Navigate back to /admin/employees")

    navigate(`/admin/employees/all`);
  };

  const handleEdit = (employee: Employee) => {
    // Navigate to edit page or open edit modal
    // console.log("Edit employee:", employee?.id)
    // alert(`Navigate to /admin/employees/${employee?.id}/edit`);
    navigate(`/admin/employees/${employee?.id}/edit`);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Item deleted successfully!');
    setIsDeleting(false);
    setShowDeleteCard(false);

    // Show success message or redirect
    navigate(`/admin/employees/all`);
  };

  const handleCancelDelete = () => {
    setShowDeleteCard(false);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800 hover:bg-green-100',
      'On Leave': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Inactive: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      >
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The employee you're looking for doesn't exist.
          </p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employee List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleGoBack} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Employee Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(employee)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.id)}
              >
                <User className="mr-2 h-4 w-4" />
                Copy Employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteCard(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="w-16 h-16  rounded-xl outline-1 bg-red-400">
          {/* <img src={employee.image} alt="" className="bg-red-400"/> */}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
          <p className="text-muted-foreground">
            {employee.position} • {employee.department}
          </p>
        </div>
      </div>

      {showDeleteCard && (
        <DeleteConfirmationCard
          title="Delete Employee?"
          description="By continuing this action, the employee will be permanently removed from the system. All associated data will be lost."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Position</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.joinDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {employee.bio && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {employee.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Employment Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Employee ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {employee.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(employee.status)}</div>
                </div>

                {employee.employeeType && (
                  <div>
                    <p className="text-sm font-medium">Employment Type</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.employeeType}
                    </p>
                  </div>
                )}

                {employee.salary && (
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.salary}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleEdit(employee)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Clock className="mr-2 h-4 w-4" />
                View Time Logs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
