import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Button,
  Grid,
  useDisclosure,
  Select,
  Input,
  Flex,
  Wrap,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import BreadcrumbsPath from "../components/BreadcrumbsPath";

const Course = () => {
  const [courses, setCourses] = useState(() => {
    const storedCourses = localStorage.getItem("courses");
    try {
      const parsed = JSON.parse(storedCourses);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const role = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const dataPengguna = JSON.parse(localStorage.getItem("dataPengguna")) || [];
  const currentUser = dataPengguna.find((u) => u.email === userEmail);

  const guruMapelList = Array.isArray(currentUser?.mataPelajaran)
    ? currentUser.mataPelajaran.map((m) => m.toLowerCase())
    : currentUser?.mataPelajaran
    ? [currentUser.mataPelajaran.toLowerCase()]
    : [];

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterMapel, setFilterMapel] = useState("");
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [masterData, setMasterData] = useState({
    tahunAjar: [],
    kelas: [],
    jurusan: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem("masterDataStorage");
    try {
      const parsed = JSON.parse(stored);
      setMasterData({
        tahunAjar: parsed?.tahunAjar || [],
        kelas: parsed?.kelas || [],
        jurusan: parsed?.jurusan || [],
      });
    } catch {
      setMasterData({ tahunAjar: [], kelas: [], jurusan: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const [idToDelete, setIdToDelete] = useState(null);
  const deleteDialog = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  const handleAdd = () => {
    setSelectedCourse(null);
    onOpen();
  };

  const handleSave = (data) => {
    const newTitle = data.title?.trim().toLowerCase();

    if (role === "Guru" && !guruMapelList.includes(newTitle)) {
      alert("Guru hanya dapat menambahkan mata pelajaran sesuai profilnya.");
      return;
    }

    if (selectedCourse) {
      setCourses(courses.map((c) => (c.id === selectedCourse.id ? data : c)));

      toast({
        title: "Mata Pelajaran berhasil disimpan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setCourses([...courses, { ...data, id: Date.now() }]);

      toast({
        title: "Mata pelajaran berhasil ditambahkan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  };

  const confirmDelete = (id) => {
    setIdToDelete(id);
    deleteDialog.onOpen();
  };

  const handleDelete = () => {
    setCourses((prev) => {
      const updated = prev.filter((c) => c.id !== idToDelete);
      localStorage.setItem("courses", JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Mapel berhasil dihapus",
      status: "error",
      duration: 3000,
      isClosable: true,
    });

    setIdToDelete(null);
    deleteDialog.onClose();
  };

  const filteredCourses = courses
    .filter((c) => {
      const courseTitle = c.title?.trim().toLowerCase();
      const isGuruAllowed =
        role !== "Guru" ||
        guruMapelList.length === 0 ||
        guruMapelList.includes(courseTitle);

      return (
        isGuruAllowed &&
        (!filterCategory || c.category === filterCategory) &&
        (!filterYear || c.year === filterYear) &&
        (!filterSemester || c.semester === filterSemester) &&
        (!filterClass || c.classLevel === filterClass) &&
        (!filterMapel || courseTitle.includes(filterMapel.toLowerCase())) &&
        (!searchQuery || courseTitle.includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Box px={4} pt={4} bg="#E3E9FB">
        <BreadcrumbsPath
          paths={[
            { label: "Menu Utama", link: "/dashboard" },
            { label: "Mata Pelajaran" },
          ]}
        />
      </Box>

      <Box p={6} minH="100vh" bg="white" maxW="1350px" mx="auto">
        <Heading fontSize="28px" fontWeight="bold" mb={4}>
          Mata Pelajaran
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          mb={6}
        >
          <Wrap spacing={4} flex="1">
            <Select
              placeholder="Tahun Ajar"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              w="150px"
            >
              {masterData.tahunAjar.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Semester"
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              w="130px"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </Select>
            <Select
              placeholder="Kelas"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              w="100px"
            >
              {masterData.kelas.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Jurusan"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              w="130px"
            >
              {masterData.jurusan.map((item, i) => (
                <option key={i} value={item.field1}>
                  {item.field1}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Cari nama mapel"
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              w="200px"
            />
          </Wrap>

          <Button
            bg="#4169E1"
            color="white"
            _hover={{ bg: "#355ACF" }}
            onClick={handleAdd}
            px={6}
            mt={{ base: 2, md: 0 }}
          >
            Tambah Mapel
          </Button>
        </Flex>

        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={5}>
          {paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setSelectedCourse(course);
                onOpen();
              }}
              onDelete={() => confirmDelete(course.id)} // ✅ benar
              isAdmin={role !== "Guru"}
            />
          ))}
        </Grid>

        {totalPages > 1 && (
          <Flex justify="center" mt={6} gap={2}>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={i + 1 === currentPage ? "solid" : "outline"}
                colorScheme={i + 1 === currentPage ? "blue" : "gray"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </Flex>
        )}

        <CourseForm
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
          initialData={selectedCourse}
        />
      </Box>
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi Hapus</AlertDialogHeader>
            <AlertDialogBody>
              Apakah kamu yakin ingin menghapus mata pelajaran ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
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

export default Course;
