import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Доступ заборонено. Тільки для модераторів.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const commentId = resolvedParams.id;

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ error: 'Помилка при видаленні коментаря' }, { status: 500 });
    }
}