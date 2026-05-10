import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Неавторизований доступ' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, bio: true, location: true, position: true, age: true, gender: true }
    });

    return NextResponse.json(user);
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Неавторизований доступ' }, { status: 401 });
        }

        const body = await request.json();
        const { name, bio, location, position, age, gender } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                bio,
                location,
                position,
                age: age ? parseInt(age, 10) : null,
                gender,
            },
        });

        return NextResponse.json({ message: 'Особову справу оновлено!', user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка при оновленні профілю' }, { status: 500 });
    }
}