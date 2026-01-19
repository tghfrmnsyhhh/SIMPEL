import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import {
  Flex,
  IconButton,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Portal,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Navbar.css";
import Logo from "../assets/images/Logo.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [userName, setUserName] = useState("Pengguna");
  const [userRole, setUserRole] = useState("");
  const [userFoto, setUserFoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");
    const storedFoto = localStorage.getItem("userFoto");

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
    if (storedFoto) setUserFoto(storedFoto);

    const onStorageChange = () => {
      setUserName(localStorage.getItem("userName") || "Pengguna");
      setUserRole(localStorage.getItem("userRole") || "");
      setUserFoto(localStorage.getItem("userFoto") || null);
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const greeting = `${getGreeting()}, ${userName}!`;

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFoto");
    navigate("/login");
  };

  return (
    <Flex
      className="navbar"
      align="center"
      justify="space-between"
      w="100%"
      minH="72px"
      px={{ base: 4, md: 6 }}
      py={2.5}
      pr={4}
      position="sticky"
      top={0}
      zIndex={1100}
      bg="white"
      boxShadow="sm"
    >
      {/* Left: Hamburger */}
      <IconButton
        icon={
          <Box
            as={FiMenu}
            transition="transform 0.3s ease"
            transform={isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)"}
          />
        }
        onClick={toggleSidebar}
        variant="ghost"
        aria-label="Toggle Sidebar"
        size="md"
        mr={2}
      />

      {/* Center: Logo */}
      <Box flex="1" textAlign="center">
        <Flex align="center" justify="center" gap={2}>
          <img src={Logo} alt="Logo SIMPEL" style={{ height: "30px" }} />
          <Text
            className="navbar-title"
            fontSize={{ base: "lg", md: "xl" }}
            color="black"
            fontWeight="bold"
            fontFamily="poppins"
          >
            SIMPEL
          </Text>
        </Flex>
      </Box>

      {/* Right: Greeting & Avatar */}
      <Menu>
        <MenuButton>
          <Flex align="center" zIndex="dropdown" position="relative">
            <Box
              textAlign="right"
              mr={2}
              display={{ base: "none", md: "block" }}
            >
              <Text fontSize="sm" color="gray.600">
                {greeting}
              </Text>
              <Text fontSize="xs" color="gray.500" mt="1px">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Text>
            </Box>
            <Avatar size="sm" name={userName} src={userFoto} />
          </Flex>
        </MenuButton>
        <Portal>
          <MenuList zIndex="popover">
            <MenuItem as={Link} to="/profile">
              Profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Keluar</MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
};

export default Navbar;
