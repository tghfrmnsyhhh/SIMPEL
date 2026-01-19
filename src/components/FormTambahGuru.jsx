import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";

const LOCAL_STORAGE_KEY = "masterDataStorage";

export default function FormTambahGuru({
  onSubmit,
  defaultValue = {},
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jenisKelamin: "",
    email: "",
    noHp: "",
    jabatan: "",
    status: "",
    mataPelajaran: [],
  });

  const [masterJabatan, setMasterJabatan] = useState([]);
  const [masterStatus, setMasterStatus] = useState([]);
  const [masterMapel, setMasterMapel] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
      );
      setMasterJabatan(stored.jabatan || []);
      setMasterStatus(stored.statusGuru || []);
      setMasterMapel(stored.mataPelajaran || []);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (isEdit && defaultValue) {
      setFormData({
        nama: defaultValue.nama || "",
        nip: defaultValue.nip || "",
        jenisKelamin: defaultValue.jenisKelamin || "",
        email: defaultValue.email || "",
        noHp: defaultValue.noHp || "",
        jabatan: defaultValue.jabatan || "",
        status: defaultValue.status || "",
        mataPelajaran: Array.isArray(defaultValue.mataPelajaran)
          ? defaultValue.mataPelajaran
          : typeof defaultValue.mataPelajaran === "string"
          ? [defaultValue.mataPelajaran]
          : [],
      });
    }
  }, [isEdit, defaultValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validatePhone = (noHp) => /^[0-9+()\s-]{8,16}$/.test(noHp.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nip, email, noHp, jabatan, status, mataPelajaran } = formData;

    if (
      (status === "PNS" || status === "PPPK") &&
      !/^\d{8,18}$/.test(nip.trim())
    ) {
      toast({
        title: "NIP wajib diisi untuk status PNS atau PPPK.",
        description: "Gunakan angka 8 hingga 18 digit.",
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

    if (!jabatan || !status) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Jabatan dan Status wajib dipilih.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!mataPelajaran || mataPelajaran.length === 0) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Setidaknya satu Mata Pelajaran harus dipilih.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (onSubmit) {
      const trimmedData = {
        ...formData,
        mataPelajaran: mataPelajaran.map((m) => m.trim()),
      };

      for (let key in trimmedData) {
        if (typeof trimmedData[key] === "string") {
          trimmedData[key] = trimmedData[key].trim();
        }
      }

      onSubmit(trimmedData);
    }
  };

  return (
    <Box p={4}>
      <form id="form-guru" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nama</FormLabel>
            <Input name="nama" value={formData.nama} onChange={handleChange} />
          </FormControl>

          <FormControl
            isRequired={formData.status === "PNS" || formData.status === "PPPK"}
          >
            <FormLabel>
              NIP/NIKKI{" "}
              {formData.status === "PNS" || formData.status === "PPPK" ? (
                <span style={{ color: "red" }}></span>
              ) : (
                <span style={{ color: "#718096" }}></span>
              )}
            </FormLabel>
            <Input
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              placeholder={
                formData.status === "PNS" || formData.status === "PPPK"
                  ? "Contoh: 198505162009031002"
                  : "Kosongkan jika bukan PNS/PPPK"
              }
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
            <FormLabel>Jabatan</FormLabel>
            <Select
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              placeholder="Pilih Jabatan"
            >
              {masterJabatan.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Mata Pelajaran</FormLabel>
            <Box
              border="1px solid #CBD5E0"
              borderRadius="md"
              maxH="150px"
              overflowY="auto"
              p={2}
            >
              <CheckboxGroup
                value={formData.mataPelajaran}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, mataPelajaran: values }))
                }
              >
                <Stack direction="column">
                  {masterMapel.map((item, i) => (
                    <Checkbox key={i} value={item.field1}>
                      {item.field1}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Pilih Status"
            >
              {(formData.jabatan.toLowerCase().includes("wakil") ||
              formData.jabatan.toLowerCase() === "kepala sekolah" ||
              formData.jabatan.toLowerCase() === "kepala jurusan"
                ? masterStatus.filter((s) =>
                    ["pns", "kontrak", "gty"].includes(s.field1.toLowerCase())
                  )
                : masterStatus
              ).map((item, i) => (
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
