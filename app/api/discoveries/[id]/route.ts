import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
    try {
        const params = await context.params;
        const id = parseInt(params.id);

        const discovery = await prisma.discovery.findUnique({ where: { id } });

        if (!discovery) {
            return NextResponse.json({ error: 'Відкриття не знайдено' }, { status: 404 });
        }

        return NextResponse.json(discovery);
    } catch (error) {
        return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: any) {
    try {
        const params = await context.params;
        const id = parseInt(params.id);
        const body = await request.json();

        const updatedDiscovery = await prisma.discovery.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
            },
        });

        return NextResponse.json(updatedDiscovery);
    } catch (error) {
        return NextResponse.json({ error: 'Помилка оновлення' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: any) {
    try {
        const params = await context.params;
        const id = parseInt(params.id);

        await prisma.discovery.delete({ where: { id } });

        return NextResponse.json({ message: 'Відкриття успішно видалено' });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 });
    }
}