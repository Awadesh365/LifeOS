import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600 }}>
          {description || "This module is currently under development. Please check back later for updates."}
        </Typography>
      </Paper>
    </Box>
  );
};
