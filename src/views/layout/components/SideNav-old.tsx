import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as React from 'react';
import NavItem from './NavItem';

export default function SideNav() {
  return (
    <Box
      sx={{
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            border: '1px solid var(--SideNav-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto', justifyContent: 'center' }}>
            {/* <h1>ShiftHarmony</h1> */}
            <Typography
              color="inherit"
              variant="h3"
              sx={{
                fontSize: '28px',
                fontWeight: '700',
                textAlign: 'center',
                p: '7px 0',
                color: '#ffff',
              }}
            >
              ShiftHarmony
            </Typography>
          </Box>
          {/* <CaretUpDownIcon /> */}
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'var(--SideNav-color)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        <Stack
          component="ul"
          spacing={1}
          sx={{ listStyle: 'none', m: 0, p: 0 }}
        >
          <NavItem title={'home'} toURL={'/home'} />
          <NavItem title={'Profile Demo'} toURL={'/profile'} />
          <NavItem title={'disabled'} toURL={'/home11'} disabled={true} />
        </Stack>
      </Box>
    </Box>
  );
}
