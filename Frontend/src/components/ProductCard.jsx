import React, { useState } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  HStack,
  IconButton,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import useProductStore from "../store/product.js"; // Zustand store

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const toast = useToast();

  // Zustand actions
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Local form state
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);

  // Delete handler
  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Update handler
const handleUpdateProduct = async () => {
  const updatedProduct = { name, price, image }; // only the updated fields
  const { success, message } = await updateProduct(product._id || product.id, updatedProduct); // ✅ pass ID and object

  toast({
    title: success ? "Success" : "Error",
    description: message,
    status: success ? "success" : "error",
    duration: 3000,
    isClosable: true,
  });

  if (success) onClose();
};

  return (
    <>
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      >
        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
        />

        {/* Product Details */}
        <Box p={4}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>

          <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
            ${product.price}
          </Text>

          <HStack spacing={2}>
            <IconButton
              aria-label="Edit product"
              icon={<EditIcon />}
              onClick={onOpen}
              colorScheme="blue"
            />
            <IconButton
              aria-label="Delete product"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteProduct(product._id || product.id)}
              colorScheme="red"
            />
          </HStack>
        </Box>
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Product Price"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;
