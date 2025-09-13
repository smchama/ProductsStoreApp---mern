import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  Input,
  useToast,   // import Chakra toast
} from "@chakra-ui/react";
import useProductStore from "../store/product.js"; // default import

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const { createProduct } = useProductStore(); // get store action
  const toast = useToast(); // initialize toast

  const handleAddProduct = async () => {
    const result = await createProduct(newProduct); // call zustand store

    if (result.success) {
      // show success toast
      toast({
        title: "Product Created",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // clear form after success
      setNewProduct({ name: "", price: "", image: "" });
    } else {
      // show error toast
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
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
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
