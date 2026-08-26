// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  VStack,
  SimpleGrid,
  Input,
  Select,
  HStack,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useProductStore from "../store/product.js";

const HomePage = () => {
  // Get state & actions from Zustand store
  const {
    products,
    fetchProducts,
    loading,
    currentPage,
    totalPages,
    search,
    category,
    sort,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState(search);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts({ search: value, page: 1 });
  };

  // Handle Category Filter Change
  const handleCategoryChange = (e) => {
    fetchProducts({ category: e.target.value, page: 1 });
  };

  // Handle Sorting Change
  const handleSortChange = (e) => {
    fetchProducts({ sort: e.target.value, page: 1 });
  };

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }}>
      <VStack spacing={6} w="full">
        <Text
          fontSize={{ base: "24px", md: "30px" }}
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >
          Current Available Products
        </Text>

        {/* --- SEARCH & FILTER CONTROLS BAR (Mobile Responsive) --- */}
        <Flex
          w="full"
          direction={{ base: "column", md: "row" }}
          gap={4}
          justify="space-between"
          align="stretch"
        >
          {/* Search Input */}
          <Input
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            w={{ base: "full", md: "350px" }}
          />

          {/* Filter & Sort Container */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            w={{ base: "full", md: "auto" }}
            gap={4}
          >
            {/* Category Dropdown */}
            <Select 
              value={category} 
              onChange={handleCategoryChange} 
              w={{ base: "full", sm: "200px" }}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="watches">Watches</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="footware">Footware</option>
              <option value="home goods">Home Goods</option>
              <option value="bags-wallets">Bags-Wallets</option>
              <option value="accessories">Accessories</option>
            </Select>

            {/* Sorting Dropdown */}
            <Select 
              value={sort} 
              onChange={handleSortChange} 
              w={{ base: "full", sm: "200px" }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="oldest">Oldest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </Select>
          </Flex>
        </Flex>

        {/* --- LOADING SPINNER OR PRODUCT GRID --- */}
        {loading ? (
          <Flex justify="center" align="center" py={20}>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : products && products.length > 0 ? (
          <>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 4, md: 8 }}
              w="full"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <HStack spacing={4} mt={8} justify="center" flexWrap="wrap">
                <Button
                  onClick={() => fetchProducts({ page: currentPage - 1 })}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                >
                  Previous
                </Button>

                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                  Page {currentPage} of {totalPages}
                </Text>

                <Button
                  onClick={() => fetchProducts({ page: currentPage + 1 })}
                  isDisabled={currentPage === totalPages}
                  colorScheme="blue"
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                >
                  Next
                </Button>
              </HStack>
            )}
          </>
        ) : (
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            textAlign="center"
            fontWeight="bold"
            color="gray.500"
            py={10}
          >
            No Products Found |--🤑--|{" "}
            <Link to="/create">
              <Text
                as="span"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
              >
                Create a Product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;