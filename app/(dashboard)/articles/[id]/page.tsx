import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const ids = Array.from({ length: 10 }, (_, i) => String(i + 1));
    return ids.map((id) => ({ id }));
}

export default async function SingleArticlePage({
                                                    params,
                                                }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const postPromise = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const commentsPromise = fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);

    const [postRes, commentsRes] = await Promise.all([postPromise, commentsPromise]);

    if (!postRes.ok) {
        notFound();
    }

    const post = await postRes.json();
    const comments = await commentsRes.json();

    return (
        <div className="max-w-2xl">
            <article className="mb-10">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-green-400 bg-green-900/30 rounded-full">
          Стаття #{post.id}
        </span>
                <h1 className="text-3xl font-bold text-white mb-4 capitalize">{post.title}</h1>
                <p className="text-lg text-gray-300 leading-relaxed">{post.body}</p>
            </article>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Коментарі ({comments.length})
                </h2>
                <div className="flex flex-col gap-4">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <h3 className="font-bold text-blue-400 mb-1">{comment.email}</h3>
                            <h4 className="text-sm font-semibold text-gray-200 mb-2 capitalize">{comment.name}</h4>
                            <p className="text-gray-400 text-sm">{comment.body}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}