import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function Home() {
    const session = await getServerSession(authOptions);

    const [discoveriesCount, usersCount, commentsCount, latestDiscoveries] = await Promise.all([
        prisma.discovery.count(),
        prisma.user.count(),
        prisma.comment.count(),
        prisma.discovery.findMany({
            take: 3,
            orderBy: { date: 'desc' },
            include: { author: { select: { name: true } } }
        })
    ]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">

            <main className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-10 md:mt-16 mb-12">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                    {process.env.NEXT_PUBLIC_APP_NAME || "SEHub"}
                </h1>
                <p className="max-w-2xl mx-auto mb-10 text-xl md:text-2xl text-gray-300 leading-relaxed">
                    Ваш особистий бортовий журнал для дослідження Всесвіту. Долучайтесь до закритої бази знань.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    {session ? (
                        <Link
                            href="/articles"
                            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/30 text-lg"
                        >
                            Перейти до бортового журналу &rarr;
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/30 text-lg"
                            >
                                Приєднатися до екіпажу
                            </Link>
                            <Link
                                href="/api/auth/signin"
                                className="px-8 py-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-full font-bold hover:bg-gray-700 hover:text-white transition text-lg"
                            >
                                Увійти в систему
                            </Link>
                        </>
                    )}
                </div>
            </main>

            <section className="border-y border-gray-800 bg-gray-900/50 py-12">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 px-6">
                    <div className="text-center">
                        <span className="block text-5xl font-black text-blue-400 mb-2">{discoveriesCount}</span>
                        <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Записів у базі</span>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-800"></div>
                    <div className="text-center">
                        <span className="block text-5xl font-black text-purple-400 mb-2">{usersCount}</span>
                        <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Дослідників</span>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-800"></div>
                    <div className="text-center">
                        <span className="block text-5xl font-black text-green-400 mb-2">{commentsCount}</span>
                        <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Обговорень</span>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto w-full py-16 px-6">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-bold text-white">Останні відкриття</h2>
                    <Link href="/articles" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                        Дивитись усі &rarr;
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {latestDiscoveries.map((discovery) => (
                        <Link href={`/articles/${discovery.id}`} key={discovery.id} className="group h-full">
                            <article className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition shadow-lg h-full flex flex-col">
                                <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-4">
                                    {discovery.category}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                                    {discovery.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                                    {discovery.description}
                                </p>
                                <div className="text-xs text-gray-500 flex justify-between items-center border-t border-gray-700 pt-4">
                                    <span>Вчений: {discovery.author?.name || 'Анонім'}</span>
                                    <span>{new Date(discovery.date).toLocaleDateString('uk-UA')}</span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            <footer className="mt-auto py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "SEHub"}. Всі права захищено.</p>
            </footer>
        </div>
    );
}