import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/api/auth/signin');
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    });


    if (!dbUser) {
        return <div className="text-white text-center mt-10">Користувача не знайдено</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-8 border border-gray-700 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6 text-blue-400">Особова справа астронома</h1>

                <Link
                    href="/profile/settings"
                    className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                    Редагувати профіль
                </Link>
            </div>

            <div className="flex items-center gap-6 mb-8 p-6 bg-gray-900 rounded-xl border border-gray-600">
                {session.user?.image ? (
                    <img
                        src={session.user.image}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-900 border-4 border-blue-500 flex items-center justify-center text-3xl font-bold">
                        {dbUser.name?.charAt(0) || dbUser.email?.charAt(0)}
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold">{dbUser.name || 'Дослідник'}</h2>
                    <p className="text-gray-400 mb-2">{dbUser.email}</p>

                    {dbUser.position && (
                        <span className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full border border-blue-700">
                            {dbUser.position}
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-600 mb-8">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Деталі</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div>
                        <span className="text-gray-500 block text-sm">Місцезнаходження</span>
                        <span className="font-medium text-white">{dbUser.location || 'Не вказано'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-sm">Вік</span>
                        <span className="font-medium text-white">{dbUser.age ? `${dbUser.age} років` : 'Не вказано'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-sm">Стать</span>
                        <span className="font-medium text-white">{dbUser.gender || 'Не вказано'}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <span className="text-gray-500 block text-sm mb-1">Про себе</span>
                    <p className="font-medium text-white bg-gray-800 p-4 rounded-lg min-h-[80px]">
                        {dbUser.bio || 'Тут поки порожньо. Додайте інформацію про себе в налаштуваннях.'}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 border-t border-gray-700 pt-6">
                <Link
                    href="/profile/security"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-medium flex items-center justify-center"
                >
                    Налаштування безпеки
                </Link>
                <LogoutButton />
            </div>
        </div>
    );
}