import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast({
        title: "Email tidak valid",
        description: "Masukkan email yang benar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Permintaan reset terkirim",
      description: `Link reset dikirim ke ${email}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      window.location.href = `/reset-password?email=${encodeURIComponent(
        email
      )}`;
    }, 2200);

    setEmail("");
  };

  return (
    <Box
      bg="#4169E1"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        maxW="md"
        w="full"
        boxShadow="lg"
        textAlign="center"
      >
        <Heading fontSize="xl" mb={2} textAlign="left">
          Lupa Kata Sandi
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={6} textAlign="left">
          Masukkan Email Terdaftar Anda Untuk <br />
          Memulihkan Akun.
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel fontSize="sm" fontWeight="semibold" textAlign="left">
              E-mail
            </FormLabel>
            <Input
              type="email"
              placeholder="Masukkan E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="white"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
            isDisabled={!email || !email.includes("@")}
          >
            Kirim verifikasi
          </Button>
        </form>

        <Flex align="center" mb={4}>
          <Box flex="1" height="1px" bg="gray.300" />
          <Text px={2} fontSize="sm" color="gray.500">
            Atau
          </Text>
          <Box flex="1" height="1px" bg="gray.300" />
        </Flex>

        <Link as={RouterLink} to="/login" color="blue.600" fontSize="m">
          <ArrowBackIcon mr={1} />
          Kembali ke halaman login
        </Link>
      </Box>
    </Box>
  );
}
