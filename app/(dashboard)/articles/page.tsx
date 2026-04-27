export default async function ArticlesPage() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
        throw new Error('Помилка при завантаженні даних');
    }

    const posts: any[] = await response.json();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Усі статті</h1>

            <div className="flex flex-col gap-4">
                {posts.slice(0, 10).map((post) => (
                    <article key={post.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2 capitalize">{post.title}</h2>
                        <p className="text-gray-300">{post.body}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}