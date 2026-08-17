import { NextRequest, NextResponse } from 'next/server';

function firstRedirect(request: NextRequest) {
    const hasVisited = request.cookies.has('has_visited');

    if (hasVisited) {
        return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL('/book', request.url));

    response.cookies.set('has_visited', 'true', {maxAge: 86400})
    return response;
}

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const redirect = firstRedirect(request)

    if (redirect) return redirect;

    if (token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            const expired = payload.exp && payload.exp * 1000 < Date.now();

            if (expired) {
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete('token');
                return response;
            }
        } catch {
            const response = NextResponse.next();
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};