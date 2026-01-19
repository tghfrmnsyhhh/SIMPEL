import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Avatar,
  Text,
  Box,
  VStack,
  useDisclosure,
  Icon,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { useRef, useState } from "react";

const ModalUbahFoto = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputFileRef = useRef(null);
  const toast = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format tidak didukung",
          description: "Hanya file gambar (jpg, png) yang diizinkan.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Ukuran terlalu besar",
          description: "Maksimal ukuran gambar adalah 5MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      console.log("Foto disimpan:", selectedImage);
      onClose();
      // Reset state
      setSelectedImage(null);
      setPreview(null);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" size="sm">
        Ubah Foto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={4}>
          <ModalHeader textAlign="center">Ubah foto profil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Avatar size="xl" src={preview} />

              <Box
                border="2px dashed gray"
                borderRadius="md"
                w="full"
                p={6}
                textAlign="center"
                color="gray.600"
                cursor="pointer"
                onClick={() => inputFileRef.current.click()}
              >
                <Icon as={FiUpload} boxSize={6} mb={2} />
                <Text fontWeight="semibold">Tarik foto ke sini</Text>
                <Text fontSize="sm" color="gray.500">
                  Format: jpg, png | Max: 5MB
                </Text>
                <Input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  display="none"
                />
              </Box>

              <Text fontSize="sm" color="gray.400">
                — atau —
              </Text>

              <Button
                leftIcon={<FiUpload />}
                colorScheme="blue"
                onClick={() => inputFileRef.current.click()}
              >
                Upload dari komputer
              </Button>

              <Button
                colorScheme="green"
                width="full"
                mt={2}
                isDisabled={!selectedImage}
                onClick={handleSave}
              >
                Simpan
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUbahFoto;
