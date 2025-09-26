import UserManagementDashboard from "@/components/user-page-stat";

export default function UserStatPage() {

  return (
    <div className="flex flex-1 flex-col mx-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <UserManagementDashboard />
      </div>
    </div>
  )
}

