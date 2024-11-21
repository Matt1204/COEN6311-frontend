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
          flexDirection: 'column',
          // position: 'relative', !!!
          // minHeight: '100%',

          minHeight: '100vh', // Ensure the layout occupies full viewport height
          height: '100vh',
          maxHeight: '100vh',
        }}
      >
        <CssBaseline />
        {/* Main Content Section */}
        <Box
          sx={{
            display: 'flex',
            flex: '1 0 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
            overflow: 'hidden',

            minHeight: '100vh', // Ensure the layout occupies full viewport height
            height: '100vh',
            maxHeight: '100vh',
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
              // backgroundColor: 'grey', // Background color of container
              overflow: 'hidden',
              // overflow: 'auto', // Allows scrolling within the main content area if content exceeds its container size
              // height: 'calc(100vh - var(--TopNav-height))', // Height calculation to ensure it does not exceed viewport minus top navigation height
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
{
  /* <Container
              maxWidth="xl"
              sx={{
                flexGrow: 1, // Ensure container grows to fill space
                padding: '4px', // Padding for top and bottom
                // backgroundColor: 'grey', // Background color of container
                // minHeight: 'calc(100vh - 64px)', // Ensure minimum height occupies full view minus top nav
              }}
              id="content-container"
            >
              
            </Container> */
}
