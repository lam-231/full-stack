import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const discoveries = await prisma.discovery.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(discoveries);
    } catch (error) {
        return NextResponse.json({ error: 'Помилка отримання даних' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newDiscovery = await prisma.discovery.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
            },
        });

        return NextResponse.json(newDiscovery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка створення запису' }, { status: 500 });
    }
}