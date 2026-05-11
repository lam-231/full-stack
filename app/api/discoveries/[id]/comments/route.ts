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

        const body = await request.json();
        if (!body.text || body.text.trim() === '') {
            return NextResponse.json({ error: 'Коментар не може бути порожнім' }, { status: 400 });
        }

        const resolvedParams = await params;
        const discoveryId = parseInt(resolvedParams.id);
        const userId = session.user.id;

        const newComment = await prisma.comment.create({
            data: {
                text: body.text,
                discoveryId,
                userId
            }
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Comment create error:", error);
        return NextResponse.json({ error: 'Помилка створення коментаря' }, { status: 500 });
    }
}