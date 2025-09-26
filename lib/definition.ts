export type UserRole = {
  roles: string[];
  permissions: string[];
  name: string;
  id: string;
  email: string;
  image: string | null;
  emailVerified: Date | null;
};
