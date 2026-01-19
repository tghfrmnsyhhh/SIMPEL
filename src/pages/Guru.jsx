import React, { useState, useEffect, useRef } from "react";
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
  Image,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import FormTambahGuru from "../components/FormTambahGuru";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import * as XLSX from "xlsx";

const DataGuru = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const toast = useToast();
  const [role, setRole] = useState("");

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRole(storedRole.toLowerCase());
  }, []);

  const [masterData, setMasterData] = useState({});

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

  useEffect(() => {
    const dataGuruLocal = localStorage.getItem("dataGuru");
    if (dataGuruLocal) {
      setData(JSON.parse(dataGuruLocal));
    }
  }, []);

  const itemsPerPage = 10;
  const filteredData = data
    .filter(
      (guru) =>
        guru.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guru.nip.includes(searchQuery)
    )
    .filter((guru) => {
      if (!filterBy || !filterValue) return true;

      switch (filterBy) {
        case "Jabatan":
          return guru.jabatan === filterValue;
        case "Status":
          return guru.status === filterValue;
        case "Mata Pelajaran":
          return Array.isArray(guru.mataPelajaran)
            ? guru.mataPelajaran.includes(filterValue)
            : guru.mataPelajaran === filterValue;
        case "Jenis Kelamin":
          return guru.jenisKelamin === filterValue;
        default:
          return true;
      }
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData
    .sort((a, b) => a.nama.localeCompare(b.nama))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExportExcel = () => {
    const wsData = [
      [
        "Nama",
        "NIP",
        "Jenis Kelamin",
        "Jabatan",
        "Mata Pelajaran",
        "No. HP",
        "Email",
        "Status",
      ],

      ...filteredData.map((guru) => [
        guru.nama,
        guru.nip,
        guru.jenisKelamin,
        guru.jabatan,
        Array.isArray(guru.mataPelajaran)
          ? guru.mataPelajaran.join(", ")
          : guru.mataPelajaran || "",
        guru.noHP,
        guru.email,
        guru.status,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataGuru");

    XLSX.writeFile(workbook, "data_guru.xlsx");
  };

  const handleTambahGuru = () => {
    setEditingData(null);
    onOpen();
  };

  const handleEdit = (guru) => {
    setEditingData(guru);
    onOpen();
  };

  const handleDelete = () => {
    const updatedData = data.filter((guru) => guru.id !== selectedDeleteId);
    setData(updatedData);
    localStorage.setItem("dataGuru", JSON.stringify(updatedData));

    if (
      (currentPage - 1) * itemsPerPage >= updatedData.length &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }

    toast({
      title: "Guru dihapus",
      description: "Data guru berhasil dihapus.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });

    setSelectedDeleteId(null);
    onDeleteClose();
  };
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateNoHp = (nohp) => /^[0-9]{10,15}$/.test(nohp);

  const handleSave = (newData) => {
    if (!newData.nama) {
      return toast({
        title: "Nama wajib diisi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    if (
      (newData.status === "PNS" || newData.status === "PPPK") &&
      newData.nip &&
      !/^\d{8,18}$/.test(newData.nip.trim())
    ) {
      return toast({
        title: "Format NIP tidak valid.",
        description: "Gunakan angka 8–18 digit jika diisi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (!editingData && newData.nip.trim() !== "") {
      const isDuplicate = data.some(
        (g) => g.nip && g.nip === newData.nip.trim()
      );
      if (isDuplicate) {
        return toast({
          title: "NIP sudah digunakan",
          description: "Setiap guru harus memiliki NIP yang unik.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    if (newData.noHp && !validateNoHp(newData.noHp)) {
      return toast({
        title: "Nomor HP tidak valid.",
        description: "Masukkan nomor HP dengan 10-15 digit angka.",
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

    const guruBaru = {
      ...newData,
      id: editingData?.id || Date.now(),
    };

    const updatedData = editingData
      ? data.map((g) => (g.id === editingData.id ? guruBaru : g))
      : [...data, guruBaru];

    setData(updatedData);
    localStorage.setItem("dataGuru", JSON.stringify(updatedData));

    onClose();
    setEditingData(null);

    toast({
      title: "Data guru disimpan",
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

      const dataExcel = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = dataExcel[0];

      const expectedHeaders = [
        "Nama",
        "NIP",
        "Jenis Kelamin",
        "Jabatan",
        "Mata Pelajaran",
        "No. HP",
        "Email",
        "Status",
      ];

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

      const rows = dataExcel.slice(1);
      const newData = rows.map((row) => ({
        id: Date.now() + Math.random(),
        nama: row[0] || "",
        nip: row[1] || "",
        jenisKelamin: row[2] || "",
        jabatan: row[3] || "",
        mataPelajaran: (row[4] || "").split(",").map((m) => m.trim()),
        noHP: row[4] || "",
        email: row[5] || "",
        status: row[6] || "",
      }));

      const mergedData = [
        ...data,
        ...newData.filter((g) => !data.some((d) => d.nip === g.nip)),
      ];

      setData(mergedData);
      localStorage.setItem("dataGuru", JSON.stringify(mergedData));

      toast({
        title: "Import berhasil",
        description: `${newData.length} data guru ditambahkan.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      {/* Breadcrumb di luar area putih */}
      <Box px={4} pt={4} bg="#E3E9FB" p={{ base: 4, md: 5 }}>
        <BreadcrumbsPath
          paths={[
            { label: "Menu Data", link: "/dashboard" },
            { label: "Data Guru" },
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
          textAlign="left"
          mb={4}
          mt={1}
          fontFamily={"poppins"}
        >
          Data Guru
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          flexWrap="wrap"
          gap={4}
          mb={6}
        >
          {/* Bagian kiri: Filter */}
          <Flex wrap="wrap" gap={2} align="center" flexGrow={1}>
            <Select
              placeholder="Pilih Jenis Filter"
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setFilterValue("");
              }}
              maxW="180px"
            >
              {[
                { label: "Jabatan", key: "jabatan" },
                { label: "Status", key: "statusGuru" },
                { label: "Mata Pelajaran", key: "mataPelajaran" },
                { label: "Jenis Kelamin", key: "jenisKelamin" },
              ]
                .filter((filter) => {
                  if (filter.key === "jenisKelamin") return true;
                  return masterData?.[filter.key]?.length > 0;
                })
                .map((filter) => (
                  <option key={filter.key} value={filter.label}>
                    {filter.label}
                  </option>
                ))}
            </Select>

            <Select
              placeholder="Pilih"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              isDisabled={!filterBy}
              maxW="180px"
            >
              {(function getFilterOptions() {
                switch (filterBy) {
                  case "Jabatan":
                    return masterData.jabatan?.map((d) => d.field1) || [];
                  case "Status":
                    return masterData.statusGuru?.map((d) => d.field1) || [];
                  case "Mata Pelajaran":
                    return masterData.mataPelajaran?.map((d) => d.field1) || [];
                  case "Jenis Kelamin":
                    return ["Laki-laki", "Perempuan"];
                  default:
                    return [];
                }
              })().map((val, i) => (
                <option key={i} value={val}>
                  {val}
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
                setSearchQuery("");
              }}
            >
              Reset
            </Button>
          </Flex>

          {/* Bagian kanan: Cari + Import + Export + Tambah */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            gap={2}
            flexWrap="wrap"
          >
            <Input
              placeholder="Cari nama atau NIP"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={handleTambahGuru}
              >
                Tambah Guru
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
                <Th textAlign={"center"}>No</Th>
                <Th textAlign={"center"}>Nama</Th>
                <Th textAlign={"center"}>NIP/NIKKI</Th>
                <Th textAlign={"center"}>Jenis Kelamin</Th>
                <Th textAlign={"center"}>Jabatan</Th>
                <Th textAlign="center">Mata Pelajaran</Th>
                <Th textAlign={"center"}>Email</Th>
                <Th textAlign={"center"}>No.HP</Th>
                <Th textAlign={"center"}>Status</Th>
                {role === "admin" && <Th textAlign={"center"}>Aksi</Th>}
              </Tr>
            </Thead>
            <Tbody fontFamily={"poppins"}>
              {currentData.map((guru, index) => (
                <Tr key={guru.id}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td>{guru.nama}</Td>
                  <Td>{guru.nip}</Td>
                  <Td textAlign={"center"}>{guru.jenisKelamin}</Td>
                  <Td textAlign={"center"}>{guru.jabatan}</Td>
                  <Td textAlign="center">
                    {Array.isArray(guru.mataPelajaran)
                      ? guru.mataPelajaran.join(", ")
                      : guru.mataPelajaran || "-"}
                  </Td>
                  <Td textAlign={"center"}>{guru.email}</Td>
                  <Td>{guru.noHp}</Td>
                  <Td textAlign={"center"}>{guru.status}</Td>
                  <Td>
                    <HStack spacing={1}>
                      {role === "admin" && (
                        <>
                          <IconButton
                            icon={<Image src={IconEdit} boxSize="16px" />}
                            size="sm"
                            colorScheme="yellow"
                            aria-label="Edit"
                            onClick={() => handleEdit(guru)}
                          />
                          <IconButton
                            icon={<Image src={IconDelete} boxSize="16px" />}
                            size="sm"
                            colorScheme="red"
                            aria-label="Delete"
                            onClick={() => {
                              setSelectedDeleteId(guru.id);
                              onDeleteOpen();
                            }}
                          />
                        </>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Flex justify="center" mt={4} gap={2} align="center" wrap="wrap">
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={() => handlePageChange(1)}
            isDisabled={currentPage === 1}
            aria-label="First Page"
          />
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            aria-label="Previous Page"
          />
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
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
            aria-label="Next Page"
          />
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={() => handlePageChange(totalPages)}
            isDisabled={currentPage === totalPages}
            aria-label="Last Page"
          />
        </Flex>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setEditingData(null);
          }}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingData?.nip ? "Edit Data Guru" : "Tambah Data Guru"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormTambahGuru
                defaultValue={editingData}
                onSubmit={handleSave}
                isEdit={!!editingData}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                form="form-guru"
                bg="#4169E1"
                color="white"
                _hover={{ bg: "#355ACF" }}
              >
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Hapus
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini
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

export default DataGuru;
