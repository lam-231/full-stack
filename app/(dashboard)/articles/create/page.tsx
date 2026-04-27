'use client';

import { TextField, Button, Box, Typography } from '@mui/material';

export default function CreateArticlePage() {
    return (
        <div className="max-w-3xl mx-auto p-5 md:p-8 bg-brand-surface rounded-2xl shadow-xl mt-4 md:mt-8 border border-gray-700">

            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Створити нову статтю
            </Typography>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
                Заповніть форму нижче, щоб додати нову публікацію. Дизайн цієї форми адаптивний і побудований на компонентах Material-UI.
            </p>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <TextField
                    label="Заголовок статті"
                    variant="outlined"
                    fullWidth
                    sx={{
                        input: { color: 'white' },
                        label: { color: '#9ca3af' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#4b5563' },
                            '&:hover fieldset': { borderColor: 'var(--color-brand-primary)' },
                        }
                    }}
                />

                <TextField
                    label="Текст статті"
                    variant="outlined"
                    multiline
                    rows={6}
                    fullWidth
                    sx={{
                        textarea: { color: 'white' },
                        label: { color: '#9ca3af' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#4b5563' },
                            '&:hover fieldset': { borderColor: 'var(--color-brand-primary)' },
                        }
                    }}
                />

                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: 'var(--color-brand-primary)',
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        '&:hover': { backgroundColor: 'var(--color-brand-secondary)' },
                        alignSelf: { xs: 'stretch', md: 'flex-start' }
                    }}
                >
                    Опублікувати
                </Button>
            </Box>
        </div>
    );
}