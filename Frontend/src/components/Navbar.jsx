// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Container,
  Flex,
  Text,
  HStack,
  Button,
  IconButton,
  useColorMode,
  Box,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { FiPlusSquare, FiSun, FiMoon, FiShoppingCart, FiUser, FiPackage } from "react-icons/fi";
import useCartStore from "../store/cart.js";
import useAuthStore from "../store/auth.js";
import CartDrawer from "./CartDrawer.jsx";
import AuthModal from "./AuthModal.jsx";
import MyOrdersModal from "./MyOrdersModal.jsx"; // 👈 Added tracking modal

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); // 👈 State for My Orders Modal
  
  const cart = useCartStore((state) => state.cart);
  const { user, logout } = useAuthStore();

  // Calculate total item count for the badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container maxW="1140px" px={4}>
      <Flex
        py={{ base: 3, md: 4 }}
        alignItems="center"
        justifyContent="space-between"
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
      >
        {/* Logo / Title */}
        <Text
          fontSize={{ base: "20px", sm: "24px", md: "28px" }}
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
        >
          <NavLink to="/" style={{ textDecoration: "none" }}>
            Chamza Products Store
          </NavLink>
        </Text>

        {/* Navigation Links + Buttons */}
        <HStack 
          spacing={{ base: 2, sm: 4 }} 
          alignItems="center" 
          flexWrap="wrap" 
          justifyContent="center"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "dodgerblue" : (colorMode === "dark" ? "white" : "black"),
              textDecoration: "none",
              fontSize: "14px",
            })}
          >
            Home
          </NavLink>

          {/* Create Product Button - Admin Only */}
          {user?.role === "admin" && (
            <NavLink to="/create">
              <Button
                leftIcon={<FiPlusSquare />}
                colorScheme="blue"
                size="sm"
              >
                Create
              </Button>
            </NavLink>
          )}

          {/* My Orders Button - Logged in Customers */}
          {user && (
            <Button
              leftIcon={<FiPackage />}
              colorScheme="teal"
              variant="outline"
              size="sm"
              onClick={() => setIsOrdersOpen(true)}
            >
              My Orders
            </Button>
          )}

          {/* Shopping Cart Button with Badge */}
          <Box position="relative">
            <Button
              leftIcon={<FiShoppingCart />}
              colorScheme="teal"
              size="sm"
              onClick={() => setIsCartOpen(true)}
            >
              Cart
            </Button>
            {totalItems > 0 && (
              <Badge
                colorScheme="red"
                rounded="full"
                position="absolute"
                top="-2"
                right="-2"
                px={2}
                fontSize="xs"
              >
                {totalItems}
              </Badge>
            )}
          </Box>

          {/* User Authentication Menu / Button */}
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <HStack spacing={1}>
                  <Avatar size={"sm"} name={user.name} />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem isDisabled fontWeight="bold">
                  {user.name}
                </MenuItem>
                {user.role === "admin" && (
                  <MenuItem as={RouterLink} to={"/admin/orders"}>
                    Admin Orders
                  </MenuItem>
                )}
                <MenuItem onClick={logout} color="red.500">
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              leftIcon={<FiUser />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </Button>
          )}

          {/* Toggle Light/Dark Mode Button */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            size="sm"
            colorScheme={colorMode === "light" ? "purple" : "orange"}
          />
        </HStack>
      </Flex>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal Component */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* My Orders Tracking Modal Component */}
      <MyOrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
    </Container>
  );
};

export default Navbar;