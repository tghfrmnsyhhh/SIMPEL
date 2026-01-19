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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { InputGroup, InputRightElement } from "@chakra-ui/react";

const LOCAL_STORAGE_KEY = "masterDataStorage";

export default function FormTambahPengguna({
  onSubmit,
  defaultValue = {},
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jabatan: "",
    status: "",
    password: "",
    mataPelajaran: [],
  });

  const [masterJabatan, setMasterJabatan] = useState([]);
  const [masterStatus, setMasterStatus] = useState([]);
  const [masterMapel, setMasterMapel] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
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
        email: defaultValue.email || "",
        jabatan: defaultValue.jabatan || "",
        status: defaultValue.status || "",
        password: "",
        mataPelajaran: defaultValue.mataPelajaran || [],
      });
    }
  }, [isEdit, defaultValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapelChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, mataPelajaran: selected }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, email, jabatan, status, password } = formData;

    if (!nama.trim()) {
      toast({
        title: "Nama wajib diisi",
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

    if (!isEdit && !password.trim()) {
      toast({
        title: "Password wajib diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (onSubmit) {
      const trimmedData = {
        ...formData,
        mataPelajaran: formData.mataPelajaran || [],
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
      <form id="form-pengguna" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nama</FormLabel>
            <Input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
            />
          </FormControl>

          <FormControl isRequired={!isEdit}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
              />
              <InputRightElement h="full">
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  _hover={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
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

          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Pilih Status"
            >
              {masterStatus
                .filter((item) => {
                  const jabatan = formData.jabatan.toLowerCase();
                  const isJabatanKhusus =
                    jabatan.includes("wakil") ||
                    jabatan.includes("kepala") ||
                    jabatan.includes("kepala sekolah");

                  const status = item.field1.toLowerCase();
                  const allowedStatus = ["pns", "kontrak", "gty"];

                  if (isJabatanKhusus) {
                    return allowedStatus.includes(status);
                  }

                  return true;
                })
                .map((item, i) => (
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
              p={2}
              maxH="150px"
              overflowY="auto"
            >
              {masterMapel.map((item, i) => {
                const value = item.field1;
                const isChecked = formData.mataPelajaran.includes(value);

                return (
                  <Box key={i}>
                    <label>
                      <input
                        type="checkbox"
                        value={value}
                        checked={isChecked}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedMapel = isChecked
                            ? formData.mataPelajaran.filter(
                                (v) => v !== newValue
                              )
                            : [...formData.mataPelajaran, newValue];
                          setFormData((prev) => ({
                            ...prev,
                            mataPelajaran: updatedMapel,
                          }));
                        }}
                        style={{ marginRight: "8px" }}
                      />
                      {value}
                    </label>
                  </Box>
                );
              })}
            </Box>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
