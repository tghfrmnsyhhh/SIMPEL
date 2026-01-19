import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";

const LOCAL_STORAGE_KEY = "masterDataStorage";

export default function FormTambahSiswa({
  onSubmit,
  defaultValue = {},
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    nama: "",
    nis: "",
    jenisKelamin: "",
    email: "",
    noHp: "",
    kelas: "",
    jurusan: "",
    status: "",
  });

  const [masterKelas, setMasterKelas] = useState([]);
  const [masterJurusan, setMasterJurusan] = useState([]);
  const [masterStatus, setMasterStatus] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    setMasterKelas(stored.kelas || []);
    setMasterJurusan(stored.jurusan || []);
    setMasterStatus(stored.statusSiswa || []);
  }, []);

  useEffect(() => {
    if (isEdit && defaultValue) {
      setFormData({
        nama: defaultValue.nama || "",
        nis: defaultValue.nis || "",
        jenisKelamin: defaultValue.jenisKelamin || "",
        email: defaultValue.email || "",
        noHp: defaultValue.noHp || "",
        kelas: defaultValue.kelas || "",
        jurusan: defaultValue.jurusan || "",
        status: defaultValue.status || "",
      });
    }
  }, [isEdit, JSON.stringify(defaultValue)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "jurusan" ? { kelas: "" } : {}), // reset kelas jika jurusan berubah
    }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validatePhone = (noHp) => /^[0-9+()\s-]{8,16}$/.test(noHp.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, nis, jenisKelamin, email, noHp, kelas, jurusan, status } =
      formData;

    if (!/^\d{4,18}$/.test(nis.trim())) {
      toast({
        title: "Format NIS tidak valid.",
        description: "Gunakan angka 4 hingga 18 digit.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (email && !validateEmail(email)) {
      toast({
        title: "Format Email Tidak Valid",
        description: "Silakan isi dengan email yang benar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (noHp && !validatePhone(noHp)) {
      toast({
        title: "Nomor HP Tidak Valid",
        description: "Gunakan angka saja atau format standar HP.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!kelas || !jurusan || !status) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Kelas, Jurusan, dan Status wajib dipilih.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (onSubmit) {
      const trimmedData = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ])
      );
      onSubmit(trimmedData);
    }
  };

  const filteredKelas = masterKelas.filter((k) => {
    const jurusanDipilih = formData.jurusan.toLowerCase();
    const namaKelas = k.field1?.toLowerCase() || "";
    return namaKelas.includes(jurusanDipilih);
  });

  return (
    <Box p={4}>
      <form id="form-siswa" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nama</FormLabel>
            <Input name="nama" value={formData.nama} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>NIS</FormLabel>
            <Input
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              isReadOnly={isEdit}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Jenis Kelamin</FormLabel>
            <Select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              placeholder="Pilih Jenis Kelamin"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>No HP</FormLabel>
            <Input
              name="noHp"
              type="tel"
              value={formData.noHp}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Jurusan</FormLabel>
            <Select
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              placeholder="Pilih Jurusan"
            >
              {masterJurusan.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Kelas</FormLabel>
            <Select
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              placeholder="Pilih Kelas"
              isDisabled={!formData.jurusan}
            >
              {filteredKelas.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Pilih Status"
            >
              {masterStatus.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
