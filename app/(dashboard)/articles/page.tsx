'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => res.json());

export default function ArticlesPage() {
    const { data: session } = useSession();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: categories = [] } = useSWR('/api/categories', fetcher);

    const queryParams = new URLSearchParams({
        search: debouncedSearch,
        category,
        page: page.toString(),
        limit: '6'
    }).toString();

    const { data, error, isLoading, mutate } = useSWR(`/api/discoveries?${queryParams}`, fetcher);

    const discoveries = data?.discoveries || [];
    const totalPages = data?.totalPages || 1;

    const toggleFavorite = async (id: number) => {
        if (!session) {
            alert("Тільки авторизовані вчені можуть додавати в улюблене!");
            return;
        }

        try {
            await fetch(`/api/discoveries/${id}/favorite`, { method: 'POST' });

            mutate();
        } catch (error) {
            console.error("Помилка при додаванні в улюблене:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Точно видалити цей запис назавжди?')) {
            try {
                const res = await fetch(`/api/discoveries/${id}`, { method: 'DELETE' });

                if (res.ok) {
                    mutate();
                } else {
                    alert("Помилка видалення. Перевірте, чи ви дійсно Адміністратор.");
                }
            } catch (error) {
                console.error('Помилка DELETE:', error);
            }
        }
    };

    if (isLoading) return <div className="text-center text-white mt-10 text-xl">Отримання даних з орбіти... </div>;
    if (error) return <div className="text-center text-red-500 mt-10">Помилка зв'язку з базою SEHub.</div>;
    if (!Array.isArray(discoveries))  return <div className="text-center text-red-500 mt-10">Отримані невалідні данні</div>;
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

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Пошук відкриттів за назвою або описом..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition shadow-sm"
                />

                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition min-w-[200px]"
                >
                    <option value="">Всі категорії</option>
                    {categories.map((cat: string) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {discoveries.length === 0 ? (
                <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-xl border border-gray-700">
                    Не знайдено відкриттів за цими параметрами.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {discoveries.map((d: any) => {
                        const isAdmin = session?.user?.role === 'ADMIN';
                        const isFavorited = d.favoritedBy?.some((f: any) => f.id === session?.user?.id);

                        return (
                            <div key={d.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col h-full relative group">

                                <button
                                    onClick={() => toggleFavorite(d.id)}
                                    className={`absolute top-4 right-4 text-2xl transition hover:scale-110 ${isFavorited ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                                    title="Додати в улюблене"
                                >
                                    {isFavorited ? '❤️' : '🤍'}
                                </button>

                                <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
                                    {d.category}
                                </span>

                                <h2 className="text-xl font-bold text-white mb-2 pr-8">{d.title}</h2>

                                <div className="text-xs text-gray-500 mb-4 flex justify-between items-center border-b border-gray-700 pb-2">
                                    <span>Вчений: <span className="text-gray-300">{d.author?.name || 'Невідомий'}</span></span>
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-300 hover:underline font-bold">
                                            Видалити
                                        </button>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{d.description}</p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                                    <Link
                                        href={`/articles/${d.id}`}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                                    >
                                        Детальніше &rarr;
                                    </Link>
                                    <span className="text-gray-600 text-xs">
                                        {new Date(d.date).toLocaleDateString('uk-UA')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                    >
                        &larr; Назад
                    </button>
                    <span className="text-gray-400 font-medium">
                        Сторінка {page} з {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                    >
                        Вперед &rarr;
                    </button>
                </div>
            )}

        </div>
    );
}