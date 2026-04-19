const apiBuilder = (path: string) => {
    return `/api${path}`;
};

const APIs = {
    login: apiBuilder('/auth'), // We use POST /api/auth with action: send-otp/verify-otp
    whoAmI: apiBuilder('/auth/who-am-i'),
    updateProfile: apiBuilder('/user/update'),
    // Add more as needed
    verifyToken: '/api/auth/verify',
}


export default APIs
