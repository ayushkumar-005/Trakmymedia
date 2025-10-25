// Extend NextAuth types to include our custom fields
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            profileComplete: boolean;
            username: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        profileComplete?: boolean;
        username?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        profileComplete: boolean;
        username: string | null;
    }
}
