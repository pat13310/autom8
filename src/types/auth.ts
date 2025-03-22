export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  auth_role: string;
  role?: 'superuser';
}
