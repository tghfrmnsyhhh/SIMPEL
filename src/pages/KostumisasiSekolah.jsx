import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  Flex,
  VStack,
  useToast,
} from "@chakra-ui/react";
import BreadcrumbsPath from "../components/BreadcrumbsPath";

const FormSekolah = () => {
  const [formData, setFormData] = useState({
    namaAplikasi: "SIMPEL",
    deskripsi: "Sistem Pembelajaran Elektronik",
    namaSekolah: "",
    kepalaSekolah: "",
    npsn: "",
    logo: null,
    logoName: "",
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoName, setLogoName] = useState("");
  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("dataSekolah");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData((prev) => ({ ...prev, ...parsed }));

      if (parsed.logo) {
        setPreviewLogo(parsed.logo);
      }
      if (parsed.logoName) {
        setLogoName(parsed.logoName);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      const file = files[0];
      if (
        file &&
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            logo: reader.result,
            logoName: file.name,
          }));
          setPreviewLogo(reader.result);
          setLogoName(file.name);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Format tidak valid",
          description: "Hanya file .jpg, .jpeg, .png yang diperbolehkan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("dataSekolah", JSON.stringify(formData));
    window.dispatchEvent(new Event("dataSekolahUpdated"));
    toast({
      title: "Data Disimpan",
      description: "Data sekolah berhasil disimpan.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box px={4} pt={4} bg="#E3E9FB">
        <BreadcrumbsPath
          paths={[
            { label: "Menu Admin", link: "/dashboard" },
            { label: "Kostumisasi Sekolah" },
          ]}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Flex
          direction={{ base: "column", md: "row" }}
          p={6}
          minH="100vh"
          bg="#f2f6fd"
          maxW="1200px"
          mx="auto"
          mt={4}
          borderRadius="10px"
          boxShadow="md"
          bgColor="white"
        >
          {/* Kolom kiri */}
          <Box
            w={{ base: "100%", md: "40%" }}
            p={6}
            borderRight={{ md: "1px solid #EDF2F7" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              overflow="hidden"
              bg="gray.200"
              mb={4}
            >
              {previewLogo ? (
                <Image
                  src={previewLogo}
                  w="full"
                  h="full"
                  objectFit="cover"
                  alt="Logo"
                />
              ) : (
                <Image
                  src="/logo-placeholder.png"
                  w="full"
                  h="full"
                  objectFit="cover"
                  alt="Logo Placeholder"
                />
              )}
            </Box>
            <Text fontSize="xl" fontWeight="bold" mb={1}>
              {formData.namaSekolah || "Nama Sekolah"}
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Sistem Pembelajaran Elektronik
            </Text>
          </Box>

          {/* Kolom kanan */}
          <Box w={{ base: "100%", md: "60%" }} p={6}>
            <VStack spacing={5} align="stretch">
              <FormControl>
                <FormLabel>Nama Aplikasi</FormLabel>
                <Input
                  name="namaAplikasi"
                  value={formData.namaAplikasi}
                  onChange={handleChange}
                  isReadOnly
                  bg="gray.100"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Deskripsi</FormLabel>
                <Input
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  isReadOnly
                  bg="gray.100"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nama Sekolah</FormLabel>
                <Input
                  name="namaSekolah"
                  value={formData.namaSekolah}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Kepala Sekolah</FormLabel>
                <Input
                  name="kepalaSekolah"
                  value={formData.kepalaSekolah}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>NPSN</FormLabel>
                <Input
                  name="npsn"
                  type="number"
                  value={formData.npsn}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Logo Aplikasi</FormLabel>
                <Input
                  name="logo"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                />
                {logoName && (
                  <Text fontSize="sm" mt={2} color="gray.600">
                    File dipilih: {logoName}
                  </Text>
                )}
                <Text fontSize="sm" color="purple.500" mt={1}>
                  Ukuran gambar yang disarankan 300x450. Hanya mendukung format:
                  .jpg, .png, .jpeg.
                </Text>
              </FormControl>

              <Button
                type="submit"
                bg="#4169E1"
                color="white"
                _hover={{ bg: "#355ACF" }}
                w="fit-content"
                alignSelf="flex-end"
                px={6}
              >
                Simpan
              </Button>
            </VStack>
          </Box>
        </Flex>
      </form>
    </>
  );
};

export default FormSekolah;
