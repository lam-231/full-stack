import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Неавторизований доступ' }, { status: 401 });
        }

        const body = await request.json();
        const { oldPassword, newPassword } = body;

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: 'Всі поля обов\'язкові' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json({ error: 'Ваш акаунт створено через соцмережі. Встановлення пароля недоступне.' }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Невірний поточний пароль' }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({ message: 'Пароль успішно змінено' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
}