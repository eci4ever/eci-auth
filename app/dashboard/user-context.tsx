"use client";
import { createContext, useContext } from "react";

export type UserSafe = {
    id: string;
    name?: string | null;
    email?: string | null;
    roles: string[];
    permissions: string[];
} | null;

const UserContext = createContext<UserSafe>(null);

export function UserProvider({ value, children }: { value: UserSafe; children: React.ReactNode }) {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    return useContext(UserContext);
}
