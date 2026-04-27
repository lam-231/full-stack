import ArticlesNav from './ArticlesNav';

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <ArticlesNav />
            {children}
        </section>
    );
}