import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });
        }

        const resolvedParams = await params;
        const discoveryId = parseInt(resolvedParams.id);

        const userId = session.user.id;

        const discovery = await prisma.discovery.findUnique({
            where: { id: discoveryId },
            include: { favoritedBy: { select: { id: true } } }
        });

        if (!discovery) {
            return NextResponse.json({ error: 'Статтю не знайдено' }, { status: 404 });
        }

        const isAlreadyFavorited = discovery.favoritedBy.some(user => user.id === userId);

        if (isAlreadyFavorited) {
            await prisma.discovery.update({
                where: { id: discoveryId },
                data: {
                    favoritedBy: { disconnect: { id: userId } }
                }
            });
        } else {
            await prisma.discovery.update({
                where: { id: discoveryId },
                data: {
                    favoritedBy: { connect: { id: userId } }
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Favorite toggle error:", error);
        return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
    }
}