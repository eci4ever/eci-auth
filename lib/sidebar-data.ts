import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      requiredRoles: ["manager"],
      items: [
        {
          title: "History",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Starred",
          url: "#",
          requiredRoles: ["manager"],
        },
        {
          title: "Settings",
          url: "#",
          requiredRoles: ["manager"],
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
    {
      title: "Settings",
      url: "#",
      isActive: true,
      icon: Settings2,
      requiredRoles: ["admin:user"],
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          requiredRoles: ["admin:user"],
        },
        {
          title: "Roles",
          url: "#",
          requiredRoles: ["admin:user"],
        },
        {
          title: "Permissions",
          url: "#",
          requiredRoles: ["admin:user"],
        },
        {
          title: "Profile",
          url: "#",
          requiredRoles: ["admin:user"],
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
