import React from 'react';
import { Outlet } from 'react-router-dom';
import GlobalStyles from '@mui/material/GlobalStyles';

import Container from '@mui/material/Container';
import TopNav from './components/TopNav';

import { Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import SideNav from './components/SideNav-old';

const Layout = () => {
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--TopNav-height': '56px',
            '--TopNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          // minHeight: '100vh', // Ensure the layout occupies full viewport height
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <CssBaseline />

        {/* <SideNav /> */}

        {/* Main Content Section */}
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
          }}
          id="main-box"
        >
          <TopNav />
          <Box
            component="main"
            sx={{
              flexGrow: 1, // Allow content to grow and fill space
              display: 'flex', // Enable flexible layout
              flexDirection: 'column', // Stack content vertically
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                flexGrow: 1, // Ensure container grows to fill space
                padding: '4px', // Padding for top and bottom
                // backgroundColor: 'grey', // Background color of container
                // minHeight: 'calc(100vh - 64px)', // Ensure minimum height occupies full view minus top nav
              }}
              id="content-container"
            >
              <Outlet />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
