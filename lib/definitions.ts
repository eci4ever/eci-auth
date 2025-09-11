import { User } from "@prisma/client";

export type UserSafe = Omit<User, "password"> & {
  roles: string[];
  permissions: string[];
};
