import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
} from "@chakra-ui/react";

const FormSekolah = () => {
  const [formData, setFormData] = useState({
    namaSekolah: "",
    namaKepalaSekolah: "",
    alamat: "",
    email: "",
    telepon: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={8}
      p={6}
      bg="white"
      boxShadow="md"
      borderRadius="xl"
    >
      <Heading size="md" mb={4}>
        Kostumisasi Data Sekolah
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nama Sekolah</FormLabel>
            <Input
              name="namaSekolah"
              value={formData.namaSekolah}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Nama Kepala Sekolah</FormLabel>
            <Input
              name="namaKepalaSekolah"
              value={formData.namaKepalaSekolah}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Alamat Sekolah</FormLabel>
            <Textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email Sekolah</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>No. Telepon Sekolah</FormLabel>
            <Input
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Logo Sekolah</FormLabel>
            <Input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Simpan
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FormSekolah;
