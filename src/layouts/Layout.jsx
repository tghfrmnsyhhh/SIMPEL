import React, { useState, useEffect } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const sidebarWidth = !isMobile ? (isSidebarOpen ? 250 : 80) : 0;

  return (
    <Box overflowX="hidden" w="100%" minH="100vh" bg="#E3E9FB">
      {/* Sidebar */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={`${sidebarWidth}px`}
        zIndex="overlay"
        transition="width 0.3s ease"
        bg="transparent"
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      </Box>

      {/* Wrapper Kanan */}
      <Box
        ml={{ base: 0, md: `${sidebarWidth}px` }}
        transition="margin-left 0.3s ease"
        minH="100vh"
        overflowX="hidden"
      >
        {/* Navbar */}
        <Box
          position="sticky"
          top="0"
          zIndex="sticky"
          bg="white"
          boxShadow="sm"
        >
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </Box>

        {/* Main Content */}
        <Box
          as="main"
          px={{ base: 4, md: 6 }}
          py={4}
          h="calc(100vh - 72px)"
          overflowY="auto"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
