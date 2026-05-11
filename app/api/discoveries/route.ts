import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const search = request.nextUrl.searchParams.get('search') || '';
        const category = request.nextUrl.searchParams.get('category') || '';
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '6');

        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = { contains: category, mode: 'insensitive' };
        }

        const [discoveries, totalCount] = await Promise.all([
            prisma.discovery.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'desc' },
                include: {
                    author: { select: { name: true, id: true } },
                    favoritedBy: { select: { id: true } }
                }
            }),
            prisma.discovery.count({ where })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({ discoveries, totalPages });

    } catch (error) {
        console.error("GET Discoveries error:", error);
        return NextResponse.json({ error: 'Помилка отримання даних' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });
        }

        const body = await request.json();

        const newDiscovery = await prisma.discovery.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                authorId: session.user.id
            },
        });

        return NextResponse.json(newDiscovery, { status: 201 });
    } catch (error) {
        console.error("POST Discovery error:", error);
        return NextResponse.json({ error: 'Помилка створення запису' }, { status: 500 });
    }
}