// src/components/MyOrdersModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL || "https://products-backend-7.onrender.com";

const MyOrdersModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // ✅ Wrapped with useCallback to satisfy exhaustive-deps rule safely
  const fetchMyOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.data || data);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast({ title: "Error fetching orders", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchMyOrders();
    }
  }, [isOpen, fetchMyOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "yellow";
      case "Processing": return "blue";
      case "Delivered": return "green";
      case "Cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="85vh">
        <ModalHeader borderBottomWidth="1px">My Order History & Tracking</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4}>
          {isLoading ? (
            <VStack py={10}><Spinner size="xl" /><Text>Loading your orders...</Text></VStack>
          ) : orders.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={10}>You haven't placed any orders yet.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {orders.map((order) => {
                const orderId = order._id || order.id;
                return (
                  <Box key={orderId} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold" fontSize="sm">Order ID: #{orderId.slice(-6).toUpperCase()}</Text>
                      <Badge colorScheme={getStatusColor(order.status)} fontSize="0.9em" px={2} py={0.5} borderRadius="full">
                        {order.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" mb={3}>
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                    
                    <Divider my={2} />
                    
                    <VStack align="stretch" spacing={1} mb={2}>
                      {order.items.map((item, idx) => (
                        <HStack key={idx} justify="space-between" fontSize="sm">
                          <Text>{item.name} (x{item.quantity})</Text>
                          <Text>${(Number(item.price) * item.quantity).toFixed(2)}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    
                    <HStack justify="space-between" pt={2} borderTopWidth="1px" fontWeight="bold">
                      <Text>Total Paid:</Text>
                      <Text color="green.500">${Number(order.totalAmount).toFixed(2)}</Text>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MyOrdersModal;