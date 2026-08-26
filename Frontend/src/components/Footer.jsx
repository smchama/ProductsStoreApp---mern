// src/components/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Stack,
  HStack,
  SimpleGrid,
  Text,
  VisuallyHidden,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaWhatsapp, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const SocialButton = ({ children, label, href }) => {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={10}
      h={10}
      cursor={"pointer"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Box>
  );
};

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={20}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container as={Stack} maxW={"1140px"} py={10}>
        <SimpleGrid
          templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr" }}
          spacing={8}
        >
          {/* Column 1: Marketing / About */}
          <Stack spacing={6}>
            <Box>
              <Text
                fontSize={{ base: "18px", md: "20px" }}
                fontWeight={"bold"}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
                textTransform="uppercase"
              >
                Chamza Products Store
              </Text>
            </Box>
            <Text fontSize={"sm"}>
              Your trusted online destination for quality products, electronics, accessories, 
              and daily essentials. Fast, reliable service delivered right to your doorstep.
            </Text>
            <Text fontSize={"xs"} color={useColorModeValue("gray.500", "gray.400")}>
              © {new Date().getFullYear()} Chamza Products Store. All rights reserved.
            </Text>
          </Stack>

          {/* Column 2: Contact & Address */}
          <Stack align={"flex-start"}>
            <Text fontWeight={"bold"} fontSize={"lg"} mb={2}>
              Visit & Contact
            </Text>
            <HStack spacing={2} fontSize={"sm"} align="flex-start">
              <Box mt={1}><FaMapMarkerAlt color="dodgerblue" /></Box>
              <Text>Gwanda, Matabeleland South, Zimbabwe</Text>
            </HStack>
            <HStack spacing={2} fontSize={"sm"}>
              <FaPhone color="dodgerblue" />
              <Text>+263 77 000 0000</Text>
            </HStack>
            <HStack spacing={2} fontSize={"sm"}>
              <FaEnvelope color="dodgerblue" />
              <Text wordBreak="break-all">support@chamzaproducts.com</Text>
            </HStack>
          </Stack>

          {/* Column 3: Social Links */}
          <Stack align={"flex-start"}>
            <Text fontWeight={"bold"} fontSize={"lg"} mb={2}>
              Connect With Us
            </Text>
            <Text fontSize={"sm"} mb={1}>
              Chat with us or follow our updates online:
            </Text>
            <Stack direction={"row"} spacing={4}>
              {/* WhatsApp Link */}
              <SocialButton
                label={"WhatsApp"}
                href={"https://wa.me/263770000000?text=Hello%20Chamza%20Products,%20I%20would%20like%20to%20inquire%20about..."}
              >
                <FaWhatsapp size="20px" color="#25D366" />
              </SocialButton>

              {/* Facebook Link */}
              <SocialButton
                label={"Facebook"}
                href={"https://facebook.com/your-page-name"}
              >
                <FaFacebook size="20px" color="#1877F2" />
              </SocialButton>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer;