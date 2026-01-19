import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Button,
  useDisclosure,
  useToast,
  Text,
  useColorModeValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  Image,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import MasterDataModal from "../components/MasterDataModal";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import iconEdit from "../assets/icons/Edit.png";
import iconDelete from "../assets/icons/Hapus.png";
import * as XLSX from "xlsx";

const LOCAL_STORAGE_KEY = "masterDataStorage";

const masterListDef = [
  {
    key: "jurusan",
    title: "Jurusan",
    field1Label: "Nama Jurusan",
    field2Label: "Kepala Jurusan",
  },
  {
    key: "kelas",
    title: "Kelas",
    field1Label: "Nama Kelas",
    field2Label: "Wali Kelas",
  },
  {
    key: "mataPelajaran",
    title: "Mata Pelajaran",
    field1Label: "Nama Mata Pelajaran",
    field2Label: "Jenis Mata Pelajaran",
  },
  {
    key: "statusGuru",
    title: "Status Guru",
    field1Label: "Status Guru",
    field2Label: "Keterangan",
  },
  {
    key: "statusSiswa",
    title: "Status Siswa",
    field1Label: "Status Siswa",
    field2Label: "Keterangan",
  },
  {
    key: "tahunAjar",
    title: "Tahun Ajaran",
    field1Label: "Tahun Ajaran",
    field2Label: "Semester",
  },
  {
    key: "jabatan",
    title: "Jabatan",
    field1Label: "Nama Jabatan",
    field2Label: "Role",
  },
];

