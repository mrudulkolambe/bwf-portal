import API from "@/lib/api";
import APIs from "@/lib/api-routes";
import { clearToken } from "@/lib/token";
import { 
    AuthRequest, 
    SendOtpRequest, 
    VerifyOtpRequest 
} from "./types/auth.request.types";
import { 
    WhoAmIResponse, 
    AuthSuccessResponse, 
    OtpSentResponse 
} from "./types/auth.response.types";

class AuthService {
    /**
     * Sends OTP to the provided phone number
     */
    static async sendOtp(
        payload: Omit<SendOtpRequest, 'action'>,
        setLoading: (loading: boolean) => void,
        onSuccess: (data: OtpSentResponse) => void,
        onError: (message: string) => void
    ) {
        setLoading(true);
        const response = await API.post<OtpSentResponse>(APIs.login, {
            ...payload,
            action: "send-otp"
        });

        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
        setLoading(false);
    }

    /**
     * Verifies OTP and logs the user in
     */
    static async verifyOtp(
        payload: Omit<VerifyOtpRequest, 'action'>,
        setLoading: (loading: boolean) => void,
        onSuccess: (data: AuthSuccessResponse) => void,
        onError: (message: string) => void
    ) {
        setLoading(true);
        const response = await API.post<AuthSuccessResponse>(APIs.login, {
            ...payload,
            action: "verify-otp"
        });

        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
        setLoading(false);
    }

    /**
     * Fetches details of the currently logged-in user
     */
    static async whoAmI({
        setLoading,
        onSuccess,
        onError
    }: {
        setLoading: (loading: boolean) => void,
        onSuccess: (data: WhoAmIResponse) => void,
        onError: (message: string) => void
    }) {
        setLoading(true);
        const response = await API.get<WhoAmIResponse>(APIs.whoAmI);
        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
        setLoading(false);
    }

    /**
     * Logs out the user
     */
    static async logout(cb: () => void) {
        clearToken();
        localStorage.clear();
        cb();
    }

    /**
     * Mock onboarding service - can be implemented fully as needed
     */
    /**
     * Updates user profile details
     */
    static async updateProfile(
        payload: { email?: string, name?: string, image?: string },
        setLoading: (loading: boolean) => void,
        onSuccess: (data: any) => void,
        onError: (message: string) => void
    ) {
        setLoading(true);
        const response = await API.put(APIs.updateProfile, payload);
        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
        setLoading(false);
    }
}

export default AuthService;

