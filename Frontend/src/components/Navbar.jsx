// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../store/cart.js";
import CartDrawer from "./CartDrawer";
import MyOrdersModal from "./MyOrdersModal"; // 👈 1. Import your tracking modal

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  // State for Cart Drawer and My Orders Modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); // 👈 2. State for Orders modal

  // Check if user is logged in (e.g., checking for token in localStorage)
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // optional if you store user role

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box bg={useColorModeValue("white", "gray.900")} px={4} borderBottomWidth="1px" boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="between" maxW="container.xl" mx="auto">
        
        {/* Brand / Logo */}
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          🛍️ MyStore
        </Text>

        {/* Navigation Actions */}
        <HStack spacing={4}>
          {/* Dark / Light mode toggle */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="md"
            variant="ghost"
          />

          {/* Cart Button */}
          <Button onClick={() => setIsCartOpen(true)} colorScheme="blue" variant="outline" size="sm">
            Cart ({totalCartItems})
          </Button>

          {/* Conditional Auth & Orders Links */}
          {token ? (
            <>
              {/* 👈 3. My Orders Button for logged-in customers */}
              <Button onClick={() => setIsOrdersOpen(true)} colorScheme="teal" variant="ghost" size="sm">
                My Orders
              </Button>

              {userRole === "admin" && (
                <Button as={Link} to="/admin" colorScheme="purple" size="sm">
                  Admin Dashboard
                </Button>
              )}

              <Button onClick={handleLogout} colorScheme="red" variant="solid" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <HStack spacing={2}>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={Link} to="/signup" colorScheme="blue" size="sm">
                Sign Up
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 👈 4. Render My Orders Tracking Modal */}
      <MyOrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
    </Box>
  );
};

export default Navbar;