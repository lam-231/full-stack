'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ email: '', name: '', password: '' });
    const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: 'Особову справу створено! Перенаправлення на вхід...' });
                setTimeout(() => {
                    router.push('/api/auth/signin');
                }, 2000);
            } else {
                setStatus({ type: 'error', message: data.error });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Помилка з\'єднання з сервером' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-12 border border-gray-700">
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                Реєстрація екіпажу
            </Typography>

            {status && (
                <Alert severity={status.type} sx={{ mb: 4 }}>
                    {status.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Ім'я (Позивний)"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                />

                <TextField
                    label="Електронна пошта"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                />

                <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ backgroundColor: '#2563eb', padding: '12px', fontSize: '1rem', '&:hover': { backgroundColor: '#1d4ed8' } }}
                >
                    {isSubmitting ? 'Створення...' : 'Зареєструватись'}
                </Button>

                <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center', mt: 2 }}>
                    Вже маєте доступ?{' '}
                    <Link href="/api/auth/signin" className="text-blue-400 hover:text-blue-300">
                        Увійти
                    </Link>
                </Typography>
            </Box>
        </div>
    );
}