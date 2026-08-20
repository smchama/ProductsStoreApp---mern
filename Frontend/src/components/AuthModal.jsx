// src/components/AuthModal.jsx
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
  VStack,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
import useAuthStore from "../store/auth.js";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { login, signup, loading } = useAuthStore();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await signup(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      toast({
        title: isLogin ? "Welcome back!" : "Account created successfully! 🎉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormData({ name: "", email: "", password: "" });
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isLogin ? "Log In to Your Account" : "Create a New Account"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
            {!isLogin && (
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Chama Mthokozisi"
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="chama@example.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </FormControl>

            <Text fontSize="sm" textAlign="center" pt={2}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                color="blue.500"
                fontWeight="bold"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </Link>
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={loading}
            loadingText={isLogin ? "Logging in..." : "Signing up..."}
            onClick={handleSubmit}
          >
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;