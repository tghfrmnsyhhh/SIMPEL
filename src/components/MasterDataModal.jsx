import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";

const MasterDataModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  editMode,
  fields,
}) => {
  const toast = useToast();

  useEffect(() => {
    if (isOpen && form) {
      // kalau perlu reset atau set form bisa ditangani dari parent
    }
  }, [isOpen, form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.field1 || !form.field2) {
      toast({
        title: "Isi semua field.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSubmit();
  };

  const isRoleDropdown = fields.title === "Jabatan";
  const roleOptions = ["Admin", "Guru"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editMode ? `Edit ${fields.title}` : `Tambah ${fields.title}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4}>
            <FormLabel>{fields.field1Label}</FormLabel>
            {fields.isDropdown1 ? (
              <Select
                placeholder={`Pilih ${fields.field1Label.toLowerCase()}`}
                value={form.field1}
                onChange={(e) => handleChange("field1", e.target.value)}
                autoFocus
              >
                {fields.options1.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                placeholder={`Masukkan ${fields.field1Label.toLowerCase()}`}
                value={form.field1}
                onChange={(e) => handleChange("field1", e.target.value)}
                autoFocus
              />
            )}
          </FormControl>

          {fields.field2Label && (
            <FormControl isRequired>
              <FormLabel>{fields.field2Label}</FormLabel>
              {isRoleDropdown ? (
                <Select
                  placeholder="Pilih role"
                  value={form.field2}
                  onChange={(e) => handleChange("field2", e.target.value)}
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </Select>
              ) : fields.isDropdown2 ? (
                <Select
                  placeholder={`Pilih ${fields.field2Label.toLowerCase()}`}
                  value={form.field2}
                  onChange={(e) => handleChange("field2", e.target.value)}
                >
                  {fields.options2.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  placeholder={`Masukkan ${fields.field2Label.toLowerCase()}`}
                  value={form.field2}
                  onChange={(e) => handleChange("field2", e.target.value)}
                />
              )}
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
            onClick={handleSubmit} // Panggil fungsi submit saat klik
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MasterDataModal;
