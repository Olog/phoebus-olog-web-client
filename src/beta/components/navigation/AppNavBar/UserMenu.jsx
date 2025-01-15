import { Box, Button } from "@mui/material";
import { useShowLogout } from "features/authSlice";
const UserMenu = ({ user }) => {
  const { setShowLogout } = useShowLogout();

  return (
    <Box>
      <Button
        onClick={() => setShowLogout(true)}
        variant="outlined"
        color="primary"
      >
        {user.userName}
      </Button>
    </Box>
  );
};

export default UserMenu;
