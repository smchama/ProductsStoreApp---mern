// src/pages/CreatePage.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import useProductStore from "../store/product.js";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const { createProduct } = useProductStore();
  const toast = useToast();

  const handleAddProduct = async () => {
    const result = await createProduct(newProduct);

    if (result.success) {
      toast({
        title: "Product Created",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear form after success
      setNewProduct({ name: "", price: "", image: "", category: "" });
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }}>
      <VStack spacing={6}>
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} textAlign="center" mb={2}>
          Create New Product
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={{ base: 4, md: 6 }}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              size="lg"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <Input
              placeholder="Price"
              name="price"
              type="number"
              size="lg"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <Input
              placeholder="Image URL"
              name="image"
              size="lg"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            {/* Category Dropdown Selection */}
            <Select
              placeholder="Select Category"
              size="lg"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            >
              <option value="electronics">Electronics</option>
              <option value="watches">Watches</option>
              <option value="accessories">Accessories</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="footware">Footware</option>
              <option value="bags-wallets">Bags-Wallets</option>
              <option value="home goods">Home Goods</option>
            </Select>

            <Button colorScheme="blue" size="lg" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;