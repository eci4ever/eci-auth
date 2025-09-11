// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // Hapus password dari type jika tidak diperlukan di client
}

export interface UserWithPassword extends User {
  password: string; // Hanya untuk internal use
}

export type UserSafe = Omit<User, "password">; // Type tanpa password
