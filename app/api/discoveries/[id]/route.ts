import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        const discovery = await prisma.discovery.findUnique({
            where: { id },
            include: {
                author: { select: { name: true } },
                comments: {
                    include: { user: { select: { name: true, image: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!discovery) {
            return NextResponse.json({ error: 'Відкриття не знайдено' }, { status: 404 });
        }

        return NextResponse.json(discovery);
    } catch (error) {
        return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Доступ заборонено. Тільки для адміністраторів.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        await prisma.discovery.delete({ where: { id } });

        return NextResponse.json({ message: 'Відкриття успішно видалено' });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 });
    }
}