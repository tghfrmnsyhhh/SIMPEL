import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
  IconButton,
  Flex,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import TambahForumDiskusi from "../components/TambahForumDiskusi";
import IconEdit from "../assets/icons/Edit.png";
import IconDelete from "../assets/icons/Hapus.png";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

const ForumDiskusi = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [forumToDelete, setForumToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const perPage = 5;

  // Ambil semua forum dengan courseId sesuai
  const loadData = () => {
    const stored = JSON.parse(localStorage.getItem("forums") || "[]");
    const filtered = stored.filter((f) => f.courseId === courseId);
    setForums(filtered);
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleSubmit = (forum) => {
    const stored = JSON.parse(localStorage.getItem("forums") || "[]");
    const updated = selectedForum
      ? stored.map((f) => (f.id === forum.id ? forum : f))
      : [...stored, forum];

    localStorage.setItem("forums", JSON.stringify(updated));
    loadData();
    setSelectedForum(null);
  };

  const handleDelete = () => {
    const stored = JSON.parse(localStorage.getItem("forums") || "[]");
    const filtered = stored.filter((f) => f.id !== forumToDelete.id);
    localStorage.setItem("forums", JSON.stringify(filtered));
    loadData();
    toast({
      title: "Forum berhasil dihapus.",
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
    setForumToDelete(null);
    onDeleteClose();
  };

  const totalPages = Math.ceil(forums.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = forums.slice(indexOfFirst, indexOfLast);

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
          Daftar Forum Diskusi
        </Heading>
        <Button
          bg="#4169E1"
          color="white"
          _hover={{ bg: "#355ACF" }}
          onClick={() => {
            setSelectedForum(null);
            onOpen();
          }}
        >
          Tambah Diskusi
        </Button>
      </Flex>

      <Stack spacing={4}>
        {currentData.map((forum) => (
          <Box
            key={forum.id}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
            borderLeft="6px solid #2B6CB0"
            position="relative"
            cursor="pointer"
            onClick={() => navigate(`/forum/${forum.id}`, { state: forum })}
            _hover={{ bg: "gray.50" }}
          >
            <Heading size="sm" mb={1} color="gray.800">
              {forum.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={1}>
              {forum.description}
            </Text>
            <Text fontSize="xs" color="gray.500" mb={2}>
              {forum.pengunggah} • {dayjs(forum.tanggal).format("D MMMM YYYY")}
            </Text>

            {forum.file && forum.fileName && (
              <Text fontSize="sm" color="blue.600">
                File:{" "}
                <a
                  href={forum.file}
                  download={forum.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {forum.fileName}
                </a>
              </Text>
            )}

            {forum.link && (
              <Text fontSize="sm" color="blue.600">
                Link:{" "}
                <a
                  href={forum.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {forum.link}
                </a>
              </Text>
            )}

            <Box position="absolute" top="10px" right="10px">
              <IconButton
                icon={<Image src={IconEdit} boxSize="16px" />}
                size="sm"
                colorScheme="yellow"
                aria-label="Edit"
                mr={1}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedForum(forum);
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
                  setForumToDelete(forum);
                  onDeleteOpen();
                }}
              />
            </Box>
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

      <TambahForumDiskusi
        isOpen={isOpen}
        onClose={() => {
          setSelectedForum(null);
          onClose();
        }}
        onSubmit={handleSubmit}
        initialData={selectedForum}
      />

      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Hapus
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah kamu yakin ingin menghapus forum ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Batal</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ForumDiskusi;
