// src/components/ProductCard.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  HStack,
  IconButton,
  Button,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import useProductStore from "../store/product.js";
import { useNavigate } from "react-router-dom";

import useCartStore from "../store/cart.js"; // 👈 Import cart store
import useAuthStore from "../store/auth.js"; // 👈 Import auth store

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const textColor = useColorModeValue("gray.800", "white");
  const badgeBg = useColorModeValue("gray.100", "gray.700");
  const toast = useToast();

  // Zustand actions & state
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore(); // 👈 Get current logged-in user

  // Separate modal states for editing and deleting
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();

  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  // Local form state for editing
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);
  const [category, setCategory] = useState(product.category || "");

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  // Delete handler with confirmation close
  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    if (success) {
      onDeleteClose();
    }
  };

  // Update handler
  const handleUpdateProduct = async () => {
    const updatedProduct = { name, price, image, category };
    const { success, message } = await updateProduct(
      product._id || product.id,
      updatedProduct
    );

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    if (success) onEditClose();
  };

  return (
    <>
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={useColorModeValue("white", "gray.800")}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        w="full"
      >
        {/* Product Image with Fallback */}
        <Image
          src={product.image}
          alt={product.name}
          h={{ base: "180px", md: "48" }}
          w="full"
          objectFit="cover"
          cursor="pointer"
          onClick={() => navigate(`/product/${product._id || product.id}`)}
          fallbackSrc="https://placehold.co/600x400?text=No+Image+Available"
        />

        {/* Product Details */}
        <Box p={4} flex="1" display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            {product.category && (
              <Badge px={2} py={1} mb={2} bg={badgeBg} rounded="full" fontSize="xs">
                {product.category}
              </Badge>
            )}

            <Heading as="h3" size="md" mb={2} noOfLines={1}>
              {product.name}
            </Heading>

            <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
              ${product.price}
            </Text>
          </Box>

          {/* Actions: Admin Controls (if admin) + Add to Cart */}
          <HStack spacing={2} justifyContent="space-between" mt={2} flexWrap="wrap" gap={2}>
            {user?.role === "admin" ? (
              <HStack spacing={2}>
                <IconButton
                  aria-label="Edit product"
                  icon={<EditIcon />}
                  onClick={onEditOpen}
                  colorScheme="blue"
                  size="sm"
                />
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  onClick={onDeleteOpen}
                  colorScheme="red"
                  size="sm"
                />
              </HStack>
            ) : (
              <Box /> /* Spacer for regular users to align cart button */
            )}

            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              size="sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* --- UPDATE MODAL (Admin Only) --- */}
      {user?.role === "admin" && (
        <Modal isOpen={isEditOpen} onClose={onEditClose} size={{ base: "full", md: "md" }} scrollBehavior="inside">
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

              <FormControl mb={3}>
                <FormLabel>Category</FormLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select Category"
                >
                  <option value="electronics">Electronics</option>
                  <option value="watches">Watches</option>
                  <option value="accessories">Accessories</option>
                  <option value="clothing">Clothing</option>
                  <option value="groceries">Groceries</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="footwear">Footwear</option>
                  <option value="bags-wallets">Bags-Wallets</option>
                  <option value="home goods">Home Goods</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
                Update
              </Button>
              <Button variant="ghost" onClick={onEditClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* --- DELETE CONFIRMATION MODAL (Admin Only) --- */}
      {user?.role === "admin" && (
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered size={{ base: "xs", md: "md" }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete <Text as="span" fontWeight="bold">{product.name}</Text>? This action cannot be undone.
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="red" 
                mr={3} 
                onClick={() => handleDeleteProduct(product._id || product.id)}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProductCard;