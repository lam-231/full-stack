'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ArticleDetailPage() {
    const params = useParams();
    const id = params.id;

    const { data: discovery, error, isLoading } = useSWR(
        id ? `/api/discoveries/${id}` : null,
        fetcher
    );

    if (isLoading) return <div className="text-center text-white mt-10 text-xl">Розшифровка сигналу...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Помилка зв'язку з базою.</div>;
    if (!discovery || discovery.error) return <div className="text-center text-white mt-10 text-xl">Запис не знайдено</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-4 md:mt-8 border border-gray-700">
            <Link href="/articles" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mb-6 inline-block">
                &larr; Повернутися до журналу
            </Link>

            <div className="mb-8 border-b border-gray-700 pb-6">
        <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
          {discovery.category}
        </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {discovery.title}
                </h1>
                <p className="text-gray-400 text-sm">
                    Дата запису: {new Date(discovery.date).toLocaleDateString('uk-UA')}
                </p>
            </div>

            <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {discovery.description}
            </div>
        </div>
    );
}