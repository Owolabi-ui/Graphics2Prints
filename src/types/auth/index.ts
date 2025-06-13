import "next-auth"

export interface User {
    customer_id: number;
    name: string;
    email: string;
    oauth_provider?: string;
    oauth_id?: string;
    role?: UserRole;
  }

  export type UserRole = 'admin' | 'user' | 'guest'
  
  export interface RegisterData {
    name: string;
    email: string;
    password?: string;
  }

  declare module "next-auth" {
    interface User {
        customer_id: number;
        role?: UserRole;
        oauth_provider?: string;
        oauth_id?: string;
    }

    interface Session {
        user: User & {
            role?: UserRole;
        }
        expires: string;
    }
}