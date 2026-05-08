'use client'; // SWR працює на стороні клієнта

import useSWR from 'swr';
import Link from 'next/link';

// Функція-помічник для SWR, яка виконує сам запит
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ArticlesPage() {
    // SWR автоматично робить запит, кешує його та обробляє стан завантаження
    const { data: discoveries, error, isLoading } = useSWR('/api/discoveries', fetcher);

    if (isLoading) return <div className="text-center text-white mt-10 text-xl">Отримання даних з орбіти... 🛰️</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Помилка зв'язку з базою SEHub.</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-400">Бортовий журнал</h1>
                <Link
                    href="/articles/create"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
                >
                    + Додати запис
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Перебираємо реальні дані з нашої бази */}
                {discoveries?.map((d: any) => (
                    <div key={d.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col h-full">
            <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
              {d.category}
            </span>
                        <h2 className="text-xl font-bold text-white mb-3">{d.title}</h2>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{d.description}</p>

                        <Link
                            href={`/articles/${d.id}`}
                            className="text-blue-400 hover:text-blue-300 text-sm font-semibold mt-auto"
                        >
                            Детальніше &rarr;
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}