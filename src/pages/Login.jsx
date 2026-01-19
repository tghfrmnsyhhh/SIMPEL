import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Input,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
  Stack,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import loginIllustration from "../assets/images/Login.png";
import "../assets/css/Login.css";

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ingatSaya, setIngatSaya] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIngatSaya(true); // Checkbox dicentang otomatis
    }
  }, []);

  useEffect(() => {
    // 1. Auto-login email kalau pernah diingat
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIngatSaya(true);
    }

    // 2. Tambahkan akun default
    const existingUsers =
      JSON.parse(localStorage.getItem("dataPengguna")) || [];
    const defaultEmail = "admin@simpel.com";
    const defaultPassword = "admin123";

    const hasDefault = existingUsers.some(
      (user) => user.email === defaultEmail
    );

    if (!hasDefault) {
      const defaultUser = {
        nama: "Administrator",
        username: "Admin",
        email: defaultEmail,
        password: defaultPassword,
        jabatan: "Admin",
        status: "Aktif",
        foto: "",
        mataPelajaran: [],
      };
      const updatedUsers = [...existingUsers, defaultUser];
      localStorage.setItem("dataPengguna", JSON.stringify(updatedUsers));
    }

    // 3. Cek master data jabatan juga
    const master = JSON.parse(localStorage.getItem("masterDataStorage")) || {};
    if (!master.jabatan) {
      master.jabatan = [
        { field1: "Admin", field2: "Admin" },
        { field1: "Admin", field2: "Admin" },
      ];
      localStorage.setItem("masterDataStorage", JSON.stringify(master));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast({
        title: "Email tidak valid.",
        description: "Email harus mengandung simbol '@'.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("dataPengguna")) || [];
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      toast({
        title: "Login gagal.",
        description: "Email atau kata sandi salah.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Ambil master data dan jabatan
    const masterData =
      JSON.parse(localStorage.getItem("masterDataStorage")) || {};
    const daftarJabatan = masterData.jabatan || [];
    const matchingJabatan = daftarJabatan.find(
      (j) => j.field1?.toLowerCase() === foundUser.jabatan?.toLowerCase()
    );
    const userRole = matchingJabatan
      ? matchingJabatan.field2.toLowerCase()
      : foundUser.jabatan.toLowerCase();
    if (ingatSaya) {
      localStorage.setItem("rememberedEmail", email);
    }

    // Simpan data login
    localStorage.setItem("userEmail", foundUser.email);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userName", foundUser.nama);
    localStorage.setItem("userFoto", foundUser.foto || "");

    toast({
      title: "Login berhasil!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    navigate("/dashboard");
  };

  return (
    <Flex className="login-container">
      <Box className="login-left">
        <Heading size="lg" mb={2} textAlign="center">
          <Text fontSize="36px" fontWeight="bold" mb={2}>
            Selamat Datang Di SIMPEL!
          </Text>
        </Heading>
        <Text
          fontSize="16px"
          color="whiteAlpha.900"
          maxW="80%"
          mb={12}
          textAlign="center"
        >
          SIMPEL mendukung proses belajar mengajar secara digital dengan lebih
          mudah dan efektif.
        </Text>
        <Image src={loginIllustration} maxW="330px" mb={6} />
      </Box>

      <Box className="login-right">
        <Box w="100%" maxW="md">
          <Heading className="login-heading">
            Masuk Ke{" "}
            <Text className="simpel-text" as="span" fontWeight="bold">
              SIMPEL
            </Text>
          </Heading>
          <Text className="login-text">
            Masuk Untuk Mengakses Halaman Ini. Silakan Isi Informasi Login Anda
            Di Bawah Untuk Melanjutkan Pengalaman Belajar Yang Lebih Baik.
          </Text>

          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  value={email}
                  placeholder="Masukan E-mail"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Kata Sandi</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Masukan Kata Sandi"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Flex className="checkbox-forgot" justify="space-between">
                <Checkbox
                  fontSize="sm"
                  isChecked={ingatSaya}
                  onChange={(e) => setIngatSaya(e.target.checked)}
                >
                  Ingat saya
                </Checkbox>
                <Link
                  as={RouterLink}
                  to="/lupa-password"
                  fontSize="sm"
                  color="blue.500"
                >
                  Lupa Kata Sandi?
                </Link>
              </Flex>

              <Button
                className="login-button"
                type="submit"
                isDisabled={!email || !password}
                bg={!email || !password ? "gray.400" : "blue.500"}
                color="white"
                _hover={{
                  bg: !email || !password ? "gray.400" : "blue.600",
                }}
              >
                Masuk
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
