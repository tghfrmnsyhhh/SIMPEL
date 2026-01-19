import { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  VStack,
  HStack,
  Select,
  Button,
  Flex,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import ModalUbahPassword from "../components/ModalUbahPassword";
import IconUbahSandi from "../assets/icons/ubahsandi.png";
import IconInformasiAkun from "../assets/icons/informasiakun.png";

export default function ProfilePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nip, setNip] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatusGuru] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [userRole, setUserRole] = useState("");

  const [masterJurusan, setMasterJurusan] = useState([]);
  const [masterJabatan, setMasterJabatan] = useState([]);
  const [masterStatus, setMasterStatus] = useState([]);
  const [masterMapel, setMasterMapel] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSimpan = () => {
    const currentEmail = localStorage.getItem("userEmail");
    const currentRole = localStorage.getItem("userRole");
    const users = JSON.parse(localStorage.getItem("dataPengguna")) || [];

    const data = {
      namaLengkap,
      nip,
      jurusan,
      jabatan:
        currentRole === "Guru"
          ? users.find((u) => u.email === currentEmail)?.jabatan || jabatan
          : jabatan,
      noTelp,
      email,
      status,
      mataPelajaran,
      foto: previewPic || "",
    };

    const updatedUsers = users.map((user) =>
      user.email === currentEmail ? { ...user, ...data } : user
    );

    localStorage.setItem("dataPengguna", JSON.stringify(updatedUsers));
    localStorage.setItem("userName", namaLengkap);
    localStorage.setItem("userFoto", previewPic || "");

    toast({
      title: "Profil berhasil disimpan!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };

  useEffect(() => {
    const currentEmail = localStorage.getItem("userEmail");
    const currentRole = localStorage.getItem("userRole");
    setUserRole(currentRole);

    const users = JSON.parse(localStorage.getItem("dataPengguna")) || [];
    const currentUser = users.find((u) => u.email === currentEmail);

    if (currentUser) {
      setNamaLengkap(currentUser.namaLengkap || currentUser.nama || "");
      setNip(currentUser.nip || "");
      setJurusan(currentUser.jurusan || "");
      setJabatan(currentUser.jabatan || "");
      setNoTelp(currentUser.noTelp || "");
      setEmail(currentUser.email || "");
      setStatusGuru(currentUser.status || "");
      setMataPelajaran(currentUser.mataPelajaran || []);
      setPreviewPic(currentUser.foto || null);
    }

    const masterData = JSON.parse(localStorage.getItem("masterDataStorage"));
    if (masterData) {
      setMasterJurusan(masterData.jurusan?.map((j) => j.field1) || []);
      setMasterJabatan(masterData.jabatan?.map((j) => j.field1) || []);
      setMasterStatus(masterData.statusGuru?.map((s) => s.field1) || []);
      setMasterMapel(masterData.mataPelajaran?.map((m) => m.field1) || []);
    }
  }, []);

  return (
    <Box bg="#f1f5ff" minH="100vh" p={6}>
      <Text fontSize="sm" color="black" mb={4}>
        Profil Pengguna
      </Text>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
        align="stretch"
      >
        <Flex
          flex="1"
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          align="center"
          justify="start"
          p={4}
          gap={4}
        >
          <Box position="relative">
            <Avatar
              size="xl"
              name={namaLengkap}
              src={previewPic}
              bg="gray.200"
            />
            <IconButton
              icon={<EditIcon />}
              size="xs"
              position="absolute"
              top="0"
              right="0"
              borderRadius="full"
              bg="white"
              aria-label="Edit Foto"
              boxShadow="sm"
              onClick={() => document.getElementById("upload-photo")?.click()}
            />
            <Input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              display="none"
            />
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {namaLengkap || "Nama Pengguna"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {userRole === "Guru" ? "Guru Umum" : jabatan || "Jabatan"}
            </Text>
          </Box>
        </Flex>

        <Flex
          flex="1"
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={4}
          justify="space-between"
          align="center"
        >
          <HStack>
            <Box boxSize="20px">
              <img src={IconUbahSandi} alt="Ikon Sandi" width="100%" />
            </Box>
            <Text fontWeight="semibold">Kata Sandi</Text>
          </HStack>
          <Button
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
            onClick={onOpen}
          >
            Ubah Kata Sandi
          </Button>
        </Flex>
      </Flex>

      <Box bg="white" borderRadius="xl" p={6} boxShadow="md">
        <HStack mb={4} spacing={2}>
          <Box boxSize="20px">
            <img src={IconInformasiAkun} alt="Ikon Akun" width="100%" />
          </Box>
          <Text fontWeight="bold">Informasi Akun</Text>
        </HStack>

        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired={status === "PNS" || status === "PPPK"}>
            <FormLabel>NIP</FormLabel>
            <Input value={nip} onChange={(e) => setNip(e.target.value)} />
          </FormControl>

          {jabatan !== "Kepala Sekolah" && jabatan !== "Guru Umum" && (
            <FormControl isRequired>
              <FormLabel>Jurusan</FormLabel>
              <Select
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                placeholder="Pilih Jurusan"
              >
                {masterJurusan.map((jrs, i) => (
                  <option key={i} value={jrs}>
                    {jrs}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl isRequired>
            <FormLabel>Jabatan</FormLabel>
            <Select
              value={jabatan}
              onChange={(e) => {
                if (userRole !== "Guru") setJabatan(e.target.value);
              }}
              placeholder="Pilih Jabatan"
              isDisabled={userRole === "guru"}
            >
              {masterJabatan.map((jbt, i) => (
                <option key={i} value={jbt}>
                  {jbt}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>No Telepon</FormLabel>
            <Input value={noTelp} onChange={(e) => setNoTelp(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatusGuru(e.target.value)}
              placeholder="Pilih Status"
            >
              {masterStatus.map((st, i) => (
                <option key={i} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mata Pelajaran</FormLabel>
            <CheckboxGroup
              value={
                Array.isArray(mataPelajaran)
                  ? mataPelajaran
                  : [mataPelajaran].filter(Boolean)
              }
              onChange={(val) => setMataPelajaran(val)}
            >
              <Flex wrap="wrap" gap={4}>
                {masterMapel.map((mapel, i) => (
                  <Checkbox key={i} value={mapel}>
                    {mapel}
                  </Checkbox>
                ))}
              </Flex>
            </CheckboxGroup>
          </FormControl>

          <Flex justify="flex-end">
            <Button
              bg="#4169E1"
              color="white"
              _hover={{ bg: "#355ACF" }}
              onClick={handleSimpan}
            >
              Simpan
            </Button>
          </Flex>
        </VStack>
      </Box>

      <ModalUbahPassword isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
