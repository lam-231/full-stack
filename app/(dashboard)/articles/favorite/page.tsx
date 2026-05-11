import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function FavoriteArticlesPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return (
            <div className="text-center text-red-400 mt-10">
                Будь ласка, увійдіть у систему, щоб переглянути улюблені статті.
            </div>
        );
    }

    const favoriteDiscoveries = await prisma.discovery.findMany({
        where: {
            favoritedBy: {
                some: {
                    id: session.user.id
                }
            }
        },
        orderBy: { date: 'desc' },
        include: {
            author: { select: { name: true } }
        }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Мої улюблені статті</h1>

            {favoriteDiscoveries.length === 0 ? (
                <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-xl border border-gray-700">
                    Ви ще не додали жодної статті в улюблене. Перейдіть у Бортовий журнал, щоб знайти щось цікаве! 🤍
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {favoriteDiscoveries.map((discovery) => (
                        <article key={discovery.id} className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg relative group transition hover:border-blue-500">

                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full bg-red-900/50 text-red-400 uppercase tracking-wider">
                                    ❤️ В улюбленому
                                </span>
                                <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {discovery.category}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2">{discovery.title}</h2>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{discovery.description}</p>

                            <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-4 mt-auto">
                                <span className="text-gray-500">
                                    Вчений: <span className="text-gray-300">{discovery.author?.name || 'Невідомий'}</span>
                                </span>
                                <Link
                                    href={`/articles/${discovery.id}`}
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition"
                                >
                                    Читати статтю &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}