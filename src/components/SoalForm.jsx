import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

const SoalForm = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = () => {
    onSave({ title, description, fileUrl });
    setTitle("");
    setDescription("");
    setFileUrl("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Soal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Judul Soal</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>URL File</FormLabel>
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple" mr={3} onClick={handleSubmit}>
            Simpan
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SoalForm;
