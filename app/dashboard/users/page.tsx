import { UserDataTable } from "@/components/user-datatable";
import { getAllUsers } from "@/lib/data";

export default async function UserPage() {

    const users = await getAllUsers()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UserDataTable data={users} />
        </div>
    )
}