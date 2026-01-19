import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
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
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import FormTambahPengguna from "../components/FormTambahPengguna";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";

const DataPengguna = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [showPasswordIndex, setShowPasswordIndex] = useState(null);
  const itemsPerPage = 10;

  const [masterData, setMasterData] = useState({});
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("dataPengguna");
    if (stored) setData(JSON.parse(stored));

    const storedMaster = localStorage.getItem("masterDataStorage");
    if (storedMaster) {
      try {
        setMasterData(JSON.parse(storedMaster));
      } catch {
        setMasterData({});
      }
    }
  }, []);

  const filteredData = data
    .filter(
      (item) =>
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      if (!filterBy || !filterValue) return true;
      switch (filterBy) {
        case "Jabatan":
          return item.jabatan === filterValue;
        case "Status":
          return item.status === filterValue;
        case "Mata Pelajaran":
          return item.mataPelajaran === filterValue;
        default:
          return true;
      }
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData
    .sort((a, b) => a.nama.localeCompare(b.nama))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getFilterOptions = () => {
    switch (filterBy) {
      case "Jabatan":
        return masterData.jabatan?.map((d) => d.field1) || [];
      case "Status":
        return masterData.statusGuru?.map((d) => d.field1) || [];
      case "Mata Pelajaran":
        return masterData.mataPelajaran?.map((d) => d.field1) || [];
      default:
        return [];
    }
  };

  const handleExportExcel = () => {
    const wsData = [
      ["Nama", "Email", "Jabatan", "Status", "Mata Pelajaran", "Password"],
      ...filteredData.map((d) => [
        d.nama,
        d.email,
        d.jabatan,
        d.status,
        Array.isArray(d.mataPelajaran)
          ? d.mataPelajaran.join(", ")
          : typeof d.mataPelajaran === "string"
          ? d.mataPelajaran
          : "-",
        d.password,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataPengguna");

    XLSX.writeFile(workbook, "data_pengguna.xlsx");
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
        "Email",
        "Jabatan",
        "Status",
        "Mata Pelajaran",
        "Password",
      ];
      const isHeaderValid =
        headers.length === expectedHeaders.length &&
        headers.every((h, i) => h?.trim() === expectedHeaders[i]);

      if (!isHeaderValid) {
        toast({
          title: "Format kolom tidak sesuai",
          description: expectedHeaders.join(", "),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const rows = dataExcel.slice(1);
      const newData = rows.map((r) => ({
        nama: r[0] || "",
        email: r[1] || "",
        jabatan: r[2] || "",
        status: r[3] || "",
        mataPelajaran: r[4] ? r[4].split(",").map((m) => m.trim()) : [], // parsing dari string ke array
        password: r[5] || "",
      }));

      const mergedData = [
        ...data,
        ...newData.filter((n) => !data.some((d) => d.email === n.email)),
      ];
      setData(mergedData);
      localStorage.setItem("dataPengguna", JSON.stringify(mergedData));

      toast({ title: "Import berhasil", status: "success" });
    };
    reader.readAsBinaryString(file);
  };

  const handleTambah = () => {
    setEditingData(null);
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingData(item);
    onOpen();
  };

  const handleDelete = (email) => {
    if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
      const updated = data.filter((d) => d.email !== email);
      setData(updated);
      localStorage.setItem("dataPengguna", JSON.stringify(updated));

      if (
        (currentPage - 1) * itemsPerPage >= updated.length &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }

      toast({ title: "Pengguna dihapus", status: "error" });
    }
  };

  const handleSave = (newData) => {
    if (!newData.nama || !newData.email) {
      return toast({ title: "Nama dan Email wajib diisi", status: "warning" });
    }

    setData((prev) => {
      const idx = prev.findIndex((d) => d.email === newData.email);
      const updated =
        idx !== -1
          ? [...prev.slice(0, idx), newData, ...prev.slice(idx + 1)]
          : [...prev, newData];
      localStorage.setItem("dataPengguna", JSON.stringify(updated));
      return updated;
    });

    onClose();
    toast({ title: "Data disimpan", status: "success" });
  };

  return (
    <>
      <Box px={4} pt={4} bg="#E3E9FB">
        <BreadcrumbsPath
          paths={[
            { label: "Menu Data", link: "/dashboard" },
            { label: "Data Pengguna" },
          ]}
        />
      </Box>
      <Box
        px={6}
        py={8}
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
          Data Pengguna
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          wrap="wrap"
          gap={4}
          mb={6}
        >
          {/* Kiri: Filter dan Reset */}
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
              <option value="Jabatan">Jabatan</option>
              <option value="Status">Status</option>
              <option value="Mata Pelajaran">Mata Pelajaran</option>
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

          {/* Kanan: Search + Tombol */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            gap={2}
            wrap="wrap"
            justify="flex-end"
          >
            <Input
              placeholder="Cari nama atau email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="210px"
            />

            <Button
              as="label"
              bg="#8B13E6"
              color="white"
              _hover={{ bg: "#6e0fbb" }}
              cursor="pointer"
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

            <Button
              bg="#4169E1"
              color="white"
              _hover={{ bg: "#355ACF" }}
              onClick={handleTambah}
            >
              Tambah Pengguna
            </Button>
          </Flex>
        </Flex>

        <Box overflowX="auto" w="full">
          <Table variant="striped" minW="1000px" size="sm">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Nama</Th>
                <Th>Email</Th>
                <Th>Jabatan</Th>
                <Th>Status</Th>
                <Th>Mata Pelajaran</Th>
                <Th>Kata Sandi</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((item, index) => (
                <Tr key={index}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td>{item.nama}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.jabatan}</Td>
                  <Td>{item.status}</Td>
                  <Td>
                    {Array.isArray(item.mataPelajaran) &&
                    item.mataPelajaran.length > 0 ? (
                      <ul style={{ paddingLeft: "16px", margin: 0 }}>
                        {item.mataPelajaran.map((mapel, i) => (
                          <li key={i}>{mapel}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Input
                        type={showPasswordIndex === index ? "text" : "password"}
                        value={item.password}
                        size="sm"
                        readOnly
                      />
                      <IconButton
                        icon={
                          showPasswordIndex === index ? (
                            <ViewOffIcon />
                          ) : (
                            <ViewIcon />
                          )
                        }
                        size="sm"
                        onClick={() =>
                          setShowPasswordIndex(
                            showPasswordIndex === index ? null : index
                          )
                        }
                      />
                    </HStack>
                  </Td>

                  <Td>
                    <HStack spacing={1}>
                      <IconButton
                        icon={
                          <img
                            src={IconEdit}
                            alt="Edit"
                            style={{ width: "16px", height: "16px" }}
                          />
                        }
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleEdit(item)}
                      />
                      <IconButton
                        icon={
                          <img
                            src={IconDelete}
                            alt="Hapus"
                            style={{ width: "16px", height: "16px" }}
                          />
                        }
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(item.email)}
                      />
                    </HStack>
                  </Td>
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

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingData ? "Edit Data Pengguna" : "Tambah Data Pengguna"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormTambahPengguna
                defaultValue={editingData}
                onSubmit={handleSave}
                isEdit={!!editingData}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                form="form-pengguna"
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
    </>
  );
};

export default DataPengguna;
