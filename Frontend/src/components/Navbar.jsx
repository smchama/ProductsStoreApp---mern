import React from "react";
import {
  Container,
  Flex,
  Text,
  HStack,
  Button,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FiPlusSquare, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="1140px" px={4}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        flexDir={{ base: "column", sm: "row" }}
      >
        {/* Logo / Title */}
        <Text
          fontSize={{ base: "22px", sm: "28px" }}
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
        <HStack spacing={4} alignItems="center">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "dodgerblue" : "black",
              textDecoration: "none",
            })}
          >
            Home
          </NavLink>

          {/* Create Product Button */}
          <NavLink to="/create">
            <Button
              leftIcon={<FiPlusSquare />}
              colorScheme="blue"
              size="sm"
            >
              Create
            </Button>
          </NavLink>

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
    </Container>
  );
};

export default Navbar;
