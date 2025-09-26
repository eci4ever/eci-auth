import { UserDataTable } from "@/components/user-datatable";
import { getAllUsers } from "@/lib/data";

export default async function UserPage() {

    const users = await getAllUsers()

    return (
        <div className="flex flex-1 flex-col px-6">
            <UserDataTable data={users} />
        </div>
    )
}