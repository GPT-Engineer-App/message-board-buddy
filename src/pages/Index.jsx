import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Stack, Heading, Textarea, useToast, VStack, HStack, Text } from "@chakra-ui/react";
import { FaSignInAlt, FaUserPlus, FaPenAlt } from "react-icons/fa";

const Index = () => {
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Authentication handlers
  const handleLogin = async () => {
    try {
      const response = await fetch("https://backengine-rczp.fly.dev/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        setIsLoggedIn(true);
        toast({ title: "Logged in successfully", status: "success" });
      } else {
        toast({ title: "Failed to log in", status: "error" });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: error.message, status: "error" });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("https://backengine-rczp.fly.dev/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        toast({ title: "Signed up successfully", status: "success" });
        handleLogin(); // Auto login after signup
      } else {
        toast({ title: "Failed to sign up", status: "error" });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: error.message, status: "error" });
    }
  };

  // Message handlers
  const handleMessagePost = async () => {
    // Dummy user_id and message IDs since we don't have the actual data
    const messageData = {
      user_id: 1,
      prior_message_id: 0,
      ancestor_message_id: 0,
      title,
      content,
    };
    try {
      const response = await fetch("https://backengine-rczp.fly.dev/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setTitle("");
        setContent("");
        toast({ title: "Message posted successfully", status: "success" });
      } else {
        toast({ title: "Failed to post message", status: "error" });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: error.message, status: "error" });
    }
  };

  // Fetch initial messages (not implemented, assuming there's an endpoint for this)
  // useEffect(() => {
  //   // Fetch messages from backend and setMessages
  // }, []);

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={6}>
        {!isLoggedIn ? (
          <Stack spacing={4} width="100%">
            <Heading>Welcome to the BBS Message Board!</Heading>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <HStack width="100%" justify="space-between">
              <Button leftIcon={<FaSignInAlt />} onClick={handleLogin}>
                Login
              </Button>
              <Button leftIcon={<FaUserPlus />} colorScheme="teal" onClick={handleSignup}>
                Signup
              </Button>
            </HStack>
          </Stack>
        ) : (
          <Stack spacing={4} width="100%">
            <Heading>Post a Message</Heading>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </FormControl>
            <Button leftIcon={<FaPenAlt />} colorScheme="blue" onClick={handleMessagePost}>
              Post
            </Button>
          </Stack>
        )}
        <Box width="100%">
          {messages.map((message, index) => (
            <Box key={index} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{message.title}</Heading>
              <Text mt={4}>{message.content}</Text>
            </Box>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
