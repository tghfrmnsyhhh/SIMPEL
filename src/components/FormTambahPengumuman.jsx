import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  HStack,
  Divider,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Badge,
  Image,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import AlertDialogConfirm from "../components/AlertDialogKonfirmasi";
import kosongImage from "../assets/images/kosong.jpg";
import iconEdit from "../assets/icons/Edit.png";
import iconDelete from "../assets/icons/Hapus.png";
import pengumuman from "../assets/icons/Pengumuman.png";

const STORAGE_KEY = "pengumumanDashboard";

const FormTambahPengumuman = ({ role }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [pengumumanList, setPengumumanList] = useState([]);
  const canManage = role?.toLowerCase() === "admin";

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggalTampil, setTanggalTampil] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const toast = useToast();

  // Load data dari localStorage dan hapus yang sudah lewat tanggal
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      let data = JSON.parse(storedData);

      // Filter hapus pengumuman lewat tanggal
      const hariIni = new Date();
      hariIni.setHours(0, 0, 0, 0);

      data = data.filter((item) => {
        const tanggalItem = new Date(item.tanggalTampil);
        tanggalItem.setHours(0, 0, 0, 0);
        // Tetap tampilkan tanggal hari ini dan yang akan datang
        return tanggalItem.getTime() >= hariIni.getTime();
      });

      // Simpan kembali setelah filter
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setPengumumanList(data);
    }
  }, []);

  // Fungsi reset form
  const resetForm = () => {
    setJudul("");
    setIsi("");
    setTanggalTampil("");
    setEditId(null);
  };

  // Simpan pengumuman baru
  const handleSimpan = () => {
    if (!judul || !isi || !tanggalTampil) {
      toast({
        title: "Lengkapi semua field!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newItem = {
      id: Date.now(),
      judul,
      isi,
      tanggalTampil,
    };

    const newList = [newItem, ...pengumumanList];
    setPengumumanList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

    resetForm();
    setFormVisible(false);

    toast({
      title: "Pengumuman ditambahkan.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Hapus pengumuman
  const handleDelete = (id) => {
    setDeleteId(id);
    onAlertOpen();
  };

  const handleDeleteConfirmed = () => {
    const newList = pengumumanList.filter((item) => item.id !== deleteId);
    setPengumumanList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setDeleteId(null);
    onAlertClose();
    toast({
      title: "Pengumuman dihapus.",
      status: "error",
      duration: 3000,
      isClosable: true,
      colorScheme: "red",
    });
  };

  // Edit pengumuman: buka modal isi form dengan data
  const handleEdit = (item) => {
    setJudul(item.judul);
    setIsi(item.isi);
    setTanggalTampil(item.tanggalTampil);
    setEditId(item.id);
    onEditOpen();
  };

  // Simpan perubahan edit
  const handleUpdate = () => {
    if (!judul || !isi || !tanggalTampil) {
      toast({
        title: "Lengkapi semua field!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newList = pengumumanList.map((item) =>
      item.id === editId ? { ...item, judul, isi, tanggalTampil } : item
    );
    setPengumumanList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

    resetForm();
    onEditClose();

    toast({
      title: "Pengumuman berhasil diperbarui.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Urutkan pengumuman berdasarkan tanggal dari hari ini ke depan
  const sortedPengumuman = [...pengumumanList]
    .filter((item) => {
      const tampilDate = new Date(item.tanggalTampil);
      tampilDate.setHours(0, 0, 0, 0);

      const tampilMinus7 = new Date(tampilDate);
      tampilMinus7.setDate(tampilDate.getDate() - 7);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return today >= tampilMinus7 && today <= tampilDate;
    })
    .sort((a, b) => new Date(a.tanggalTampil) - new Date(b.tanggalTampil));

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <HStack justify="space-between" mb={4}>
        <Heading size="md">
          <HStack spacing={2}>
            <Image src={pengumuman} boxSize="28px" alt="Ikon Pengumuman" />
            <Text>Pengumuman</Text>
          </HStack>
        </Heading>
        {canManage && (
          <Button
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
            onClick={() => {
              resetForm();
              setFormVisible(!formVisible);
            }}
          >
            {formVisible ? "Tutup Form" : "Tambah"}
          </Button>
        )}
      </HStack>

      {formVisible && (
        <Box mb={6} p={4} border="1px solid #E2E8F0" borderRadius="md">
          <FormControl mb={3}>
            <FormLabel>Judul</FormLabel>
            <Input
              placeholder="Judul pengumuman"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Isi</FormLabel>
            <Textarea
              placeholder="Isi pengumuman"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Tanggal Tampil</FormLabel>
            <Input
              type="date"
              value={tanggalTampil}
              onChange={(e) => setTanggalTampil(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </FormControl>
          {canManage && (
            <Button colorScheme="blue" onClick={handleSimpan}>
              Simpan Pengumuman
            </Button>
          )}
        </Box>
      )}

      <Divider mb={4} />

      <VStack align="start" spacing={4}>
        {sortedPengumuman.length === 0 ? (
          <VStack spacing={4} align="center" w="full">
            <Image src={kosongImage} maxW="100%" w="100%" h="auto" />
            <Text color="gray.500" fontSize="sm">
              Tidak ada pengumuman
            </Text>
          </VStack>
        ) : (
          sortedPengumuman.map((item) => {
            const hariIni = new Date();
            hariIni.setHours(0, 0, 0, 0);

            const tanggalItem = new Date(item.tanggalTampil);
            tanggalItem.setHours(0, 0, 0, 0);

            const isHariIni = tanggalItem.getTime() === hariIni.getTime();
            const isMendatang = tanggalItem.getTime() > hariIni.getTime();

            return (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                w="100%"
                bg={isHariIni ? "#EBF8FF" : "gray.50"}
              >
                <HStack justify="space-between" mb={1}>
                  <Text fontWeight="bold">{item.judul}</Text>

                  {canManage && (
                    <HStack spacing={1}>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(item)}
                        variant="ghost"
                        p={1}
                        minW="auto"
                      >
                        <Image
                          src={iconEdit}
                          alt="Edit"
                          boxSize="24px"
                          bg="#F9BA32"
                          borderRadius="md"
                        />
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        variant="unstyled"
                        p={0}
                        minW="auto"
                        aria-label="Hapus Pengumuman"
                      >
                        <Image
                          src={iconDelete}
                          boxSize="28px"
                          alt="Hapus"
                          bg="#F31014"
                          borderRadius="md"
                          p="4px"
                        />
                      </Button>
                    </HStack>
                  )}
                </HStack>
                <HStack spacing={2} mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Tanggal: {tanggalItem.toLocaleDateString("id-ID")}
                  </Text>
                  {isMendatang && <Badge colorScheme="blue">Akan Tayang</Badge>}
                  {isHariIni && (
                    <Badge colorScheme="green">Sedang Tayang</Badge>
                  )}
                </HStack>
                <Text>{item.isi}</Text>
              </Box>
            );
          })
        )}
      </VStack>

      {/* Modal Edit */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Pengumuman</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Judul</FormLabel>
              <Input
                placeholder="Judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Isi</FormLabel>
              <Textarea
                placeholder="Isi"
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Tanggal Tampil</FormLabel>
              <Input
                type="date"
                value={tanggalTampil}
                onChange={(e) => setTanggalTampil(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleUpdate} colorScheme="blue" mr={3}>
              Simpan Perubahan
            </Button>
            <Button onClick={onEditClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* AlertDialog Delete */}
      <AlertDialogConfirm
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onConfirm={handleDeleteConfirmed}
        title="Hapus Pengumuman"
        message="Yakin ingin menghapus pengumuman ini?"
      />
    </Box>
  );
};

export default FormTambahPengumuman;
