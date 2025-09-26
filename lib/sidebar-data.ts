import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
} from "lucide-react";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Settings",
      url: "/dashboard/users/stats",
      isActive: true,
      icon: Settings2,
      requiredRoles: ["Admin"],
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          requiredRoles: ["Admin"],
        },
        {
          title: "Roles",
          url: "#",
          requiredRoles: ["Admin"],
        },
        {
          title: "Permissions",
          url: "#",
          requiredRoles: ["Admin"],
        },
      ],
    },
    {
      title: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      isActive: true,
      requiredRoles: ["Admin", "Manager", "User"],
      items: [
        {
          title: "Invoices",
          url: "#",
          requiredRoles: ["Admin", "Manager", "User"],
        },
        {
          title: "Customers",
          url: "#",
          requiredRoles: ["Admin", "Manager", "User"],
        },
        {
          title: "Quotations",
          url: "#",
          requiredRoles: ["Admin", "Manager", "User"],
        },
        {
          title: "Revenue",
          url: "#",
          requiredRoles: ["Admin", "Manager", "User"],
        },
        {
          title: "Payments",
          url: "#",
          requiredRoles: ["Admin", "Manager", "User"],
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      requiredRoles: ["manager"],
      items: [
        {
          title: "Genesis",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Explorer",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Quantum",
          url: "#",
          requiredRoles: ["manager"],
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      requiredRoles: ["manager"],
      items: [
        {
          title: "Introduction",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Get Started",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Tutorials",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Changelog",
          url: "#",
          requiredRoles: [],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
