import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchJobs, createJob, updateJobStatus, deleteJob } from '../../../redux/slices/personalSlice';
import type { Job } from '../types';

interface JobsProps {
  isMobile?: boolean;
}

const STATUSES = ['applied', 'interview', 'offered', 'rejected'] as const;
type JobStatus = typeof STATUSES[number];

const statusColor = (status: string): 'default' | 'info' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'applied': return 'info';
    case 'interview': return 'warning';
    case 'offered': return 'success';
    case 'rejected': return 'error';
    default: return 'default';
  }
};

export default function Jobs({ isMobile = false }: JobsProps) {
  const dispatch = useAppDispatch();
  const { items: jobs, loading, error } = useAppSelector((state) => state.personal.jobs);
  const [form, setForm] = useState({ company: '', role: '', salary: '', status: 'applied' as string });

  const jobsList = useMemo(() => (Array.isArray(jobs) ? jobs : []), [jobs]);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const applied = jobsList.filter((j: Job) => j.status === 'applied').length;
  const interviews = jobsList.filter((j: Job) => j.status === 'interview').length;
  const offers = jobsList.filter((j: Job) => j.status === 'offered').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) return;

    dispatch(createJob({
      company: form.company.trim(),
      role: form.role.trim(),
      salary: form.salary.trim(),
      date: new Date().toISOString().split('T')[0],
    }));
    setForm({ company: '', role: '', salary: '', status: 'applied' });
  };

  const handleStatusChange = (id: string, status: string) => {
    dispatch(updateJobStatus({ id, status }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteJob(id));
  };

  if (loading) {
    return (
      <>
        <Header title="Job Tracker" subtitle="Loading applications..." />
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={80} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={200} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        title="Job Tracker"
        subtitle={`${jobsList.length} applied · ${interviews} interviews · ${offers} offers · Switch jobs, 2x your salary`}
      />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Applied</Typography>
                <Typography variant="h4" fontWeight={700}>{applied}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Interviews</Typography>
                <Typography variant="h4" fontWeight={700}>{interviews}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Offers</Typography>
                <Typography variant="h4" fontWeight={700}>{offers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Target</Typography>
                <Typography variant="h4" fontWeight={700}>₹50K+</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>min. next salary</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Job Form */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="➕ Add Application" />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Company name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                sx={{ flex: '1 1 200px' }}
              />
              <TextField
                size="small"
                placeholder="Role (e.g., Frontend Dev)"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                sx={{ flex: '1 1 200px' }}
              />
              <TextField
                size="small"
                placeholder="Salary (e.g., ₹60K)"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                sx={{ flex: '1 1 150px' }}
              />
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Job Table */}
        <Card>
          <CardHeader
            title="📋 Applications"
            action={<Chip label={`${jobsList.length} total`} color="info" size="small" />}
          />
          <CardContent>
            {jobsList.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h2" sx={{ mb: 1 }}>📝</Typography>
                <Typography variant="body1" color="text.secondary">
                  No applications yet. Start applying to 5 jobs per day. Your future salary depends on it.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobsList.map((job: Job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.date}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{job.company}</TableCell>
                        <TableCell>{job.role}</TableCell>
                        <TableCell>{job.salary || '—'}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={job.status}
                              onChange={(e) => handleStatusChange(job.id, e.target.value)}
                              sx={{
                                fontSize: '0.8rem',
                                '& .MuiSelect-select': { py: 0.5 },
                              }}
                            >
                              {STATUSES.map((s) => (
                                <MenuItem key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(job.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
