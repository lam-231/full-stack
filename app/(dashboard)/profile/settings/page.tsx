'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, MenuItem } from '@mui/material';
import Link from 'next/link';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        name: '', bio: '', location: '', position: '', age: '', gender: ''
    });
    const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile')
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setFormData({
                        name: data.name || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        position: data.position || '',
                        age: data.age?.toString() || '',
                        gender: data.gender || ''
                    });
                }
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await res.json();
        if (res.ok) {
            setStatus({ type: 'success', message: result.message });
        } else {
            setStatus({ type: 'error', message: result.error });
        }
    };

    if (isLoading) return <div className="text-white text-center mt-10">Завантаження даних...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl mt-8 border border-gray-700">
            <Link href="/profile" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mb-6 inline-block">
                &larr; Назад до профілю
            </Link>

            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Редагування профілю
            </Typography>

            {status && <Alert severity={status.type} sx={{ mb: 4 }}>{status.message}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Ім'я (нікнейм)"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined" fullWidth
                    sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        label="Вік"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        variant="outlined" fullWidth
                        sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                    />
                    <TextField
                        select
                        label="Стать"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        variant="outlined" fullWidth
                        sx={{ '.MuiSelect-select': { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                    >
                        <MenuItem value="">Не вказано</MenuItem>
                        <MenuItem value="Чоловіча">Чоловіча</MenuItem>
                        <MenuItem value="Жіноча">Жіноча</MenuItem>
                        <MenuItem value="Інше">Інше</MenuItem>
                    </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        label="Місцезнаходження"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        variant="outlined" fullWidth
                        sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                    />
                    <TextField
                        label="Роль / Посада"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        variant="outlined" fullWidth
                        sx={{ input: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                    />
                </div>

                <TextField
                    label="Про себе"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    variant="outlined" fullWidth
                    sx={{ textarea: { color: 'white' }, label: { color: '#9ca3af' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4b5563' } } }}
                />

                <Button
                    type="submit" variant="contained" size="large"
                    sx={{ backgroundColor: '#2563eb', padding: '12px 24px', '&:hover': { backgroundColor: '#1d4ed8' }, alignSelf: { xs: 'stretch', md: 'flex-start' } }}
                >
                    Зберегти зміни
                </Button>
            </Box>
        </div>
    );
}