import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack, SxProps, Theme } from '@mui/system';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NavItem from './NavItem';

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const activeStyle: SxProps<Theme> = {
    bgcolor: 'var(--NavItem-active-background)', // active background color
    // bgcolor: 'red',
    color: 'var(--NavItem-active-color)',
  };

  const textStyle: SxProps<Theme> = {
    fontSize: '1rem', // equivalent to 14px
    fontWeight: 500,
    lineHeight: '28px',
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        '& .MuiDrawer-paper': {
          width: 'var(--SideNav-width)',
          maxWidth: '400px',
        },
      }}
    >
      {/* container */}
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
          backgroundColor: 'var(--SideNav-background)',
        }}
      >
        {/* ShiftHarmony */}
        <Stack spacing={2} sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              p: '4px 12px',
            }}
          >
            <Box sx={{ flex: '1 1 auto', justifyContent: 'center' }}>
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
          </Box>
        </Stack>

        <Divider sx={{ borderColor: 'var(--border-color)' }} />

        {/* Navigation */}
        <Box
          role="presentation"
          onClick={onClose}
          onKeyDown={onClose}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            p: '15px 8px',
          }}
        >
          <Stack
            component="ul"
            spacing={1}
            sx={{ listStyle: 'none', m: 0, p: 0 }}
          >
            <NavItem title={'home'} toURL={'/'} />
            <NavItem
              title={'pref_management(nurse)'}
              toURL={'/preference-management'}
            />
            <NavItem
              title={'req_management(supervisor)'}
              toURL={'/request-management'}
            />
            <NavItem
              title={'user-management(admin)'}
              toURL={'/user-management'}
            />
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default SideNav;