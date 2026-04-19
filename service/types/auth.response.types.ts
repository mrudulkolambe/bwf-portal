export interface User {
    id: string;
    phoneNumber: string;
    email?: string | null;
    name?: string | null;
    role: "ADMIN" | "PARTNER" | "CONSUMER";
    isOnboarded?: boolean;
}

export interface WhoAmIResponse {
    success: boolean;
    user: User;
    isSuperAdmin: boolean;
    isPartner: boolean;
    isPartnerTeam: boolean;
    permissions?: any[];
}

export interface AuthSuccessResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export interface OtpSentResponse {
    success: boolean;
    message: string;
    otp?: string; // Only in development
}
