"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import {
    Users,
    UserPlus,
    Shield,
    Settings,
    MoreHorizontal,
    Search,
    Eye,
    Edit,
    Trash2,
    Crown,
    User,
    Lock,
    Home,
} from "lucide-react"

// Mock data
const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1350 },
    { month: "Mar", users: 1580 },
    { month: "Apr", users: 1720 },
    { month: "May", users: 1950 },
    { month: "Jun", users: 2180 },
]

const users = [
    {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: ["Admin", "User"],
        status: "Active",
        lastLogin: "2 hours ago",
        image: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 2,
        name: "Marcus Johnson",
        email: "marcus.j@company.com",
        role: ["User"],
        status: "Active",
        lastLogin: "1 day ago",
        image: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        email: "elena.r@company.com",
        role: ["Moderator"],
        status: "Active",
        lastLogin: "3 hours ago",
        image: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 4,
        name: "David Kim",
        email: "david.kim@company.com",
        role: ["User"],
        status: "Inactive",
        lastLogin: "1 week ago",
        image: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 5,
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        role: ["Admin"],
        status: "Active",
        lastLogin: "30 minutes ago",
        image: "/placeholder.svg?height=32&width=32",
    },
]

const roles = [
    { id: 1, name: "Super Admin", users: 3, permissions: 25, description: "Full system access and control" },
    { id: 2, name: "Admin", users: 12, permissions: 18, description: "Administrative privileges with user management" },
    { id: 3, name: "Moderator", users: 45, permissions: 8, description: "Content moderation and basic user support" },
    { id: 4, name: "User", users: 1850, permissions: 3, description: "Standard user access with basic features" },
]

const permissions = [
    { id: 1, name: "User Management", description: "Create, edit, and delete user accounts", category: "Users" },
    { id: 2, name: "Role Assignment", description: "Assign and modify user roles", category: "Users" },
    { id: 3, name: "Content Moderation", description: "Review and moderate user-generated content", category: "Content" },
    { id: 4, name: "System Settings", description: "Access and modify system configuration", category: "System" },
    { id: 5, name: "Analytics Access", description: "View system analytics and reports", category: "Analytics" },
    { id: 6, name: "Billing Management", description: "Manage billing and subscription settings", category: "Billing" },
]

export default function UserManagementDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard")
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role[0] === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h6 className="text-3xl font-bold text-balance">User Management</h6>
                        <p className="text-muted-foreground text-pretty">
                            Manage users, roles, and permissions across your organization
                        </p>
                    </div>
                    <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <Button
                        variant={currentPage === "dashboard" ? "default" : "outline"}
                        onClick={() => setCurrentPage("dashboard")}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={currentPage === "users" ? "default" : "outline"}
                        onClick={() => setCurrentPage("users")}
                        className="gap-2"
                    >
                        <Users className="h-4 w-4" />
                        Users
                    </Button>
                    <Button
                        variant={currentPage === "roles" ? "default" : "outline"}
                        onClick={() => setCurrentPage("roles")}
                        className="gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        Roles
                    </Button>
                    <Button
                        variant={currentPage === "permissions" ? "default" : "outline"}
                        onClick={() => setCurrentPage("permissions")}
                        className="gap-2"
                    >
                        <Lock className="h-4 w-4" />
                        Permissions
                    </Button>
                </div>

                {/* Dashboard Page */}
                {currentPage === "dashboard" && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2,180</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-primary">+12.5%</span> from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,890</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-primary">+8.2%</span> from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4</div>
                                    <p className="text-xs text-muted-foreground">Across all departments</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">25</div>
                                    <p className="text-xs text-muted-foreground">System-wide permissions</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Growth Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Growth</CardTitle>
                                <CardDescription>Total users over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        users: { label: "Total Users", color: "var(--color-chart-1)" },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={userGrowthData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                                            <YAxis stroke="var(--color-muted-foreground)" />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Area
                                                type="monotone"
                                                dataKey="users"
                                                stroke="var(--color-chart-1)"
                                                fill="var(--color-chart-1)"
                                                fillOpacity={0.6}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Users Page */}
                {currentPage === "users" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage and monitor user accounts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Users Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                                                            <AvatarFallback>
                                                                {user.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {user.role.map((r) => (
                                                        <Badge
                                                            className="mx-1"
                                                            variant={
                                                                user.role[0] === "Admin" ? "default" : user.role[0] === "Moderator" ? "secondary" : "outline"
                                                            }
                                                            key={r}
                                                        >
                                                            {user.role[0] === "Admin" && <Crown className="h-3 w-3 mr-1" />}
                                                            {user.role[0] === "Moderator" && <Shield className="h-3 w-3 mr-1" />}
                                                            {user.role[0] === "User" && <User className="h-3 w-3 mr-1" />}
                                                            {r}
                                                        </Badge>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Roles Page */}
                {currentPage === "roles" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Management</CardTitle>
                            <CardDescription>Configure user roles and their capabilities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {roles.map((role) => (
                                    <Card key={role.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{role.name}</CardTitle>
                                                <Badge variant="outline">{role.users} users</Badge>
                                            </div>
                                            <CardDescription>{role.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-muted-foreground">{role.permissions} permissions</div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Permissions Page */}
                {currentPage === "permissions" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Management</CardTitle>
                            <CardDescription>Manage system permissions and access controls</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{permission.name}</h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {permission.category}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Manage
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
