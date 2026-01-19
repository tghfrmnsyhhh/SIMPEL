import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  Flex,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import FormTambahSiswa from "../components/FormTambahSiswa.jsx";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";

const DataSiswa = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [masterData, setMasterData] = useState({});
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const [selectedDeleteNis, setSelectedDeleteNis] = useState(null);

  const [role, setRole] = useState("");
  useEffect(() => {
    const stored = localStorage.getItem("dataSiswa");
    if (stored) setData(JSON.parse(stored));

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRole(storedRole.toLowerCase());
  }, []);

  const itemsPerPage = 10;
  const filteredData = data
    .filter(
      (siswa) =>
        siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siswa.nis.includes(searchTerm)
    )
    .filter((siswa) => {
      if (!filterBy || !filterValue) return true;

      switch (filterBy) {
        case "Kelas":
          return siswa.kelas === filterValue;
        case "Jurusan":
          return siswa.jurusan === filterValue;
        case "Status":
          return siswa.status === filterValue;
        case "Jenis Kelamin":
          return siswa.jenisKelamin === filterValue;
        default:
          return true;
      }
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  console.log({
    currentPage,
    totalPages,
    itemsPerPage,
    filteredDataLength: filteredData.length,
  });
  const currentData =
    filteredData.length === 0
      ? []
      : filteredData
          .sort((a, b) => a.nama.localeCompare(b.nama))
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const storedMaster = localStorage.getItem("masterDataStorage");
    if (storedMaster) {
      try {
        setMasterData(JSON.parse(storedMaster));
      } catch {
        setMasterData({});
      }
    }
  }, []);

  const getFilterOptions = () => {
    switch (filterBy) {
      case "Kelas":
        return masterData.kelas?.map((d) => d.field1) || [];
      case "Jurusan":
        return masterData.jurusan?.map((d) => d.field1) || [];
      case "Status":
        return masterData.statusSiswa?.map((d) => d.field1) || [];
      case "Jenis Kelamin":
        return ["Laki-laki", "Perempuan"];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [filteredData, totalPages, currentPage]);

  const handleExportExcel = () => {
    const wsData = [
      [
        "Nama",
        "NIS",
        "Jenis Kelamin",
        "Kelas",
        "Jurusan",
        "Email",
        "No HP",
        "Status",
      ],
      ...filteredData.map((s) => [
        s.nama,
        s.nis,
        s.jenisKelamin,
        s.kelas,
        s.jurusan,
        s.email,
        s.noHp,
        s.status,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataSiswa");

    XLSX.writeFile(workbook, "data_siswa.xlsx");
  };

  const handleTambah = () => {
    setEditingData(null);
    onOpen();
  };

  const handleEdit = (siswa) => {
    setEditingData(siswa);
    onOpen();
  };

  const handleDelete = () => {
    const updated = data.filter((s) => s.nis !== selectedDeleteNis);
    setData(updated);
    localStorage.setItem("dataSiswa", JSON.stringify(updated));

    if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    toast({
      title: "Siswa dihapus",
      status: "error",
      duration: 3000,
      isClosable: true,
    });

    setSelectedDeleteNis(null);
    onDeleteClose();
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateNoHp = (no) => /^[0-9]{10,15}$/.test(no);

  const handleSave = (newData) => {
    if (!newData.nama || !newData.nis) {
      return toast({
        title: "Nama dan NIS wajib diisi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    if (!editingData) {
      const duplicate = data.some((s) => s.nis === newData.nis);
      if (duplicate) {
        return toast({
          title: "NIS sudah digunakan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    if (newData.noHp && !validateNoHp(newData.noHp)) {
      return toast({
        title: "Nomor HP tidak valid.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    if (newData.email && !validateEmail(newData.email)) {
      return toast({
        title: "Format email tidak valid.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    setData((prev) => {
      const idx = prev.findIndex((s) => s.nis === newData.nis);
      const updated =
        idx !== -1
          ? [...prev.slice(0, idx), newData, ...prev.slice(idx + 1)]
          : [...prev, newData];
      localStorage.setItem("dataSiswa", JSON.stringify(updated));
      return updated;
    });

    onClose();
    toast({
      title: "Data siswa disimpan",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const dataExcel = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Ambil dalam bentuk array 2D
      const headers = dataExcel[0];

      // Header yang wajib ada dan urutannya
      const expectedHeaders = [
        "Nama",
        "NIS",
        "Jenis Kelamin",
        "Kelas",
        "Jurusan",
        "Email",
        "No HP",
        "Status",
      ];

      // Cek apakah sama persis
      const isHeaderValid =
        headers.length === expectedHeaders.length &&
        headers.every((h, i) => h?.trim() === expectedHeaders[i]);

      if (!isHeaderValid) {
        toast({
          title: "Format kolom tidak sesuai",
          description:
            "Pastikan file Excel memiliki header: " +
            expectedHeaders.join(", "),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      // Lanjutkan konversi dari baris ke objek
      const rows = dataExcel.slice(1);
      const newData = rows.map((row) => ({
        nama: row[0] || "",
        nis: row[1] || "",
        jenisKelamin: row[2] || "",
        kelas: row[3] || "",
        jurusan: row[4] || "",
        email: row[5] || "",
        noHp: row[6] || "",
        status: row[7] || "",
      }));

      const mergedData = [
        ...data,
        ...newData.filter((s) => !data.some((d) => d.nis === s.nis)),
      ];

      setData(mergedData);
      localStorage.setItem("dataSiswa", JSON.stringify(mergedData));

      toast({
        title: "Import berhasil",
        description: `${newData.length} data siswa ditambahkan.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Box px={4} pt={4} bg="#E3E9FB" p={{ base: 4, md: 5 }}>
        <BreadcrumbsPath
          paths={[
            { label: "Menu Data", link: "/dashboard" },
            { label: "Data Siswa" },
          ]}
        />
      </Box>
      <Box
        px={{ base: 4, md: 6 }}
        py={{ base: 6, md: 8 }}
        minH="calc(100vh - 60px)"
        mx="auto"
        borderRadius="12px"
        boxShadow="0 0 10px rgba(255, 0, 0, 0.05)"
        fontFamily="poppins"
        bgColor="white"
      >
        <Heading
          fontSize={{ base: "22px", md: "28px" }}
          fontWeight="bold"
          mb={4}
        >
          Data Siswa
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          flexWrap="wrap"
          gap={4}
          mb={6}
        >
          {/* Kiri: Filter + Reset */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align="center"
            gap={2}
            wrap="wrap"
            flex="1"
            minW="260px"
          >
            <Select
              placeholder="Pilih Jenis Filter"
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setFilterValue("");
              }}
              maxW="180px"
            >
              <option value="Kelas">Kelas</option>
              <option value="Jurusan">Jurusan</option>
              <option value="Status">Status</option>
              <option value="Jenis Kelamin">Jenis Kelamin</option>
            </Select>

            <Select
              placeholder="Pilih"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              isDisabled={!filterBy}
              maxW="180px"
            >
              {getFilterOptions().map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Button
              size="sm"
              colorScheme="red"
              variant="solid"
              onClick={() => {
                setFilterBy("");
                setFilterValue("");
                setSearchTerm("");
              }}
            >
              Reset
            </Button>
          </Flex>

          {/* Kanan: Search + Action Buttons */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            gap={2}
            wrap="wrap"
            justify="flex-end"
          >
            <Input
              placeholder="Cari nama atau NIS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="200px"
            />

            <Button
              as="label"
              cursor="pointer"
              bg="#8B13E6"
              color="white"
              _hover={{ bg: "#6e0fbb" }}
            >
              Import Excel
              <Input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleImportExcel}
              />
            </Button>

            <Button
              bg="#11BF02"
              color="white"
              _hover={{ bg: "#0fa802" }}
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>

            {role === "admin" && (
              <Button
                bg="#4169E1"
                color="white"
                _hover={{ bg: "#355ACF" }}
                onClick={handleTambah}
              >
                Tambah Siswa
              </Button>
            )}
          </Flex>
        </Flex>

        <Box overflowX="auto" w="full">
          <Table
            variant="striped"
            minW={{ base: "800px", md: "1000px" }}
            size="sm"
          >
            <Thead bg="white" fontFamily={"poppins"}>
              <Tr>
                <Th textAlign="center">No</Th>
                <Th textAlign="center">Nama</Th>
                <Th textAlign="center">NIS</Th>
                <Th textAlign="center">Jenis Kelamin</Th>
                <Th textAlign="center">Kelas</Th>
                <Th textAlign="center">Jurusan</Th>
                <Th textAlign="center">Email</Th>
                <Th textAlign="center">No HP</Th>
                <Th textAlign="center">Status</Th>
                {role === "admin" && <Th textAlign="center">Aksi</Th>}
                {/* ✅ */}
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((siswa, index) => (
                <Tr key={`${siswa.nis || ""}-${index}`}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td>{siswa.nama}</Td>
                  <Td>{siswa.nis}</Td>
                  <Td>{siswa.jenisKelamin}</Td>
                  <Td>{siswa.kelas}</Td>
                  <Td>{siswa.jurusan}</Td>
                  <Td>{siswa.email}</Td>
                  <Td>{siswa.noHp}</Td>
                  <Td>{siswa.status}</Td>
                  {role === "admin" && ( // ✅
                    <Td>
                      <HStack spacing={1}>
                        <IconButton
                          icon={<img src={IconEdit} alt="edit" width={16} />}
                          size="sm"
                          onClick={() => handleEdit(siswa)}
                          colorScheme="yellow"
                        />
                        <IconButton
                          icon={<img src={IconDelete} alt="hapus" width={16} />}
                          size="sm"
                          onClick={() => {
                            setSelectedDeleteNis(siswa.nis);
                            onDeleteOpen();
                          }}
                          colorScheme="red"
                        />
                      </HStack>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

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

        {role === "admin" && ( // ✅ sembunyikan modal jika bukan admin
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {editingData ? "Edit Data Siswa" : "Tambah Data Siswa"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormTambahSiswa
                  defaultValue={editingData}
                  onSubmit={handleSave}
                  isEdit={!!editingData}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  form="form-siswa"
                  bg="#4169E1"
                  color="white"
                  _hover={{ bg: "#355ACF" }}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Hapus
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DataSiswa;
