import {
  Box,
  Grid,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";

import { Image } from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FormTambahPengumuman from "../components/FormTambahPengumuman";
import { useEffect, useState } from "react";
import { getData } from "../utils/localStorageHelper";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import IconSiswa from "../assets/icons/SiswaDashboard.png";
import IconGuru from "../assets/icons/Guru.png";
import IconJurusan from "../assets/icons/Jurusan.png";
import IconKelas from "../assets/icons/Kelas.png";

// Fungsi ambil jurusan dari masterDataStorage
const getAllJurusan = () => {
  const storage = localStorage.getItem("masterDataStorage");
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage);
    return parsed.jurusan || [];
  } catch (e) {
    return [];
  }
};

// Fungsi ambil kelas dari masterDataStorage
const getAllKelas = () => {
  const storage = localStorage.getItem("masterDataStorage");
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage);
    return parsed.kelas || [];
  } catch (e) {
    return [];
  }
};

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [totalSiswa, setTotalSiswa] = useState({ pria: 0, wanita: 0 });
  const [totalGuru, setTotalGuru] = useState({ pria: 0, wanita: 0 });
  const [jumlahJurusan, setJumlahJurusan] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);

  useEffect(() => {
    const siswa = getData("dataSiswa") || [];
    const guru = getData("dataGuru") || [];
    const jurusan = getAllJurusan();
    const kelas = getAllKelas();
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRole(storedRole);

    const countByGender = (data) => {
      const pria = data.filter(
        (item) => item.jenisKelamin === "Laki-laki"
      ).length;
      const wanita = data.filter(
        (item) => item.jenisKelamin === "Perempuan"
      ).length;
      return { pria, wanita };
    };

    setTotalSiswa(countByGender(siswa));
    setTotalGuru(countByGender(guru));
    setJumlahJurusan(jurusan.length);
    setJumlahKelas(kelas.length);
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <Box px={4} pt={4} bg="#E3E9FB">
        <BreadcrumbsPath
          paths={[
            { label: "Menu Utama", link: "/dashboard" },
            { label: "Beranda" },
          ]}
        />
      </Box>

      <Box
        px={{ base: 4, md: 6 }}
        py={6}
        minH="100vh"
        bg="#f2f6fd"
        maxW="1350px"
        mx="auto"
        borderRadius="10px"
        fontFamily="poppins"
        bgColor="transparent"
      >
        {/* Statistik Cards */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 2, lg: 4 }}
          spacing={4}
          mb={6}
        >
          {/* Siswa */}
          <Card bg="white" borderLeft="4px solid #2563eb">
            <CardBody>
              <Text color="#2563eb" fontWeight="bold">
                Siswa
              </Text>
              <Flex mt={3} gap={3}>
                <Box
                  flex="1"
                  bg="#e0edff"
                  borderRadius="md"
                  p={3}
                  textAlign="center"
                >
                  <Image
                    src={IconSiswa}
                    alt="Ikon Siswa"
                    boxSize="30px"
                    mx="auto"
                    mb={2}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {totalSiswa.pria}
                  </Text>
                  <Text fontSize="sm">Laki-laki</Text>
                </Box>
                <Box
                  flex="1"
                  bg="#e0edff"
                  borderRadius="md"
                  p={3}
                  textAlign="center"
                >
                  <Image
                    src={IconSiswa}
                    alt="Ikon Siswa"
                    boxSize="30px"
                    mx="auto"
                    mb={2}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {totalSiswa.wanita}
                  </Text>
                  <Text fontSize="sm">Perempuan</Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          {/* Guru */}
          <Card bg="white" borderLeft="4px solid #a855f7">
            <CardBody>
              <Text color="#a855f7" fontWeight="bold">
                Guru
              </Text>
              <Flex mt={3} gap={3}>
                <Box
                  flex="1"
                  bg="#f3e8ff"
                  borderRadius="md"
                  p={3}
                  textAlign="center"
                >
                  <Image
                    src={IconGuru}
                    alt="Ikon Guru"
                    boxSize="30px"
                    mx="auto"
                    mb={2}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {totalGuru.pria}
                  </Text>
                  <Text fontSize="sm">Laki-laki</Text>
                </Box>
                <Box
                  flex="1"
                  bg="#f3e8ff"
                  borderRadius="md"
                  p={3}
                  textAlign="center"
                >
                  <Image
                    src={IconGuru}
                    alt="Ikon Guru"
                    boxSize="30px"
                    mx="auto"
                    mb={2}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {totalGuru.wanita}
                  </Text>
                  <Text fontSize="sm">Perempuan</Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          {/* Jurusan */}
          <Card bg="white" borderLeft="4px solid #22c55e">
            <CardBody>
              <Text color="#22c55e" fontWeight="bold">
                Jurusan
              </Text>
              <Box
                mt={3}
                bg="#dcfce7"
                borderRadius="md"
                p={4}
                textAlign="center"
              >
                <Image
                  src={IconJurusan}
                  alt="Ikon Jurusan"
                  boxSize="30px"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {jumlahJurusan}
                </Text>
                <Text fontSize="sm">Total Jurusan</Text>
              </Box>
            </CardBody>
          </Card>

          {/* Kelas */}
          <Card bg="white" borderLeft="4px solid #f59e0b">
            <CardBody>
              <Text color="#f59e0b" fontWeight="bold">
                Kelas
              </Text>
              <Box
                mt={3}
                bg="#fff7e6"
                borderRadius="md"
                p={4}
                textAlign="center"
              >
                <Image
                  src={IconKelas}
                  alt="Ikon Kelas"
                  boxSize="30px"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {jumlahKelas}
                </Text>
                <Text fontSize="sm">Total Kelas</Text>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Grid bawah: Form + Kalender */}
        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
          gap={6}
          alignItems="stretch"
          width="100%"
        >
          <Box w="100%">
            <FormTambahPengumuman role={role} />
          </Box>

          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            shadow="md"
            w="100%"
            overflowX="auto"
          >
            <Text fontWeight="bold" mb={4}>
              Kalender
            </Text>
            <Box w="100%" overflowX="auto">
              <Calendar
                locale="id"
                tileClassName={({ date, view }) => {
                  const today = new Date();
                  return date.toDateString() === today.toDateString()
                    ? "highlight-today"
                    : "";
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
