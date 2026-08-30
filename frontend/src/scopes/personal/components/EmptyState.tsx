import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: compact ? 160 : 230,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        px: 3,
        py: compact ? 3 : 5,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          width: 48,
          height: 48,
          mb: 2,
          placeItems: 'center',
          borderRadius: 2.5,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 12px 24px -20px rgba(15, 23, 42, 0.7)',
        }}
      >
        {icon ?? <InboxOutlinedIcon fontSize="small" />}
      </Box>
      <Typography variant="subtitle1" fontWeight={750}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 440 }}>
        {description}
      </Typography>
      {action && <Box sx={{ mt: 2.25 }}>{action}</Box>}
    </Box>
  );
}
