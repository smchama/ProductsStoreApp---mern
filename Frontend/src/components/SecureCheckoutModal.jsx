// Force update token payload - August 2026

// src/components/CheckoutModal.jsx
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

// ✅ Point directly to your live Render backend if VITE_API_URL is missing
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
      // 1. Retrieve the authentication token from localStorage securely
      const token = localStorage.getItem("token");

      // Debug check to inspect live storage in browser console
      console.log("CheckoutModal token check:", token ? "Token exists" : "No token found");

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

      // 2. Pass the token and full live URL in the Authorization request
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Checkout & Shipping (Secure)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack as="form" onSubmit={handleCheckoutSubmit} spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Chama Mthokozisi"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Street Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>City / Town</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Gwanda"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Payment Method</FormLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
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

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            loadingText="Saving Order..."
            onClick={handleCheckoutSubmit}
          >
            Confirm Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SecureCheckoutModal;