'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import Link from 'next/link';

export default function SecurityPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch('/api/profile/security', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', message: data.error });
            } else {
                setStatus({ type: 'success', message: data.message });
                setOldPassword('');
                setNewPassword('');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Помилка з\'єднання з сервером' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-8 border border-gray-700">
            <Link href="/profile" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mb-6 inline-block">
                &larr; Назад до профілю
            </Link>

            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Налаштування безпеки
            </Typography>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
                Оновіть свій пароль для доступу до систем SEHub.
            </p>

            {status && (
                <Alert severity={status.type} sx={{ mb: 4 }}>
                    {status.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Поточний пароль"
                    type="password"
                    variant="outlined"
                    required
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' }, '&:hover fieldset': { borderColor: '#3b82f6' } } }}
                />

                <TextField
                    label="Новий пароль"
                    type="password"
                    variant="outlined"
                    required
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' }, '&:hover fieldset': { borderColor: '#3b82f6' } } }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                        backgroundColor: '#2563eb',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                        alignSelf: { xs: 'stretch', md: 'flex-start' }
                    }}
                >
                    {isSubmitting ? 'Оновлення...' : 'Змінити пароль'}
                </Button>
            </Box>
        </div>
    );
}