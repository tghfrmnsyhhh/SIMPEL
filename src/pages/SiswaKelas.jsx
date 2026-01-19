import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import IconDelete from "../assets/icons/Hapus.png";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";

const SiswaKelas = ({ course }) => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [idToDelete, setIdToDelete] = useState(null);
  const toast = useToast();
  const alertDialog = useDisclosure();
  const cancelRef = useRef();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!course) return;

    const namaDepan = [
      "Ahmad",
      "Bella",
      "Cahya",
      "Deni",
      "Eka",
      "Fajar",
      "Gina",
      "Hadi",
      "Indah",
      "Joko",
      "Kiki",
      "Lutfi",
      "Mega",
      "Naufal",
      "Olivia",
      "Putra",
      "Qory",
      "Raka",
      "Salsa",
      "Teguh",
    ];
    const namaBelakang = [
      "Rizky",
      "Putri",
      "Lestari",
      "Kurniawan",
      "Wulandari",
      "Maulana",
      "Safitri",
      "Pratama",
      "Permata",
      "Santoso",
      "Amelia",
      "Hakim",
      "Sari",
      "Ihsan",
      "Rahma",
      "Darma",
      "Anjani",
      "Febrian",
      "Nur",
      "Ramadhan",
    ];

    const newData = Array.from({ length: 30 }, (_, i) => {
      const nama = `${namaDepan[i % namaDepan.length]} ${
        namaBelakang[i % namaBelakang.length]
      }`;
      return {
        id: i + 1,
        nama,
        nisn: String(1000000000 + i + 1),
        jenisKelamin: nama.toLowerCase().includes("a")
          ? "Perempuan"
          : "Laki-laki",
        jurusan: course?.category || "PPLG",
        kelas: course?.classLevel || "XI-A",
      };
    });

    setDataSiswa(newData);
    localStorage.setItem("siswa_course_aktif", JSON.stringify(newData));
  }, [course]);

  const filteredData = dataSiswa.filter((siswa) =>
    siswa.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const confirmDelete = (id) => {
    setIdToDelete(id);
    alertDialog.onOpen();
  };

  const handleDelete = () => {
    const updated = dataSiswa.filter((siswa) => siswa.id !== idToDelete);
    setDataSiswa(updated);
    localStorage.setItem("siswa_course_aktif", JSON.stringify(updated));
    toast({
      title: "Siswa berhasil dihapus.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
    alertDialog.onClose();
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        bg="white"
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Heading fontSize="lg" color="gray.800">
          Daftar Siswa
        </Heading>
        <Input
          placeholder="Cari nama"
          size="sm"
          maxW="200px"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Flex>

      <Box bg="white" borderRadius="md" p={4} boxShadow="sm" overflowX="auto">
        <Table variant="striped" minWidth="1200px">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>NISN</Th>
              <Th>Jenis Kelamin</Th>
              <Th>Jurusan</Th>
              <Th>Kelas</Th>
              <Th textAlign="center">Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((siswa, index) => (
              <Tr key={siswa.id}>
                <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                <Td>{siswa.nama}</Td>
                <Td>{siswa.nisn}</Td>
                <Td>{siswa.jenisKelamin}</Td>
                <Td>{siswa.jurusan}</Td>
                <Td>{siswa.kelas}</Td>
                <Td textAlign="center">
                  <IconButton
                    icon={<img src={IconDelete} alt="hapus" width={16} />}
                    aria-label="Hapus"
                    colorScheme="red"
                    size="sm"
                    onClick={() => confirmDelete(siswa.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Alert Dialog Hapus */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={alertDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi Hapus</AlertDialogHeader>
            <AlertDialogBody>
              Apakah kamu yakin ingin menghapus siswa ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={alertDialog.onClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Pagination */}
      <Flex justify="center" mt={4} gap={2} wrap="wrap">
        <IconButton
          icon={<ArrowLeftIcon />}
          onClick={() => handlePageChange(1)}
          isDisabled={currentPage === 1}
        />
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            colorScheme={currentPage === i + 1 ? "blue" : "gray"}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          onClick={() => handlePageChange(totalPages)}
          isDisabled={currentPage === totalPages}
        />
      </Flex>
    </Box>
  );
};

export default SiswaKelas;
