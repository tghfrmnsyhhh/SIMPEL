import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ilustrasi from "../assets/images/ResetPassword.png";
import "../assets/css/Login.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const email = searchParams.get("email") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid =
    newPassword.length >= 6 &&
    /[A-Z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    newPassword === confirmPassword;

  const handleReset = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        title: "Gagal",
        description:
          "Password harus minimal 6 karakter, mengandung angka dan huruf kapital, dan cocok dengan konfirmasi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulasi update password ke localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = storedUsers.map((user) =>
      user.email === email ? { ...user, password: newPassword } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast({
      title: "Berhasil",
      description: "Password berhasil diubah.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Box className="login-container">
      {/* Kiri: Ilustrasi dan ucapan */}
      <Box className="login-left">
        <Heading fontSize="2xl" mb={4} textAlign="center">
          Silahkan Ganti Kata Sandi !
        </Heading>
        <Text fontSize="sm" maxW="80%" mb={8} textAlign="center">
          SIMPEL mendukung proses belajar mengajar secara digital dengan lebih
          mudah dan efektif.
        </Text>
        <Image src={ilustrasi} maxW="460px" />
      </Box>

      {/* Kanan: Form Reset Password */}
      <Box className="login-right">
        <Box w="100%" maxW="md">
          <Heading className="login-heading" fontSize="32px">
            Ganti Kata Sandi Kamu
          </Heading>
          <Text className="login-text">
            Buat Kata Sandi Baru Dengan Minimal 6 Karakter, Termasuk Angka Dan
            Huruf Kapital Untuk Keamanan Maksimal.
          </Text>

          <form onSubmit={handleReset}>
            <FormControl isRequired mb={4}>
              <FormLabel>Kata Sandi baru</FormLabel>
              <Input
                type="password"
                placeholder="Masukan kata sandi baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mb={6}>
              <FormLabel>Konfirmasi Kata Sandi baru</FormLabel>
              <Input
                type="password"
                placeholder="Masukan ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              className="login-button"
              isDisabled={!isFormValid}
              bg={!isFormValid ? "gray.300" : "#4169e1"}
              color="white"
              width="full"
              _hover={{
                bg: !isFormValid ? "gray.300" : "#4169e1",
                transform: isFormValid ? "scale(1.02)" : "none",
              }}
            >
              Simpan
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
