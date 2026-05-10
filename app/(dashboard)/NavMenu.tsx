
import Link from 'next/link';
import styles from './NavMenu.module.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import NavLinks from './NavLinks';

export default async  function NavMenu() {

    const session = await getServerSession(authOptions);

    return (
        <nav className={`flex justify-between items-center w-full ${styles.menuContainer}`}>

            <NavLinks />

            <div>
                {session ? (
                    <Link
                        href="/profile"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition text-sm"
                    >
                        Мій профіль
                    </Link>
                ) : (
                    <div className="flex gap-3">
                        <Link
                            href="/api/auth/signin"
                            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition text-sm"
                        >
                            Увійти
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition text-sm"
                        >
                            Реєстрація
                        </Link>
                    </div>
                )}
            </div>

        </nav>
    );
}