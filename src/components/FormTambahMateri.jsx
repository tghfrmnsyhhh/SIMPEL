import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  IconButton,
  FormControl,
  FormLabel,
  useToast,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

const FormMateriModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  initialData = {},
}) => {
  const toast = useToast();

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (isOpen) {
      const data = isEdit || initialData?.id ? initialData : {};
      setNama(data.nama || "");
      setDeskripsi(data.deskripsi || "");
      setLink(data.link || "");
      setFile(null);
    }
  }, [isOpen, isEdit, initialData]);

  const handleSubmit = () => {
    if (!nama) {
      toast({
        title: "Judul wajib diisi.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const today = new Date();
    const tanggal = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const saveData = (base64File = null) => {
      const newData = {
        id: isEdit ? initialData.id : Date.now(),
        nama,
        deskripsi,
        tanggal,
        file: base64File || initialData?.file || "",
        fileName: file?.file?.name || initialData?.fileName || "",
        link,
      };

      onSubmit(newData);
      toast({
        title: `Materi berhasil ${isEdit ? "diedit" : "ditambahkan"}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    };

    if (file?.file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveData(reader.result);
      };
      reader.readAsDataURL(file.file);
    } else {
      saveData();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit Materi" : "Tambah Materi"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Judul</FormLabel>
            <Input
              placeholder="Masukkan judul"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea
              placeholder="Masukkan deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </FormControl>

          <HStack spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Upload File</FormLabel>
              <IconButton
                as="label"
                icon={<AttachmentIcon />}
                cursor="pointer"
                htmlFor="file-upload"
                aria-label="Upload File"
              />
              {file?.file?.name && (
                <Text fontSize="sm" mt={2}>
                  File: <strong>{file.file.name}</strong>
                </Text>
              )}
              <Input
                type="file"
                id="file-upload"
                display="none"
                accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => {
                  const uploaded = e.target.files[0];
                  if (uploaded) {
                    if (uploaded.size > 5 * 1024 * 1024) {
                      toast({
                        title: "Ukuran file terlalu besar!",
                        description: "Maksimum ukuran file adalah 5 MB.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      return;
                    }
                    setFile({ file: uploaded });
                  }
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Link</FormLabel>
              <Input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </FormControl>
          </HStack>

          <Text fontSize="sm" color="gray.500">
            Maksimum ukuran file adalah 5 MB. Format: .jpg, .png, .pdf, .doc,
            .ppt
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={handleSubmit}
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormMateriModal;
