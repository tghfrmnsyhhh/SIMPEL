import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  FormLabel,
  FormControl,
  HStack,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TambahForumDiskusi = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const toast = useToast();
  const { id: courseId } = useParams();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setJudul(initialData.title || "");
      setDeskripsi(initialData.description || "");
      setLink(initialData.link || "");
      setFile(null);
    } else {
      setJudul("");
      setDeskripsi("");
      setLink("");
      setFile(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!judul) {
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

    const pengunggah = localStorage.getItem("userName") || "Guru Tidak Dikenal";

    const saveData = (base64File = null) => {
      const newData = {
        id: initialData?.id || Date.now(),
        title: judul,
        description: deskripsi,
        link,
        file: base64File || initialData?.file || "",
        fileName: file?.file?.name || initialData?.fileName || "",
        tanggal,
        pengunggah,
        courseId,
      };

      onSubmit(newData);
      toast({
        title: `Diskusi berhasil ${initialData ? "diedit" : "ditambahkan"}.`,
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
        <ModalHeader>
          {initialData ? "Edit Diskusi" : "Tambah Diskusi"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Judul</FormLabel>
            <Input
              placeholder="Masukkan judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
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

export default TambahForumDiskusi;
