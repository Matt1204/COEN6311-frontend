import { NavLink } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { SxProps, Theme } from '@mui/system';

interface NavItemProps {
  title: string;
  toURL: string;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  title,
  toURL,
  disabled = false,
}) => {
  // Styling for active and disabled states
  const activeStyle: SxProps<Theme> = {
    bgcolor: 'var(--NavItem-active-background)', // active background color
    color: 'var(--NavItem-active-color)',
  };

  const disabledStyle: SxProps<Theme> = {
    bgcolor: 'grey.400', // disabled background color
    color: 'text.disabled',
    pointerEvents: 'none',
  };

  // Define text styles here
  const textStyle: SxProps<Theme> = {
    fontSize: '1rem', // equivalent to 14px
    fontWeight: 600,
    lineHeight: '28px',
    color: 'var(--SideNav-color)',
  };

  return (
    <ListItem disablePadding sx={{ width: 'auto' }}>
      <ListItemButton
        component={NavLink}
        to={toURL}
        sx={theme => ({
          width: '100%',
          borderRadius: 2,
          p: '3px 20px',
          color: 'var(--SideNav-color)',
          ...(disabled ? disabledStyle : {}),
          '&.active': activeStyle,
        })}
        disabled={disabled}
      >
        <ListItemText
          primary={title}
          primaryTypographyProps={{ sx: textStyle }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
