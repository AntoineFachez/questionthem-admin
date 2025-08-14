import React from 'react';
import { Typography } from '@mui/material';

export default function Header({ props }) {
  const { string, variant = 'h1', sx } = props;
  return (
    <Typography
      sx={sx}
      // sx={{
      //   width: '100%',
      //   height: '100%',
      //   display: 'flex',
      //   justifyContent: 'center',
      // }}
      variant={variant}
    >
      {string}
    </Typography>
  );
}
