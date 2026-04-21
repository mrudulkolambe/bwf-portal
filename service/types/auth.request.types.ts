export interface SendOtpRequest {
    action: "send-otp";
    phoneNumber: string;
    name?: string;
    role?: "ADMIN" | "PARTNER" | "CONSUMER";
    email?: string;
}

export interface VerifyOtpRequest {
    action: "verify-otp";
    phoneNumber: string;
    otp: string;
    name?: string;
    role?: "ADMIN" | "PARTNER" | "CONSUMER";
    email?: string;
}

export type AuthRequest = SendOtpRequest | VerifyOtpRequest;
