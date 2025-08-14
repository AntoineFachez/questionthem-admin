// app/dashboard/page.js
'use client';

import React from 'react';
import { Box } from '@mui/material';
import FirestoreDatabaseOverview from './FirestoreDatabaseOverview';

export default function Dashboard() {
  return (
    <>
      <FirestoreDatabaseOverview />
    </>
  );
}
