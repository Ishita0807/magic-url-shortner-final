import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const { email, name, password, confirmPassword } = await req.json();

        // Validation
        if (!email || !name || !password || !confirmPassword) {
            return NextResponse.json(
                { message: 'All fields are required' }, 
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: 'Passwords do not match' }, 
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' }, 
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' }, 
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return NextResponse.json(
            { 
                message: 'User registered successfully',
                token, 
                user: { 
                    id: user.id, 
                    email: user.email, 
                    name: user.name 
                } 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' }, 
            { status: 500 }
        );
    }
}
