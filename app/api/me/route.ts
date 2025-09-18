import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    // This API route only runs on the server, but we can still guard against missing headers
    const JWT_SECRET = process.env.JWT_SECRET!;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user_id } = decoded as { user_id: string };
    const user = await prisma.user.findUnique({
        where: { id: user_id },
    });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name
    });
}
