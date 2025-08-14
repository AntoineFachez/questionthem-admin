'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFirestoreData } from '../../context/FirestoreDataContext'; // Corrected the path to be a relative path
import { useUser } from '../../context/UserContext'; // Corrected the path to be a relative path
import { firebaseConfig } from '../api/apiConfig';

export default function FirestoreDatabaseOverview() {
  const theme = useTheme();
  const { dbOverview, loading, error } = useFirestoreData();
  const { user } = useUser();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h5" color="text.primary">
          Loading database overview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h5" color="error.main">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 4,
        fontFamily: theme.typography.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper sx={{ maxWidth: 'lg', width: '100%', p: 3, overflow: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            color: 'primary.main',
          }}
        >
          Firestore Database Overview
        </Typography>
        <TableContainer>
          <Table sx={{ width: '100%', height: '100%', minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell scope="col">Collection Name</TableCell>
                <TableCell scope="col">Document Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dbOverview.length > 0 ? (
                dbOverview.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.docCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                    No collections found or configured.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            mt: 3,
            fontSize: '0.875rem',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          <Typography>Project ID: {firebaseConfig.projectId}</Typography>
          <Typography>
            Authentication Status:{' '}
            {user ? `Authenticated (UID: ${user.uid})` : 'Not Authenticated'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
