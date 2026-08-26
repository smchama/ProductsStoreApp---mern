// src/components/SecureCheckoutModal.jsx
import React, { useState } from "react";
import {
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
  Select,
  VStack,
  Text,
  useToast,
  Divider,
} from "@chakra-ui/react";
import useCartStore from "../store/cart.js";

const API_URL = import.meta.env.VITE_API_URL || "https://products-backend-7.onrender.com";

const SecureCheckoutModal = ({ isOpen, onClose, totalAmount }) => {
  const { cart, clearCart } = useCartStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    paymentMethod: "cod",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.city) {
      toast({
        title: "Missing fields",
        description: "Please fill in all shipping details.",
        status: "error", 
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in to place an order.");
      }

      const orderPayload = {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        items: cart.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: totalAmount,
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order ID: ${data.data._id.slice(-6).toUpperCase()}. Saved to database!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      clearCart();
      onClose();
      setFormData({ fullName: "", address: "", city: "", paymentMethod: "cod" });
    } catch (error) {
      console.error("Checkout error caught:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={{ base: "full", md: "lg" }} 
      isCentered 
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {/* Restrict maximum height on mobile and enable flex column layout */}
      <ModalContent display="flex" flexDirection="column" maxH={{ base: "85vh", md: "85vh" }} my="auto">
        <ModalHeader flexShrink={0} borderBottomWidth="1px">Checkout & Shipping (Secure)</ModalHeader>
        <ModalCloseButton zIndex="10" />
        
        {/* Scrollable container allowing users to scroll freely up and down */}
        <ModalBody overflowY="auto" flex="1" px={{ base: 4, md: 6 }} py={4}>
          <VStack as="form" id="checkout-form" onSubmit={handleCheckoutSubmit} spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Chama Mthokozisi"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Street Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>City / Town</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Gwanda"
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Payment Method</FormLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                size="lg"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit / Debit Card (Simulated)</option>
                <option value="mobile">Mobile Money (EcoCash / InnBucks)</option>
              </Select>
            </FormControl>

            <Divider my={2} />

            <VStack align="stretch" spacing={1} bg="gray.50" _dark={{ bg: "gray.700" }} p={3} rounded="md">
              <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.300" }}>
                Items in Cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                Total Amount Due: ${totalAmount.toFixed(2)}
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        {/* Footer stays neatly pinned at the bottom of the modal card */}
        <ModalFooter flexShrink={0} borderTopWidth="1px" bg="white" _dark={{ bg: "gray.800" }} py={3}>
          <Button variant="ghost" mr={3} onClick={onClose} size="lg">
            Cancel
          </Button>
          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            loadingText="Saving Order..."
            onClick={handleCheckoutSubmit}
            size="lg"
            flex="1"
          >
            Confirm Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SecureCheckoutModal;