import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Icon,
  HStack,
  Badge,
  Container,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Textarea,
  IconButton,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaDownload,
  FaFilePdf,
  FaTrash,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../utils/localStorageHelper";

const TugasDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tugas, setTugas] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pengumpulan, setPengumpulan] = useState([
    {
      id: 101,
      nama: "Ahmad Safir",
      nisn: "1234567890",
      file: "Tugas_UKOM_AhmadSafir.pdf",
      tanggal: "2025-05-15",
      nilai: 85,
      feedback: "Sangat baik, terus tingkatkan.",
    },
    {
      id: 102,
      nama: "Bayu Rafli Firmansyah",
      nisn: "0987654321",
      file: "Tugas_UKOM_BayuRafli.pdf",
      tanggal: "2025-05-15",
      nilai: 78,
      feedback: "Cukup bagus, perhatikan format.",
    },
    {
      id: 103,
      nama: "Ditto Alif Firman",
      nisn: "1122334455",
      file: "Tugas_UKOM_DittoAlif.pdf",
      tanggal: "2025-05-16",
      nilai: 90,
      feedback: "Luar biasa, rapi dan lengkap.",
    },
    {
      id: 104,
      nama: "Nadira Aulia",
      nisn: "2233445566",
      file: "Tugas_UKOM_NadiraAulia.pdf",
      tanggal: "2025-05-16",
      nilai: 0,
      feedback: "",
    },
    {
      id: 105,
      nama: "Rafi Hidayat",
      nisn: "3344556677",
      file: "Tugas_UKOM_RafiHidayat.pdf",
      tanggal: "2025-05-17",
      nilai: 0,
      feedback: "",
    },
  ]);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const data = getData("tugas");
    const found = data.find((item) => item.id === Number(id));
    setTugas(found || null);

    if (found?.file?.startsWith("data:application/pdf")) {
      setPreviewUrl(found.file);
    } else if (found?.link?.startsWith("http")) {
      setPreviewUrl(found.link);
    }

    const allComments = JSON.parse(
      localStorage.getItem("komentarTugas") || "{}"
    );
    setComments(allComments[id] || []);
  }, [id]);

  const handleDelete = (id) => {
    setPengumpulan((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNilaiChange = (id, value) => {
    setPengumpulan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, nilai: value } : item))
    );
  };

  const handleFeedbackChange = (id, value) => {
    setPengumpulan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, feedback: value } : item))
    );
  };

  const handleKirimKomentar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const nama = user?.nama || "Pengguna";
    const newComment = {
      id: Date.now(),
      nama,
      teks: commentText,
      tanggal: new Date().toLocaleString("id-ID"),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    setCommentText("");
    const all = JSON.parse(localStorage.getItem("komentarTugas") || "{}");
    all[id] = updated;
    localStorage.setItem("komentarTugas", JSON.stringify(all));
  };

  if (!tugas) {
    return (
      <Flex h="100vh" align="center" justify="center" flexDir="column">
        <Text fontSize="xl" fontWeight="medium" mb={4}>
          Tugas tidak ditemukan.
        </Text>
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          colorScheme="blue"
        >
          Kembali
        </Button>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Flex
        align="center"
        ml={12}
        mb={4}
        color="blue.600"
        cursor="pointer"
        onClick={() => navigate(-1)}
      >
        <Icon as={FaArrowLeft} mr={2} />
        <Text fontWeight="semibold">Kembali ke Daftar Materi</Text>
      </Flex>
      <Container maxW="7xl" bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Tabs variant="enclosed">
          <TabList>
            <Tab fontWeight="semibold">Detail Tugas</Tab>
            <Tab fontWeight="semibold">Pengumpulan Tugas</Tab>
          </TabList>

          <TabPanels>
            {/* Detail Tugas */}
            <TabPanel>
              <Flex justify="space-between" flexWrap="wrap" mb={4}>
                <Heading size="lg" color="blue.600">
                  {tugas.nama}
                </Heading>
                <Badge colorScheme="blue" fontSize="sm">
                  Tugas
                </Badge>
              </Flex>

              <HStack spacing={6} fontSize="sm" color="gray.600" mb={4}>
                <HStack>
                  <Icon as={FaUser} />
                  <Text>{tugas.pengunggah || "-"}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCalendarAlt} />
                  <Text>Diunggah: {tugas.tanggal}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCalendarAlt} />
                  <Text>Deadline: {tugas.deadline || "-"}</Text>
                </HStack>
              </HStack>

              <Divider mb={4} />

              <Text fontWeight="semibold" mb={2}>
                Deskripsi:
              </Text>
              <Text mb={4} fontSize="sm" color="gray.700">
                {tugas.deskripsi}
              </Text>

              {tugas.file && (
                <>
                  <Text fontWeight="semibold" mb={2}>
                    File Lampiran:
                  </Text>
                  <Flex
                    justify="space-between"
                    align="center"
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.100"
                    mb={4}
                  >
                    <HStack>
                      <Box p={2} bg="red.500" color="white" borderRadius="md">
                        <FaFilePdf />
                      </Box>
                      <Text fontWeight="medium">
                        {tugas.fileName || "Lampiran"}
                      </Text>
                    </HStack>
                    <Button
                      leftIcon={<FaDownload />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => window.open(previewUrl, "_blank")}
                    >
                      Unduh
                    </Button>
                  </Flex>
                </>
              )}

              {/* Komentar */}
              <Box mt={10}>
                <Heading size="md" mb={3}>
                  Komentar
                </Heading>
                <VStack align="stretch" spacing={4}>
                  {comments.map((komentar) => (
                    <Box
                      key={komentar.id}
                      bg="gray.100"
                      p={4}
                      borderRadius="md"
                    >
                      <HStack spacing={3} mb={1}>
                        <Avatar name={komentar.nama} size="sm" />
                        <Text fontWeight="bold">{komentar.nama}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {komentar.tanggal}
                        </Text>
                      </HStack>
                      <Text fontSize="sm">{komentar.teks}</Text>
                    </Box>
                  ))}
                </VStack>

                <HStack mt={4}>
                  <Input
                    placeholder="Tulis komentar..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <IconButton
                    icon={<FaPaperPlane />}
                    colorScheme="blue"
                    onClick={handleKirimKomentar}
                    aria-label="Kirim"
                  />
                </HStack>
              </Box>
            </TabPanel>

            {/* Pengumpulan Tugas */}
            <TabPanel>
              <Heading size="md" mb={4}>
                Pengumpulan Tugas
              </Heading>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th>No</Th>
                      <Th>Siswa</Th>
                      <Th>NISN</Th>
                      <Th>Nama File</Th>
                      <Th>Tanggal</Th>
                      <Th>Nilai</Th>
                      <Th>Komentar</Th>
                      <Th>Aksi</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pengumpulan.map((item, i) => (
                      <Tr key={item.id}>
                        <Td>{i + 1}</Td>
                        <Td>{item.nama}</Td>
                        <Td>{item.nisn}</Td>
                        <Td>{item.file}</Td>
                        <Td>{item.tanggal}</Td>
                        <Td>
                          <Input
                            type="number"
                            size="sm"
                            value={item.nilai}
                            onChange={(e) =>
                              handleNilaiChange(item.id, e.target.value)
                            }
                          />
                        </Td>
                        <Td>
                          <Textarea
                            size="sm"
                            value={item.feedback}
                            onChange={(e) =>
                              handleFeedbackChange(item.id, e.target.value)
                            }
                          />
                        </Td>
                        <Td>
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            aria-label="Hapus"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default TugasDetail;
