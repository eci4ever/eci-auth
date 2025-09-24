import { getAllUsers } from "@/lib/data"

export default async function EciPage() {

    const myuser = await getAllUsers();
    console.log(myuser)
    return (
        <div>
            <h1>Server</h1>
        </div>
    )
}