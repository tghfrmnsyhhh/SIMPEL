import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ModalUbahPassword({ isOpen, onClose }) {
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Semua kolom wajib diisi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Kata Sandi baru terlalu pendek.",
        description: "Minimal 6 karakter.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Konfirmasi Kata Sandi tidak cocok.",
        description: "Pastikan kedua input Kata Sandi sama.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    const dataPengguna = JSON.parse(localStorage.getItem("dataPengguna")) || [];

    const updatedUsers = dataPengguna.map((user) => {
      if (user.email === userEmail) {
        if (user.password !== oldPassword) {
          toast({
            title: "Kata Sandi lama salah.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return user;
        }
        return { ...user, password: newPassword };
      }
      return user;
    });

    const userIndex = dataPengguna.findIndex((u) => u.email === userEmail);
    if (dataPengguna[userIndex].password !== oldPassword) return;

    localStorage.setItem("dataPengguna", JSON.stringify(updatedUsers));

    toast({
      title: "Kata Sandi berhasil diubah.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ubah Kata Sandi</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <FormControl mb={3} isRequired>
            <FormLabel>Kata Sandi Lama</FormLabel>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password lama"
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Kata Sandi Baru</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Masukkan ulang Kata Sandi baru"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={handleChangePassword}
            colorScheme="blue"
            mr={3}
            bg="#4169E1"
            _hover={{ bg: "#355ACF" }}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
