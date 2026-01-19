import {
  Box,
  Text,
  Heading,
  Input,
  Flex,
  IconButton,
  VStack,
  Avatar,
  Divider,
  Link,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaArrowLeft, FaPaperPlane, FaLink, FaFileAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BreadcrumbsPath from "../components/BreadcrumbsPath";

const ForumDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    id,
    title = "Judul Diskusi",
    description = "Tidak ada deskripsi.",
    file,
    fileName,
    link,
  } = location.state || {};

  const user = localStorage.getItem("userName") || "Ahmad";
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dataPengguna, setDataPengguna] = useState([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const cancelRef = useRef();

  // Load komentar & data pengguna
  useEffect(() => {
    const stored = localStorage.getItem(`comments_${id}`);
    if (stored) setComments(JSON.parse(stored));

    const pengguna = localStorage.getItem("dataPengguna");
    if (pengguna) setDataPengguna(JSON.parse(pengguna));
  }, [id]);

  const handleAddComment = () => {
    if (!inputValue.trim()) return;

    const newComment = {
      id: Date.now(),
      name: user,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      content: inputValue.trim(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    setInputValue("");
  };

  const handleDeleteComment = () => {
    const updated = comments.filter((c) => c.id !== selectedCommentId);
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    setIsConfirmOpen(false);
    setSelectedCommentId(null);
  };

  return (
    <Box p={6}>
      <BreadcrumbsPath
        paths={[
          { label: "Menu Utama", link: "/dashboard" },
          { label: "Mata Pelajaran", link: "/course" },
          { label: "Forum Diskusi" },
          { label: "Detail Diskusi" },
        ]}
      />

      {/* KEMBALI */}
      <Box mt={6}>
        <Link
          onClick={() => navigate(-1)}
          color="blue.600"
          fontSize="sm"
          fontWeight={"bold"}
          display="inline-flex"
          alignItems="center"
        >
          <FaArrowLeft style={{ marginRight: "5px" }} /> Kembali ke Daftar Forum
          Diskusi
        </Link>
      </Box>

      {/* DETAIL DISKUSI */}
      <Box bg="white" borderRadius="md" p={5} boxShadow="sm">
        <Text
          color="blue.600"
          fontWeight="semibold"
          fontSize="sm"
          borderBottom="2px solid"
          pb={1}
          mb={3}
        >
          Detail Diskusi
        </Text>

        <Heading size="lg" mb={2}>
          {title}
        </Heading>

        <Text fontWeight="bold" mb={1}>
          Deskripsi:
        </Text>
        <Text mb={4} color="gray.700" textAlign="justify">
          {description}
        </Text>

        {(file || link) && (
          <Box
            bg="gray.50"
            border="1px solid #CBD5E0"
            p={3}
            borderRadius="md"
            mt={3}
            mb={2}
          >
            {file && fileName && (
              <HStack mb={2} spacing={2} align="center">
                <FaFileAlt color="#2B6CB0" />
                <Text fontSize="sm" color="blue.600">
                  File:{" "}
                  <Link
                    href={file}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </Link>
                </Text>
              </HStack>
            )}

            {link && (
              <HStack spacing={2} align="center">
                <FaLink color="#2B6CB0" />
                <Text fontSize="sm" color="blue.600">
                  Link:{" "}
                  <Link href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </Link>
                </Text>
              </HStack>
            )}
          </Box>
        )}
      </Box>

      {/* KOMENTAR */}
      <Box
        mt={6}
        bg="white"
        p={5}
        borderRadius="md"
        boxShadow="sm"
        borderTop="4px solid #3182CE"
      >
        <Text fontWeight="bold" mb={2}>
          Tambah Komentar
        </Text>

        <Flex mb={5}>
          <Input
            placeholder="Ketik komentar Anda"
            borderRadius="md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <IconButton
            icon={<FaPaperPlane />}
            colorScheme="blue"
            ml={2}
            onClick={handleAddComment}
            aria-label="Kirim"
          />
        </Flex>

        <Divider mb={4} />

        <VStack align="start" spacing={6}>
          {comments.length === 0 && (
            <Text fontSize="sm" color="gray.500">
              Belum ada komentar.
            </Text>
          )}

          {comments.map((c) => {
            const pengguna = dataPengguna.find((p) => p.nama === c.name);
            const jabatanUser = pengguna?.jabatan || "-";

            return (
              <Box
                key={c.id}
                w="full"
                position="relative"
                border="1px solid #CBD5E0"
                borderRadius="md"
                px={4}
                py={3}
                bg="white"
              >
                {/* Tombol Hapus */}
                <IconButton
                  icon={<DeleteIcon />}
                  size="xl"
                  colorScheme="red"
                  variant="ghost"
                  aria-label="Hapus komentar"
                  position="absolute"
                  top="6px"
                  right="6px"
                  _hover={{ bg: "red.100" }}
                  _active={{ bg: "red.200" }}
                  onClick={() => {
                    setSelectedCommentId(c.id);
                    setIsConfirmOpen(true);
                  }}
                />

                <Flex gap={3} align="center" mb={2}>
                  <Avatar name={c.name} size="sm" />
                  <Box>
                    <Text fontWeight="bold">{c.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {jabatanUser !== "-" ? `${jabatanUser} | ` : ""}
                      {c.date}
                    </Text>
                  </Box>
                </Flex>

                <Text fontSize="sm" color="gray.800">
                  {c.content}
                </Text>
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* KONFIRMASI HAPUS */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Komentar
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleDeleteComment} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ForumDetail;
