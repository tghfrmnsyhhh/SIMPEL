import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Stack,
  Text,
  Heading,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Image,
} from "@chakra-ui/react";
import {
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FormMateriModal from "../components/FormTambahMateri";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  getDataByCourse,
  addItemByCourse,
  updateItemByCourse,
  deleteItemByCourse,
  initStorage,
} from "../utils/localStorageHelper";

dayjs.locale("id");

const STORAGE_KEY = "materi";

const Materi = () => {
  const { id: courseId } = useParams();
  const [materiList, setMateriList] = useState([]);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [materiToDelete, setMateriToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const loadData = () => {
    const data = getDataByCourse(STORAGE_KEY, courseId);
    setMateriList(data);
  };

  useEffect(() => {
    initStorage();
    loadData();
  }, [courseId]);
  const handleSubmit = (materi) => {
    const existing = materiList.find((m) => m.id === materi.id);
    const pengunggah = localStorage.getItem("userName") || "Guru Tidak Dikenal";

    const materiFinal = {
      ...materi,
      pengunggah: existing?.pengunggah || pengunggah,
      tanggal: materi.tanggal || dayjs().format("YYYY-MM-DD"),
      courseId,
    };

    if (existing) {
      updateItemByCourse(STORAGE_KEY, courseId, materi.id, materiFinal);
    } else {
      addItemByCourse(STORAGE_KEY, materiFinal);
    }

    loadData();
    setSelectedMateri(null);
  };

  const openDeleteDialog = (materi) => {
    setMateriToDelete(materi);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (materiToDelete) {
      deleteItemByCourse(STORAGE_KEY, courseId, materiToDelete.id);
      toast({
        title: "Materi dihapus.",
        status: "error",
        duration: 2000,
      });
      loadData();
      setMateriToDelete(null);
      setIsAlertOpen(false);
    }
  };

  const totalPages = Math.ceil(materiList.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = materiList.slice(indexOfFirst, indexOfLast);

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
          Daftar Materi
        </Heading>
        <Button
          bg="#4169E1"
          color="white"
          _hover={{ bg: "#355ACF" }}
          onClick={() => {
            setSelectedMateri(null);
            onOpen();
          }}
        >
          Tambah Materi
        </Button>
      </Flex>

      <Stack spacing={4}>
        {currentData.map((materi) => (
          <Box
            key={materi.id}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
            borderLeft="6px solid #2B6CB0"
            position="relative"
            cursor="pointer"
            onClick={() => navigate(`/materi/${materi.id}`)}
            _hover={{ bg: "gray.50" }}
          >
            <Flex align="center" gap={3} mb={2}>
              <Icon as={FaFilePdf} boxSize={6} color="red.500" />
              <Box>
                <Text fontWeight="bold" color="gray.800">
                  {materi.nama}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {materi.pengunggah} •{" "}
                  {dayjs(materi.tanggal).format("D MMMM YYYY")}
                </Text>
              </Box>
            </Flex>

            {materi.file && materi.fileName && (
              <Text fontSize="sm" color="blue.600">
                File:{" "}
                <a
                  href={materi.file}
                  download={materi.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {materi.fileName}
                </a>
              </Text>
            )}

            {materi.link && (
              <Text fontSize="sm" color="blue.600">
                Link:{" "}
                <a
                  href={materi.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {materi.link}
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
                  setSelectedMateri(materi);
                  onOpen();
                }}
              />
              <IconButton
                icon={<Image src={IconDelete} boxSize="16px" />}
                size="sm"
                colorScheme="red"
                aria-label="Hapus"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(materi);
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

      <FormMateriModal
        isOpen={isOpen}
        onClose={() => {
          setSelectedMateri(null);
          onClose();
        }}
        onSubmit={handleSubmit}
        initialData={selectedMateri}
        isEdit={!!selectedMateri}
      />

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
              Apakah kamu yakin ingin menghapus materi{" "}
              <strong>{materiToDelete?.nama}</strong>?
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

export default Materi;
