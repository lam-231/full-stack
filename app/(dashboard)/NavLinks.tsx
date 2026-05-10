'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavMenu.module.css';

export default function NavLinks() {
    const pathname = usePathname();

    const links = [
        { href: '/articles', label: 'Статті' },
        { href: '/profile/settings', label: 'Налаштування' },
        { href: '/profile/security', label: 'Безпека' },
    ];

    return (
        <div className="flex gap-4 items-center">
            {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}