import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Stack,
  Text,
  Heading,
  useToast,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaFilePdf,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FormTugasModal from "../components/FormTambahTugas";
import {
  getDataByCourse,
  addItemByCourse,
  deleteItemByCourse,
  updateItemByCourse,
  initStorage,
} from "../utils/localStorageHelper";
import dayjs from "dayjs";
import "dayjs/locale/id";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";
dayjs.locale("id");

const STORAGE_KEY = "tugas";

const Tugas = () => {
  const { id: courseId } = useParams();
  const [tugasList, setTugasList] = useState([]);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [tugasToDelete, setTugasToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const toast = useToast();
  const navigate = useNavigate();

  const loadData = () => {
    const data = getDataByCourse(STORAGE_KEY, courseId);
    setTugasList(data);
  };

  useEffect(() => {
    initStorage();
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleAddOrEdit = (tugas) => {
    const tugasFinal = {
      ...tugas,
      courseId,
    };

    if (tugasList.find((t) => t.id === tugas.id)) {
      updateItemByCourse(STORAGE_KEY, courseId, tugas.id, tugasFinal);
      toast({ title: "Tugas berhasil diperbarui.", status: "success" });
    } else {
      addItemByCourse(STORAGE_KEY, { ...tugasFinal, id: Date.now() });
      toast({ title: "Tugas berhasil ditambahkan.", status: "success" });
    }

    loadData();
    setSelectedTugas(null);
  };

  const openDeleteDialog = (tugas) => {
    setTugasToDelete(tugas);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (tugasToDelete) {
      deleteItemByCourse(STORAGE_KEY, courseId, tugasToDelete.id);
      toast({ title: "Tugas dihapus.", status: "error" });
      loadData();
      setTugasToDelete(null);
      setIsAlertOpen(false);
    }
  };

  const totalPages = Math.ceil(tugasList.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = tugasList.slice(indexOfFirst, indexOfLast);

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
          Daftar Tugas
        </Heading>
        <Button
          bg="#4169E1"
          color="white"
          _hover={{ bg: "#355ACF" }}
          onClick={() => setSelectedTugas({})}
        >
          Tambah Tugas
        </Button>
      </Flex>

      <Stack spacing={4}>
        {currentData.map((tugas) => (
          <Box
            key={tugas.id}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
            borderLeft="6px solid #2B6CB0"
            position="relative"
            cursor="pointer"
            onClick={() => navigate(`/tugas/${tugas.id}`)}
            _hover={{ bg: "gray.50" }}
          >
            <Flex align="center" gap={3} mb={2}>
              <Icon as={FaFilePdf} boxSize={6} color="red.500" />
              <Box>
                <Text fontWeight="bold" color="gray.800">
                  {tugas.nama}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {tugas.pengunggah} •{" "}
                  {dayjs(tugas.tanggal).format("D MMMM YYYY")}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Deadline: {dayjs(tugas.deadline).format("D MMMM YYYY")}
                </Text>
              </Box>
            </Flex>

            {tugas.file && tugas.fileName && (
              <Text fontSize="sm" color="blue.600">
                File:{" "}
                <a
                  href={tugas.file}
                  download={tugas.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tugas.fileName}
                </a>
              </Text>
            )}

            {tugas.link && (
              <Text fontSize="sm" color="blue.600">
                Link:{" "}
                <a
                  href={tugas.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tugas.link}
                </a>
              </Text>
            )}

            <Flex position="absolute" top="10px" right="10px" gap={2}>
              <IconButton
                icon={<Image src={IconEdit} boxSize="16px" />}
                size="sm"
                colorScheme="yellow"
                aria-label="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTugas(tugas);
                }}
              />
              <IconButton
                icon={<Image src={IconDelete} boxSize="16px" />}
                size="sm"
                colorScheme="red"
                aria-label="Hapus"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(tugas);
                }}
              />
            </Flex>
          </Box>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Flex mt={6} justify="center" align="center" gap={2}>
          <IconButton
            icon={<FaAngleDoubleLeft />}
            size="sm"
            onClick={() => setCurrentPage(1)}
            isDisabled={currentPage === 1}
          />
          <IconButton
            icon={<FaChevronLeft />}
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "solid" : "ghost"}
              colorScheme="blue"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <IconButton
            icon={<FaChevronRight />}
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          />
          <IconButton
            icon={<FaAngleDoubleRight />}
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            isDisabled={currentPage === totalPages}
          />
        </Flex>
      )}

      {selectedTugas !== null && (
        <FormTugasModal
          isOpen={true}
          onClose={() => setSelectedTugas(null)}
          onSubmit={handleAddOrEdit}
          initialData={selectedTugas}
          isEdit={!!selectedTugas?.id}
        />
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Hapus
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah kamu yakin ingin menghapus tugas{" "}
              <strong>{tugasToDelete?.nama}</strong>?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Tugas;
