import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const uniqueCategories = await prisma.discovery.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });

        const categoriesList = uniqueCategories
            .map(item => item.category)
            .filter(Boolean);

        return NextResponse.json(categoriesList);
    } catch (error) {
        console.error("GET Categories error:", error);
        return NextResponse.json({ error: 'Помилка отримання категорій' }, { status: 500 });
    }
}