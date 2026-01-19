import React, { useState, useEffect } from "react";
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
  Select,
  Textarea,
  Stack,
  useToast,
} from "@chakra-ui/react";

const CourseForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacher: "",
    code: "",
    category: "",
    semester: "",
    year: "",
    classLevel: "",
  });

  const [masterOptions, setMasterOptions] = useState({
    jurusan: [],
    kelas: [],
    tahunAjar: [],
    mapel: [],
  });

  const [role, setRole] = useState("");
  const [userMapel, setUserMapel] = useState("");
  const [userName, setUserName] = useState("");
  const toast = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("masterDataStorage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMasterOptions({
          jurusan: parsed.jurusan || [],
          kelas: parsed.kelas || [],
          tahunAjar: parsed.tahunAjar || [],
          mapel: parsed.mataPelajaran || [],
        });
      } catch (e) {
        console.error("Gagal parsing masterDataStorage", e);
      }
    }

    const r = localStorage.getItem("role");
    const email = localStorage.getItem("userEmail");
    const dataPengguna = JSON.parse(localStorage.getItem("dataPengguna")) || [];
    const currentUser = dataPengguna.find((u) => u.email === email);

    if (r === "guru" && currentUser) {
      setUserMapel(currentUser.mataPelajaran || "");
      setUserName(currentUser.namaLengkap || currentUser.nama || "");
      setFormData((prev) => ({
        ...prev,
        title: currentUser.mataPelajaran || "",
        teacher: currentUser.namaLengkap || currentUser.nama || "",
      }));
    }

    setRole(r);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (role !== "guru") {
      setFormData({
        title: "",
        description: "",
        teacher: "",
        code: "",
        category: "",
        semester: "",
        year: "",
        classLevel: "",
      });
    }
  }, [initialData, role, isOpen]);

  useEffect(() => {
    const selectedYear = masterOptions.tahunAjar.find(
      (item) => item.field1 === formData.year
    );
    if (selectedYear && selectedYear.field2 && !formData.semester) {
      setFormData((prev) => ({
        ...prev,
        semester: selectedYear.field2,
      }));
    }
  }, [formData.year, masterOptions.tahunAjar, formData.semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.teacher || !formData.code) {
      toast({
        title: "Gagal",
        description: "Mata pelajaran, guru, dan kode wajib diisi!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (role === "guru" && formData.title !== userMapel) {
      toast({
        title: "Gagal",
        description: `Anda hanya dapat menambahkan mata pelajaran: ${userMapel}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      onCloseComplete={() => {
        setFormData({
          title: "",
          description: "",
          teacher: "",
          code: "",
          category: "",
          semester: "",
          year: "",
          classLevel: "",
        });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {initialData ? "Edit Mapel" : "Tambah Mapel"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Mata Pelajaran</FormLabel>
                <Select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  isDisabled={role === "guru"}
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {(role === "guru"
                    ? masterOptions.mapel.filter((m) => m.field1 === userMapel)
                    : masterOptions.mapel
                  ).map((m, idx) => (
                    <option key={idx} value={m.field1}>
                      {m.field1}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Guru</FormLabel>
                <Input
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  isDisabled={role === "guru"}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Kode Mapel</FormLabel>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Jurusan</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jurusan</option>
                  {masterOptions.jurusan.map((j, idx) => (
                    <option key={idx} value={j.field1}>
                      {j.field1}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Kelas</FormLabel>
                <Select
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleChange}
                  isDisabled={!formData.category}
                >
                  <option value="">Pilih Kelas</option>
                  {masterOptions.kelas
                    .filter((k) => {
                      const namaJurusanDipilih =
                        formData.category.toLowerCase();
                      const namaKelas = k.field1?.toLowerCase() || "";
                      return namaKelas.includes(namaJurusanDipilih);
                    })
                    .map((k, idx) => (
                      <option key={idx} value={k.field1}>
                        {k.field1}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Semester</FormLabel>
                <Select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Pilih Semester</option>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tahun Ajar</FormLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Pilih Tahun Ajar</option>
                  {masterOptions.tahunAjar.map((t, idx) => (
                    <option key={idx} value={t.field1}>
                      {t.field1}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              bg="#4169E1"
              color="white"
              _hover={{ bg: "#355ACF" }}
            >
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CourseForm;
