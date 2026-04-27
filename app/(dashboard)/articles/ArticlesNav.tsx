'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ArticlesNav() {
    const pathname = usePathname();

    const links = [
        { href: '/articles/favorite', label: 'Улюблені' },
        { href: '/articles/create', label: 'Створити' },
    ];

    return (
        <nav className="flex gap-4 mb-4 pb-2 border-b border-gray-600">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={isActive ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}