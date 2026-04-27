import { Suspense } from 'react';
import FavoriteArticle from './FavoriteArticle';

export default function FavoriteArticlesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Мої улюблені статті</h1>

            <div className="flex flex-col gap-6">

                <Suspense fallback={<LoadingSkeleton id="1" />}>
                    <FavoriteArticle id="1" delay={2000} />
                </Suspense>

                <Suspense fallback={<LoadingSkeleton id="16" />}>
                    <FavoriteArticle id="16" delay={4000} />
                </Suspense>

                <Suspense fallback={<LoadingSkeleton id="54" />}>
                    <FavoriteArticle id="54" delay={6000} />
                </Suspense>
            </div>
        </div>
    );
}

function LoadingSkeleton({ id }: { id: string }) {
    return (
        <div className="p-5 bg-gray-800/50 rounded-lg border border-gray-700 animate-pulse flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                <div className="h-6 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
            <span className="text-sm text-gray-500">Завантажуємо статтю {id}...</span>
        </div>
    );
}