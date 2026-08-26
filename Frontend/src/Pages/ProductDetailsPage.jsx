// src/pages/ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBackIcon, AddIcon } from "@chakra-ui/icons";
import useProductStore from "../store/product.js";
import useCartStore from "../store/cart.js";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useProductStore((state) => state.fetchProduct);
  const addToCart = useCartStore((state) => state.addToCart);

  const bgColor = useColorModeValue("white", "gray.800");
  const badgeBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const { success, data } = await fetchProduct(id);
      if (success) {
        setProduct(data);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch product details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    };
    getProduct();
  }, [id, fetchProduct, toast]);

  if (loading) {
    return (
      <Container maxW={"container.xl"} py={12} textAlign="center">
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxW={"container.xl"} py={12} textAlign="center">
        <Heading size="lg" mb={4}>Product not found</Heading>
        <Button onClick={() => navigate("/")} colorScheme="blue">
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW={"container.xl"} py={8} px={{ base: 4, md: 8 }}>
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        mb={6}
        onClick={() => navigate("/")}
        size={{ base: "sm", md: "md" }}
      >
        Back to Products
      </Button>

      <Box
        bg={bgColor}
        shadow="xl"
        rounded="lg"
        overflow="hidden"
        p={{ base: 5, md: 10 }}
        display={{ base: "block", md: "flex" }}
        gap={10}
      >
        {/* Product Image */}
        <Box w={{ base: "full", md: "450px" }} h={{ base: "300px", md: "450px" }} flexShrink={0} mb={{ base: 6, md: 0 }}>
          <Image
            src={product.image}
            alt={product.name}
            w="full"
            h="full"
            objectFit="cover"
            rounded="lg"
            fallbackSrc="https://placehold.co/600x400?text=No+Image+Available"
          />
        </Box>

        {/* Product Details Info */}
        <VStack align="start" spacing={4} flex="1" justify="center">
          {product.category && (
            <Badge px={3} py={1} bg={badgeBg} rounded="full" fontSize="sm">
              {product.category}
            </Badge>
          )}

          <Heading as="h1" size={{ base: "xl", md: "2xl" }}>
            {product.name}
          </Heading>

          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="green.500">
            ${product.price}
          </Text>

          <Text color={textColor} fontSize={{ base: "md", md: "lg" }}>
            Experience premium quality with {product.name}. Add it to your cart or explore more options in the catalog.
          </Text>

          <HStack spacing={4} pt={4} w={{ base: "full", sm: "auto" }}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
              w={{ base: "full", sm: "auto" }}
              onClick={() => {
                addToCart(product);
                toast({
                  title: "Added to Cart",
                  description: `${product.name} added to your cart.`,
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Add to Cart
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default ProductDetailsPage;