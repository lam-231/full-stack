export default async function FavoriteArticle({ id, delay }: { id: string; delay: number }) {
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    if (!response.ok) {
        return <div className="p-4 bg-red-900 rounded-lg text-red-200">Помилка завантаження статті {id}</div>;
    }

    const post: any = await response.json();

    return (
        <article className="p-5 bg-gray-800 rounded-lg border border-gray-600 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold">
          {post.id}
        </span>
                <h2 className="text-xl font-bold text-white capitalize">{post.title}</h2>
            </div>
            <p className="text-gray-300">{post.body}</p>
        </article>
    );
}