import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password, bio, location, position, age, gender } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Пошта та пароль обов\'язкові' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Користувач з такою поштою вже існує' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                bio: bio || null,
                location: location || null,
                position: position || null,
                age: age ? parseInt(age) : null,
                gender: gender || null,
            }
        });

        return NextResponse.json({ message: 'Користувача успішно створено', user: { email: user.email, name: user.name } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка сервера при реєстрації' }, { status: 500 });
    }
}