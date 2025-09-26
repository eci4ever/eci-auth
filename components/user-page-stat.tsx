"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Cell, Pie, Legend } from "recharts"
import {
    Users,
    Shield,
    User,
    Lock,
} from "lucide-react"

// Mock data
const userGrowthData = [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 150 },
    { month: "Mar", users: 280 },
    { month: "Apr", users: 320 },
    { month: "May", users: 450 },
    { month: "Jun", users: 550 },
    { month: "July", users: 650 },
    { month: "Aug", users: 550 },
    { month: "Sep", users: 350 },

]

const pieChartData = [
    { name: "New Users", value: 2400 },
    { name: "Returning Users", value: 4567 },
    { name: "Premium Users", value: 1398 },
    { name: "Free Users", value: 9800 },
];

const users = [
    {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "Admin",
        status: "Active",
        lastLogin: "2 hours ago",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 2,
        name: "Marcus Johnson",
        email: "marcus.j@company.com",
        role: "User",
        status: "Active",
        lastLogin: "1 day ago",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        email: "elena.r@company.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "3 hours ago",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 4,
        name: "David Kim",
        email: "david.kim@company.com",
        role: "User",
        status: "Inactive",
        lastLogin: "1 week ago",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 5,
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        role: "Admin",
        status: "Active",
        lastLogin: "30 minutes ago",
        avatar: "/placeholder.svg?height=32&width=32",
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
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
        return matchesSearch && matchesRole
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-t from-primary/10 to-primary/0 shadow-lg">
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

                <Card className="bg-gradient-to-t from-primary/10 to-primary/0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,890</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+8.2%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-t from-primary/10 to-primary/0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-t from-primary/10 to-primary/0 shadow-lg">
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
                    <div className="flex flex-col md:flex-row px-4 md:px-8 gap-8 w-full">
                        {/* Area Chart */}
                        <ChartContainer
                            config={{
                                users: { label: "Total Users", color: "var(--color-chart-1)" },
                            }}
                            className="h-[250px] flex-1"
                        >
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
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ChartContainer>

                        {/* Pie / Donut Chart */}
                        <ChartContainer
                            config={{
                                users: { label: "Total Users", color: "var(--color-chart-1)" },
                                newUsers: { label: "New Users", color: "var(--color-chart-2)" },
                                returningUsers: { label: "Returning Users", color: "var(--color-chart-3)" },
                            }}
                            className="h-[250px] w-full md:w-[250px] flex-shrink-0"
                        >
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={30}
                                    outerRadius={80}
                                    fill="var(--color-chart-1)"
                                    fillOpacity={0.5}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

        </div>


    )
}
