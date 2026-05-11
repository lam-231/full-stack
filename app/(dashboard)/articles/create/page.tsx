'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';



export default function CreateArticlePage() {
    const router = useRouter();

    const { status } = useSession();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/discoveries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/articles');
            }
        } catch (error) {
            console.error('Помилка створення:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return <div className="text-center text-white mt-10 text-xl">Перевірка доступу...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-4 md:mt-8 border border-gray-700">
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Нове відкриття
            </Typography>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
                Додайте новий запис до бортового журналу SEHub. Дані будуть збережені у базу даних.
            </p>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <TextField
                    label="Заголовок"
                    variant="outlined"
                    required
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' }, '&:hover fieldset': { borderColor: '#3b82f6' } } }}
                />

                <TextField
                    label="Категорія (наприклад: Планети, Місії, Зорі)"
                    variant="outlined"
                    required
                    fullWidth
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' }, '&:hover fieldset': { borderColor: '#3b82f6' } } }}
                />

                <TextField
                    label="Опис відкриття"
                    variant="outlined"
                    required
                    multiline
                    rows={6}
                    fullWidth
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    sx={{ textarea: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' }, '&:hover fieldset': { borderColor: '#3b82f6' } } }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                        backgroundColor: '#2563eb',
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                        alignSelf: { xs: 'stretch', md: 'flex-start' }
                    }}
                >
                    {isSubmitting ? 'Збереження...' : 'Опублікувати запис'}
                </Button>
            </Box>
        </div>
    );
}