const MasterData = () => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const tableHeadBg = useColorModeValue("white");
  const bgContainer = useColorModeValue("#E3E9FB");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(masterListDef[0].key);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ field1: "", field2: "" });
  const [deleteIndex, setDeleteIndex] = useState(null);
  const cancelRef = useRef();
  const alertDialog = useDisclosure();

  const [masterData, setMasterData] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const parsed = JSON.parse(stored) || {};
      const initial = {};
      for (const m of masterListDef) {
        initial[m.key] = Array.isArray(parsed[m.key]) ? parsed[m.key] : [];
      }
      return initial;
    } catch {
      return masterListDef.reduce((acc, m) => ({ ...acc, [m.key]: [] }), {});
    }
  });

  useEffect(() => {
    const isEmpty = Object.values(masterData).every(
      (arr) => Array.isArray(arr) && arr.length === 0
    );

    if (isEmpty) {
      const defaultData = {
        jabatan: [
          { field1: "Admin", field2: "admin" },
          { field1: "Admin", field2: "admin" },
        ],
        jurusan: [
          { field1: "Rekayasa Perangkat Lunak", field2: "Budi Santoso" },
          { field1: "Teknik Komputer dan Jaringan", field2: "Siti Aminah" },
        ],
        kelas: [
          { field1: "X RPL 1", field2: "Pak Budi" },
          { field1: "X TKJ 1", field2: "Bu Siti" },
        ],
        mataPelajaran: [
          { field1: "Pemrograman Dasar", field2: "Normatif" },
          { field1: "Jaringan Dasar", field2: "Produktif" },
        ],
        statusGuru: [
          { field1: "PNS", field2: "Tetap" },
          { field1: "Honorer", field2: "Kontrak" },
        ],
        statusSiswa: [
          { field1: "Aktif", field2: "Masih belajar" },
          { field1: "Lulus", field2: "Sudah menyelesaikan pendidikan" },
        ],
        tahunAjar: [
          { field1: "2024/2025", field2: "Ganjil" },
          { field1: "2024/2025", field2: "Genap" },
        ],
      };

      // Gabungkan dengan masterData saat ini (jaga-jaga kalau sebagian sudah ada)
      const filledData = {};
      for (const item of masterListDef) {
        filledData[item.key] = masterData[item.key]?.length
          ? masterData[item.key]
          : defaultData[item.key] || [];
      }

      setMasterData(filledData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filledData));
      console.log("✅ Master data default berhasil dimuat");
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(masterData));
    }
  }, [masterData]);

  const handleAdd = () => {
    setForm({ field1: "", field2: "" });
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (index) => {
    const item = masterData[activeTab][index];
    setForm({ field1: item.field1, field2: item.field2 });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const { field1, field2 } = form;
    if (!field1 || !field2) {
      toast({ title: "Isi semua field.", status: "warning", duration: 2000 });
      return;
    }

    // Cek jika field1 sudah ada (abaikan field2)
    const exists = masterData[activeTab].some(
      (item, idx) =>
        item.field1.trim().toLowerCase() === field1.trim().toLowerCase() &&
        idx !== editIndex
    );

    if (exists) {
      toast({
        title: `Data dengan nama "${field1}" sudah ada.`,
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setMasterData((prev) => {
      const updated = [...prev[activeTab]];
      if (editIndex !== null) updated[editIndex] = { ...form };
      else updated.push({ ...form });
      toast({ title: `Data berhasil disimpan`, status: "success" });
      return { ...prev, [activeTab]: updated };
    });

    setModalOpen(false);
    restoreField(field1, activeTab);
  };

  const handleDeleteConfirm = (index) => {
    setDeleteIndex(index);
    alertDialog.onOpen();
  };

  const handleDelete = () => {
    const deletedItem = masterData[activeTab][deleteIndex];

    setMasterData((prev) => {
      const updated = prev[activeTab].filter((_, i) => i !== deleteIndex);
      toast({ title: `Data berhasil dihapus`, status: "error" });

      syncDependentData(deletedItem.field1, activeTab);

      return { ...prev, [activeTab]: updated };
    });

    alertDialog.onClose();
  };

  const handleImportExcel = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const imported = jsonData
        .slice(1)
        .map((row) => ({ field1: row[0], field2: row[1] }))
        .filter((r) => r.field1 && r.field2);
      if (imported.length === 0)
        return toast({ title: "Data tidak valid.", status: "warning" });
      setMasterData((prev) => ({
        ...prev,
        [key]: [...prev[key], ...imported],
      }));
      toast({
        title: `Berhasil impor ${imported.length} data`,
        status: "success",
      });
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleExportExcel = (key) => {
    const data = masterData[key];
    if (!data.length)
      return toast({ title: "Tidak ada data.", status: "warning" });
    const wsData = [
      [
        masterListDef.find((m) => m.key === key).field1Label,
        masterListDef.find((m) => m.key === key).field2Label,
      ],
      ...data.map((d) => [d.field1, d.field2]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${key}.xlsx`);
  };

  const syncDependentData = (deletedValue, key) => {
    const keyMap = {
      jurusan: ["dataSiswa", "dataGuru"],
      kelas: ["dataSiswa"],
      jabatan: ["dataGuru"],
      statusGuru: ["dataGuru"],
      statusSiswa: ["dataSiswa"],
    };

    const fieldMap = {
      jurusan: "jurusan",
      kelas: "kelas",
      jabatan: "jabatan",
      statusGuru: "status",
      statusSiswa: "status",
    };

    const relatedKeys = keyMap[key];
    const targetField = fieldMap[key];

    if (!relatedKeys || !targetField) return;

    const deletedMapping = JSON.parse(
      localStorage.getItem("deletedRelations") || "{}"
    );
    deletedMapping[key] = deletedMapping[key] || [];

    relatedKeys.forEach((storageKey) => {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const updated = parsed.map((item) => {
        if (item[targetField] === deletedValue) {
          const identifier = item.nis || item.nip || item.email || item.nama;
          deletedMapping[key].push({
            id: identifier,
            field: targetField,
            prevValue: deletedValue,
          });
          return { ...item, [targetField]: "" };
        }
        return item;
      });

      localStorage.setItem(storageKey, JSON.stringify(updated));
    });

    localStorage.setItem("deletedRelations", JSON.stringify(deletedMapping));
  };

  const restoreField = (addedValue, key) => {
    const fieldMap = {
      jurusan: "jurusan",
      kelas: "kelas",
      jabatan: "jabatan",
      statusGuru: "status",
      statusSiswa: "status",
    };

    const keyMap = {
      jurusan: ["dataSiswa", "dataGuru"],
      kelas: ["dataSiswa"],
      jabatan: ["dataGuru"],
      statusGuru: ["dataGuru"],
      statusSiswa: ["dataSiswa"],
    };

    const relatedKeys = keyMap[key];
    const targetField = fieldMap[key];
    const deletedMapping = JSON.parse(
      localStorage.getItem("deletedRelations") || "{}"
    );

    if (!relatedKeys || !deletedMapping[key]) return;

    relatedKeys.forEach((storageKey) => {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const updated = parsed.map((item) => {
        const identifier = item.nis || item.nip || item.email || item.nama;

        const wasCleared = deletedMapping[key].find(
          (m) => m.id === identifier && m.prevValue === addedValue
        );

        if (wasCleared && item[targetField] === "") {
          return { ...item, [targetField]: addedValue };
        }
        return item;
      });

      localStorage.setItem(storageKey, JSON.stringify(updated));
    });

    // Bersihkan entri yang sudah dipulihkan
    deletedMapping[key] = deletedMapping[key].filter(
      (m) => m.prevValue !== addedValue
    );
    localStorage.setItem("deletedRelations", JSON.stringify(deletedMapping));
  };

  return (
    <Box p={5} bg={bgContainer} minH="100vh">
      <BreadcrumbsPath
        paths={[
          { label: "Menu Admin / Master Data", link: "/MasterData" },
          { label: masterListDef[activeTabIndex].title },
        ]}
      />

      <Heading
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        textAlign="left"
        mb={4}
        mt={6}
        fontFamily="poppins"
        bg="white"
        p={6}
        rounded="lg"
        boxShadow="md"
      >
        Manajemen Master Data
      </Heading>
      <Box
        bg="white"
        p={4}
        rounded="lg"
        boxShadow="md"
        w="100%"
        overflowX="hidden"
      >
        <Tabs
          variant="unstyled"
          index={activeTabIndex}
          onChange={(i) => {
            const selected = masterListDef[i];
            if (selected) {
              setActiveTabIndex(i);
              setActiveTab(selected.key);
            }
          }}
        >
          <TabList borderTop="1px solid rgb(255, 255, 255)" bg="white" w="full">
            {masterListDef.map((m, i) => (
              <Tab
                key={m.key}
                flex="1"
                textAlign="center"
                px={6}
                py={2}
                fontWeight="semibold"
                fontSize="14px"
                borderTop={
                  i === activeTabIndex
                    ? "3px solid #1A73E8"
                    : "1px solid #E2E8F0"
                }
                color={i === activeTabIndex ? "#1A73E8" : "#000000"}
                bg={i === activeTabIndex ? "white" : "gray.50"}
                borderTopRadius="md"
                _focus={{ boxShadow: "none" }}
              >
                {m.title}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {masterListDef.map((m) => (
              <TabPanel key={m.key} px={0}>
                <VStack
                  align="stretch"
                  spacing={4}
                  bg={cardBg}
                  p={4}
                  rounded="lg"
                >
                  {/* HStack tombol tetap */}
                  <HStack justify="space-between" wrap="wrap">
                    <Text fontSize="xl" fontWeight="semibold">
                      Daftar {m.title}
                    </Text>
                    <HStack spacing={2}>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        style={{ display: "none" }}
                        id={`import-file-${m.key}`}
                        onChange={(e) => handleImportExcel(e, m.key)}
                      />
                      <Button
                        bgColor={"#8B13E6"}
                        color="white"
                        _hover={{ bgColor: "#6B0FA2" }}
                        onClick={() =>
                          document
                            .getElementById(`import-file-${m.key}`)
                            .click()
                        }
                      >
                        Import Excel
                      </Button>
                      <Button
                        bg="#11BF02"
                        color="white"
                        _hover={{ bg: "#0fa802" }}
                        onClick={() => handleExportExcel(m.key)}
                      >
                        Export Excel
                      </Button>
                      <Button
                        bg={"#4169E1"}
                        color={"white"}
                        _hover={{ bg: "#355ACF" }}
                        onClick={handleAdd}
                      >
                        Tambah
                      </Button>
                    </HStack>
                  </HStack>

                  {/* Tabel tetap */}
                  <Table variant="striped" minWidth="1000px">
                    <Thead bg={tableHeadBg}>
                      <Tr>
                        <Th>No</Th>
                        <Th>{m.field1Label}</Th>
                        <Th>{m.field2Label}</Th>
                        <Th>Aksi</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {masterData[m.key].length === 0 ? (
                        <Tr>
                          <Td colSpan={4}>
                            <Text textAlign="center">Belum ada data.</Text>
                          </Td>
                        </Tr>
                      ) : (
                        masterData[m.key].map((item, idx) => (
                          <Tr key={idx}>
                            <Td>{idx + 1}</Td>
                            <Td>{item.field1}</Td>
                            <Td>{item.field2}</Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button
                                  variant="unstyled"
                                  p={0}
                                  onClick={() => handleEdit(idx)}
                                >
                                  <Image
                                    src={iconEdit}
                                    boxSize="28px"
                                    alt="Edit"
                                    bg="#F9BA32"
                                    borderRadius="md"
                                    p="4px"
                                  />
                                </Button>
                                <Button
                                  variant="unstyled"
                                  p={0}
                                  onClick={() => handleDeleteConfirm(idx)}
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
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        <MasterDataModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          editMode={editIndex !== null}
          fields={masterListDef[activeTabIndex]}
          options={{}}
        />

        <AlertDialog
          isOpen={alertDialog.isOpen}
          leastDestructiveRef={cancelRef}
          onClose={alertDialog.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Konfirmasi Hapus</AlertDialogHeader>
              <AlertDialogBody>
                Apakah Anda yakin ingin menghapus data ini?
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
      </Box>
    </Box>
  );
};

export default MasterData;
