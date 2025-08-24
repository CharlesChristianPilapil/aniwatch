export type UserInfoType = {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar_image: string | null;
    phone_number: string | null;
    city: string | null;
    bio: string | null;
    joined?: string | null;
}