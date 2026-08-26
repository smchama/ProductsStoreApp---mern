// src/components/CartDrawer.jsx
import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import useCartStore from "../store/cart.js";
import SecureCheckoutModal from "./SecureCheckoutModal";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      {/* Responsive size: full screen on mobile, md drawer on larger devices */}
      <Drawer isOpen={isOpen} placement="right" size={{ base: "full", md: "md" }} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Your Shopping Cart</DrawerHeader>

          <DrawerBody>
            {cart.length === 0 ? (
              <VStack justify="center" h="full" spacing={4}>
                <Text fontSize="lg" color="gray.500">
                  Your cart is currently empty.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch" py={4}>
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <HStack
                      key={itemId}
                      justify="space-between"
                      borderBottomWidth="1px"
                      borderColor={borderColor}
                      pb={4}
                      align="center"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        boxSize={{ base: "50px", md: "60px" }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://placehold.co/100x100?text=No+Img"
                      />
                      <VStack align="start" flex="1" px={2} spacing={0.5}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} noOfLines={1}>
                          {item.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          ${Number(item.price).toFixed(2)}
                        </Text>
                      </VStack>

                      {/* Quantity controls */}
                      <HStack spacing={1.5}>
                        <IconButton
                          aria-label="Decrease quantity"
                          icon={<MinusIcon />}
                          size="xs"
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        />
                        <Text fontWeight="bold" fontSize="sm" px={1}>
                          {item.quantity}
                        </Text>
                        <IconButton
                          aria-label="Increase quantity"
                          icon={<AddIcon />}
                          size="xs"
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        />
                        <IconButton
                          aria-label="Remove item"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(itemId)}
                        />
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>

          {cart.length > 0 && (
            <DrawerFooter borderTopWidth="1px" flexDirection="column" align="stretch">
              <HStack justify="space-between" mb={4} w="full">
                <Text fontSize="lg" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="green.500">
                  ${totalPrice.toFixed(2)}
                </Text>
              </HStack>
              <HStack spacing={4} w="full">
                <Button variant="outline" colorScheme="red" w="50%" onClick={clearCart} size={{ base: "sm", md: "md" }}>
                  Clear Cart
                </Button>
                <Button colorScheme="blue" w="50%" onClick={() => setIsCheckoutOpen(true)} size={{ base: "sm", md: "md" }}>
                  Checkout
                </Button>
              </HStack>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      {/* Render Checkout Modal */}
      <SecureCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={totalPrice}
      />
    </>
  );
};

export default CartDrawer;