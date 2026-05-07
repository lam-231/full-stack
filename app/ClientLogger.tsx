'use client';

import { useEffect } from 'react';

export default function ClientLogger() {
    useEffect(() => {
        console.log("Назва додатку (NEXT_PUBLIC_APP_NAME):", process.env.NEXT_PUBLIC_APP_NAME);

        console.log("Секретний ключ (SPACE_API_SECRET):", process.env.SPACE_API_SECRET);
    }, []);

    return null;
}