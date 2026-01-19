import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  useToast,
  IconButton,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";
import * as XLSX from "xlsx";

const LOCAL_KEY = "penilaian_siswa";
const BOBOT_KEY = "bobot_penilaian";

const Penilaian = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bobot, setBobot] = useState({ tugas: 40, uts: 30, uas: 30 });
  const toast = useToast();
  const alertDialog = useDisclosure();
  const cancelRef = useRef();
  const [idToDelete, setIdToDelete] = useState(null);

  const itemsPerPage = 10;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const siswaAktif = JSON.parse(localStorage.getItem("siswa_course_aktif"));

    const stored = JSON.parse(localStorage.getItem(LOCAL_KEY));

    if (stored && stored.length > 0) {
      // Cocokkan dengan NISN siswa aktif
      if (
        siswaAktif &&
        stored.every((item) => siswaAktif.find((s) => s.nisn === item.nisn))
      ) {
        setData(stored);
        return;
      }
    }

    if (siswaAktif) {
      const nilaiTambahan = {};
      [...Array(13).keys()].forEach((i) => {
        nilaiTambahan[`Tugas ${i + 1}`] = "";
      });

      const siswaDenganNilai = siswaAktif.map((item) => ({
        ...item,
        ...nilaiTambahan,
        UTS: "",
        UAS: "",
      }));

      setData(siswaDenganNilai);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(siswaDenganNilai));
    }

    const savedBobot = localStorage.getItem(BOBOT_KEY);
    if (savedBobot) setBobot(JSON.parse(savedBobot));
  }, []);

  const nilaiKeys = [
    ...Array.from({ length: 7 }, (_, i) => `Tugas ${i + 1}`),
    "PTS",
    ...Array.from({ length: 6 }, (_, i) => `Tugas ${i + 8}`),
    "PAS",
  ];
  const tugasKeys = nilaiKeys.filter((k) => k.includes("Tugas"));
  const filteredData = data.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const calculateAverage = (item) => {
    const tugasNilai = tugasKeys.map((k) => Number(item[k] ?? 0));
    const rataTugas =
      tugasNilai.length > 0
        ? tugasNilai.reduce((a, b) => a + b, 0) / tugasNilai.length
        : 0;
    const uts = Number(item.UTS ?? 0);
    const uas = Number(item.UAS ?? 0);
    const avg = (
      rataTugas * (bobot.tugas / 100) +
      uts * (bobot.uts / 100) +
      uas * (bobot.uas / 100)
    ).toFixed(2);
    return avg;
  };

  const totalBobot =
    Number(bobot.tugas) + Number(bobot.uts) + Number(bobot.uas);

  const handleEdit = (id) => {
    const found = data.find((d) => d.id === id);
    setEditId(id);
    setEditValues({ ...found });
  };

  const saveEdit = (id) => {
    const updated = data.map((d) => (d.id === id ? { ...editValues } : d));
    setData(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setEditId(null);
    toast({ title: "Nilai disimpan", status: "success", duration: 2000 });
  };

  const confirmDelete = (id) => {
    setIdToDelete(id);
    alertDialog.onOpen();
  };

  const handleDelete = () => {
    const updated = data.filter((d) => d.id !== idToDelete);
    setData(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    toast({
      title: "Data berhasil dihapus",
      status: "error",
      duration: 2000,
    });
    alertDialog.onClose();
  };

  const handleBobotChange = (field, value) => {
    const val = value === "" ? "" : Number(value);
    setBobot((prev) => ({ ...prev, [field]: val }));
  };

  const simpanBobot = () => {
    if (totalBobot !== 100) {
      toast({
        title: "Total bobot harus 100%",
        status: "error",
        duration: 2000,
      });
      return;
    }
    localStorage.setItem(BOBOT_KEY, JSON.stringify(bobot));
    toast({ title: "Bobot disimpan", status: "success", duration: 2000 });
  };

  const resetBobot = () => {
    const defaultBobot = { tugas: 40, uts: 30, uas: 30 };
    setBobot(defaultBobot);
    localStorage.setItem(BOBOT_KEY, JSON.stringify(defaultBobot));
    toast({ title: "Bobot direset", status: "info", duration: 2000 });
  };

  const handleExportExcel = () => {
    const wsData = [
      ["Nama", "NISN", ...nilaiKeys, "Rata-rata"],
      ...data.map((item) => [
        item.nama,
        item.nisn,
        ...nilaiKeys.map((k) => item[k] ?? 0),
        calculateAverage(item),
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penilaian");
    XLSX.writeFile(workbook, "data_penilaian.xlsx");
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
      const expected = ["Nama", "NISN", ...nilaiKeys, "Rata-rata"];
      const isHeaderValid =
        headers.length >= 3 && expected.every((h, i) => headers[i] === h);
      if (!isHeaderValid) {
        toast({
          title: "Format kolom tidak sesuai",
          status: "error",
          duration: 3000,
        });
        return;
      }
      const rows = dataExcel.slice(1);
      const newData = rows.map((row, i) => {
        const nilai = {};
        nilaiKeys.forEach((k, idx) => {
          nilai[k] = Number(row[idx + 2]) || 0;
        });
        return {
          id: Date.now() + i,
          nama: row[0] || "",
          nisn: row[1] || "",
          ...nilai,
        };
      });
      setData(newData);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newData));
      toast({ title: "Import berhasil", status: "success", duration: 3000 });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box p={6}>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        bg="white"
        p={4}
        rounded="lg"
        boxShadow="sm"
      >
        <Text fontSize="lg" fontWeight="bold" color="black">
          Daftar Penilaian Siswa
        </Text>
        <Flex gap={2} align="center" flexWrap="wrap">
          <Input
            placeholder="Cari nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="200px"
            bg="white"
          />
          <Button as="label" colorScheme="green" cursor="pointer">
            Import Excel
            <Input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={handleImportExcel}
            />
          </Button>
          <Button colorScheme="purple" onClick={handleExportExcel}>
            Export Excel
          </Button>
        </Flex>
      </Flex>

      <Box bg="gray.50" p={4} mb={4} rounded="md" shadow="sm">
        <Text fontSize="xl" mb={1} color="black" fontWeight="bold">
          Bobot{" "}
        </Text>
        <Text>
          Tugas: <strong>{bobot.tugas}%</strong>, PTS:{" "}
          <strong>{bobot.uts}%</strong> PAS: <strong>{bobot.uas}%</strong>.
        </Text>
        <Flex gap={4} mb={2} wrap="wrap">
          <Input
            type="number"
            value={bobot.tugas}
            onChange={(e) => handleBobotChange("tugas", e.target.value)}
            placeholder="Bobot Tugas"
            max={100}
            min={0}
            width="100px"
          />
          <Input
            type="number"
            value={bobot.uts}
            onChange={(e) => handleBobotChange("uts", e.target.value)}
            placeholder="Bobot UTS"
            max={100}
            min={0}
            width="100px"
          />
          <Input
            type="number"
            value={bobot.uas}
            onChange={(e) => handleBobotChange("uas", e.target.value)}
            placeholder="Bobot UAS"
            max={100}
            min={0}
            width="100px"
          />
          <Button colorScheme="blue" onClick={simpanBobot}>
            Simpan Bobot
          </Button>
          <Button onClick={resetBobot} colorScheme="red">
            Reset
          </Button>
        </Flex>
        {totalBobot !== 100 && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Total bobot saat ini: {totalBobot}% (harus 100%)
          </Alert>
        )}
      </Box>

      <Box overflowX="auto" bg="white" p={4} rounded="md" shadow="sm">
        <Table size="sm" variant="striped" colorScheme="gray" minWidth="1400px">
          <Thead bg="gray.100">
            <Tr>
              <Th
                position="sticky"
                left="0"
                bg="gray.100"
                zIndex="3"
                minW="60px"
                maxW="60px"
              >
                No
              </Th>
              <Th
                position="sticky"
                left="50px"
                bg="gray.100"
                zIndex="3"
                minW="160px"
                maxW="160px"
              >
                Nama
              </Th>
              <Th
                position="sticky"
                left="210px"
                bg="gray.100"
                zIndex="3"
                minW="130px"
                maxW="130px"
              >
                NISN
              </Th>
              {nilaiKeys.map((k, i) => (
                <Th key={i} textAlign="center" w="90px">
                  {k === "PTS" || k === "PAS" ? k : `Tugas ${i + 1}`}
                </Th>
              ))}
              <Th textAlign="center" w="100px">
                Rata²
              </Th>
              <Th textAlign="center" w="100px">
                Aksi
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((item, index) => (
              <Tr key={item.id}>
                <Td
                  position="sticky"
                  left="0"
                  bg="white"
                  zIndex={2}
                  minW="50px"
                >
                  {startIndex + index + 1}
                </Td>
                <Td
                  position="sticky"
                  left="50px"
                  bg="white"
                  zIndex={2}
                  minW="160px"
                >
                  {item.nama}
                </Td>
                <Td
                  position="sticky"
                  left="210px"
                  bg="white"
                  zIndex={2}
                  minW="130px"
                >
                  {item.nisn}
                </Td>

                {nilaiKeys.map((key) => {
                  const val =
                    editId === item.id
                      ? editValues[key] !== undefined
                        ? editValues[key]
                        : ""
                      : item[key] !== undefined
                      ? item[key]
                      : "";

                  return (
                    <Td key={key} w="140px" maxW="140px">
                      {editId === item.id ? (
                        <Input
                          size="md"
                          height="40px"
                          fontSize="lg"
                          width="70px"
                          px={2}
                          type="number"
                          textAlign="center"
                          borderRadius="md"
                          fontWeight="bold"
                          bg={val !== "" ? "blue.50" : "white"}
                          color={
                            val === ""
                              ? "gray.500"
                              : val >= 75
                              ? "green.600"
                              : val >= 50
                              ? "red.500"
                              : "red.500"
                          }
                          value={val}
                          onChange={(e) => {
                            const inputVal = e.target.value;

                            let newVal = inputVal;

                            if (inputVal === "") {
                              newVal = "";
                            } else if (!isNaN(inputVal)) {
                              const parsed = Number(inputVal);
                              if (parsed < 0) newVal = 0;
                              else if (parsed > 100) newVal = 100;
                              else newVal = parsed;
                            }

                            setEditValues({
                              ...editValues,
                              [key]: newVal,
                            });
                          }}
                        />
                      ) : (
                        <Text
                          textAlign="center"
                          fontWeight="bold"
                          fontSize="md"
                          color={
                            val === ""
                              ? "gray.400"
                              : val >= 70
                              ? "green.600"
                              : val >= 50
                              ? "red.500"
                              : "red.500"
                          }
                        >
                          {val !== "" ? val : "-"}
                        </Text>
                      )}
                    </Td>
                  );
                })}

                <Td textAlign="center" fontWeight="bold" w="100px">
                  {calculateAverage(item)}
                </Td>
                <Td w="100px">
                  <HStack justify="center">
                    {editId === item.id ? (
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => saveEdit(item.id)}
                      >
                        Simpan
                      </Button>
                    ) : (
                      <IconButton
                        icon={<img src={IconEdit} alt="edit" width={16} />}
                        size="xs"
                        colorScheme="yellow"
                        onClick={() => handleEdit(item.id)}
                        aria-label="Edit"
                      />
                    )}
                    <IconButton
                      icon={<img src={IconDelete} alt="hapus" width={16} />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => confirmDelete(item.id)}
                      aria-label="Hapus"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Konfirmasi Hapus */}
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
              Apakah kamu yakin ingin menghapus data ini?
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

export default Penilaian;
