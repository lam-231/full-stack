'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ArticleDetailPage() {
    const params = useParams();
    const id = params.id;
    const { data: session } = useSession();

    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: discovery, error, isLoading, mutate } = useSWR(
        id ? `/api/discoveries/${id}` : null,
        fetcher
    );

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/discoveries/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText }),
            });

            if (res.ok) {
                setCommentText('');
                mutate();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Сталася помилка при відправці.');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Помилка мережі. Перевірте з\'єднання.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteComment = async (commentId: string) => {
        if (confirm('Точно видалити цей коментар?')) {
            try {
                const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });

                if (res.ok) {
                    mutate();
                } else {
                    alert('Помилка видалення. Перевірте свої права доступу.');
                }
            } catch (error) {
                console.error('Помилка DELETE:', error);
            }
        }
    };
    if (isLoading) return <div className="text-center text-white mt-10 text-xl">Розшифровка сигналу...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Помилка зв'язку з базою.</div>;
    if (!discovery || discovery.error) return <div className="text-center text-white mt-10 text-xl">Запис не знайдено</div>;

    return (
        <div className="max-w-3xl mx-auto mt-4 md:mt-8 mb-10">

            <div className="p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">                <Link href="/articles" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mb-6 inline-block">
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

            <div className="mt-8 p-6 md:p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Коментарі ({discovery.comments?.length || 0})</h3>

                {session?.user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Поділіться своїми думками щодо цього відкриття..."
                            className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition resize-none h-24 mb-3"
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !commentText.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50"
                            >
                                {isSubmitting ? 'Відправка...' : 'Залишити коментар'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-8 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center text-gray-400">
                        Щоб залишити коментар, будь ласка, увійдіть у систему.
                    </div>
                )}
                <div className="space-y-4">
                    {discovery.comments?.length === 0 ? (
                        <p className="text-gray-500 text-center">Тут поки що порожньо. Станьте першим!</p>
                    ) : (
                        discovery.comments?.map((comment: any) => {
                            const isAdmin = session?.user?.role === 'ADMIN';

                            return (
                                <div key={comment.id} className="p-4 bg-gray-900 rounded-xl border border-gray-800 relative group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-200">
                                            {comment.user?.name || 'Анонім'}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString('uk-UA', {
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-red-500 hover:text-red-400 text-xs font-bold transition"
                                                    title="Видалити коментар"
                                                >
                                                    Видалити
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap text-sm pr-10">{comment.text}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>

    );

}