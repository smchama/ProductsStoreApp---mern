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
    category: "", // Added category to initial state
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
    <Container maxW="container.sm" py={12}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={2}>
          Create New Product
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            {/* Category Dropdown Selection */}
            <Select
              placeholder="Select Category"
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
            
              {/* You can add more categories here as needed */}
            </Select>

            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;