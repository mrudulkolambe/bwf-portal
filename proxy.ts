import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('chargnex-auth-token')?.value;
    const pathname = request.nextUrl.pathname;

    // Internal API URL for current host
    const whoAmIUrl = new URL('/api/auth/who-am-i', request.url).toString();

    const publicRoutes: string[] = [
        '/',
        '/signup',
        '/api/auth',
    ];

    const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));

    if (isPublicRoute) {
        if (token && pathname === '/') {
            // If logged in and at root, redirect to dashboard
            return NextResponse.redirect(new URL('/partner/dashboard', request.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        const response = await fetch(whoAmIUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (response.status !== 200) {
            const res = NextResponse.redirect(new URL('/', request.url));
            res.cookies.delete('chargnex-auth-token');
            return res;
        }

        const responseData = await response.json();
        const isOnboarded = responseData?.user?.isOnboarded;

        // Simple onboarding check as per requested logic
        if (isOnboarded === false) {
            if (pathname !== '/onboard') {
                return NextResponse.redirect(new URL('/onboard', request.url));
            }
        } else {
            if (pathname === '/' || pathname === '/onboard') {
                return NextResponse.redirect(new URL('/partner/dashboard', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('[Middleware] Auth validation error:', error);
        const res = NextResponse.redirect(new URL('/', request.url));
        res.cookies.delete('chargnex-auth-token');
        return res;
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|bmp|tiff|tif)$).*)',
    ],
};
