import * as React from 'react';
import { useState } from 'react';
import MobileNav from './SideNav'; // Import the MobileNav component
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import TopNav_r from './TopNav_r';

export default function TopNav() {
  const [navOpen, setNavOpen] = useState(false);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      {/* container */}
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--border-color)',
          bgcolor: 'var(--topnav-background)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--TopNav-zIndex)',
        }}
      >
        {/* side-nav button */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 'var(--TopNav-height)',
            px: 2,
          }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={() => setNavOpen(true)}
              sx={{ display: { lg: 'none' }, width: '40', height: '40' }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>

          {/* Avator and Message */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TopNav_r />
          </Stack>
        </Stack>
      </Box>

      {/* Include the MobileNav component and manage its state */}
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </React.Fragment>
  );
}
