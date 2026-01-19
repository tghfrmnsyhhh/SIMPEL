import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
  Divider,
  Avatar,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FaArrowLeft, FaDownload, FaPaperPlane, FaTrash } from "react-icons/fa";
import { AiFillFilePdf } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbsPath from "../components/BreadcrumbsPath";

const MateriDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [materi, setMateri] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [komentar, setKomentar] = useState("");
  const [listKomentar, setListKomentar] = useState([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedKomentarId, setSelectedKomentarId] = useState(null);
  const cancelRef = React.useRef();

  useEffect(() => {
    const stored = localStorage.getItem("materi");
    if (stored) {
      const data = JSON.parse(stored);
      const selected = data.find((m) => m.id === Number(id));
      setMateri(selected);
      if (selected?.file) {
        setPreviewUrl(selected.file);
      }
    }

    const allKomentar =
      JSON.parse(localStorage.getItem("komentarMateri")) || {};
    setListKomentar(allKomentar[id] || []);
  }, [id]);

  const handleKirimKomentar = () => {
    if (!komentar.trim()) return;

    const nama = localStorage.getItem("userName") || "Pengguna";
    const jabatan = localStorage.getItem("userRole") || "-";
    const waktu = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newKomentar = {
      id: Date.now(),
      nama,
      jabatan,
      waktu,
      isi: komentar.trim(),
    };

    const updatedKomentar = [newKomentar, ...listKomentar];
    setListKomentar(updatedKomentar);

    const allKomentar =
      JSON.parse(localStorage.getItem("komentarMateri")) || {};
    allKomentar[id] = updatedKomentar;
    localStorage.setItem("komentarMateri", JSON.stringify(allKomentar));

    setKomentar("");
  };

  const handleHapusKomentar = () => {
    const filtered = listKomentar.filter((k) => k.id !== selectedKomentarId);
    setListKomentar(filtered);

    const allKomentar =
      JSON.parse(localStorage.getItem("komentarMateri")) || {};
    allKomentar[id] = filtered;
    localStorage.setItem("komentarMateri", JSON.stringify(allKomentar));

    setIsConfirmOpen(false);
    setSelectedKomentarId(null);
  };

  if (!materi) {
    return (
      <Box p={6}>
        <Text>Materi tidak ditemukan.</Text>
        <Button mt={4} onClick={() => navigate(-1)} colorScheme="blue">
          Kembali
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <BreadcrumbsPath
        paths={[
          { label: "Menu Data", link: "/dashboard" },
          { label: "Forum Diskusi" },
          { label: "Detail Materi" },
        ]}
      />

      <Flex
        align="center"
        mb={4}
        color="blue.600"
        cursor="pointer"
        onClick={() => navigate(-1)}
      >
        <Icon as={FaArrowLeft} mr={2} />
        <Text fontWeight="semibold">Kembali ke Daftar Materi</Text>
      </Flex>

      <Box bg="white" p={5} borderRadius="md" shadow="md" mb={6}>
        <Flex align="center" justify="space-between" mb={4}>
          <Flex align="center">
            <Icon as={AiFillFilePdf} boxSize={8} color="red.500" mr={3} />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {materi.nama}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Diunggah: {materi.tanggal}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Oleh: {materi.pengunggah || "Guru Tidak Dikenal"}
              </Text>
            </Box>
          </Flex>

          {previewUrl && (
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              as="a"
              href={previewUrl}
              download={materi.fileName || "materi.pdf"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unduh PDF
            </Button>
          )}
        </Flex>

        <Divider my={3} />

        <Text fontWeight="bold" mb={1}>
          Deskripsi
        </Text>
        <Text fontSize="sm" color="gray.700">
          {materi.deskripsi || "Tidak ada deskripsi."}
        </Text>
      </Box>

      {/* Komentar */}
      <Box
        bg="white"
        p={5}
        borderRadius="md"
        shadow="md"
        mt={8}
        borderTop="4px solid #3182CE"
      >
        <Text fontWeight="bold" mb={3}>
          Tambah Komentar
        </Text>

        <HStack mb={5}>
          <Input
            placeholder="Tulis komentar..."
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleKirimKomentar()}
          />
          <IconButton
            icon={<FaPaperPlane />}
            colorScheme="blue"
            onClick={handleKirimKomentar}
            aria-label="Kirim"
          />
        </HStack>

        <Divider mb={4} />

        <VStack align="start" spacing={6}>
          {listKomentar.length === 0 && (
            <Text fontSize="sm" color="gray.500">
              Belum ada komentar.
            </Text>
          )}

          {listKomentar.map((k) => (
            <Box
              key={k.id}
              w="full"
              position="relative"
              border="1px solid #CBD5E0"
              borderRadius="md"
              px={4}
              py={3}
              bg="white"
            >
              <IconButton
                icon={<FaTrash />}
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
                  setSelectedKomentarId(k.id);
                  setIsConfirmOpen(true);
                }}
              />

              <Flex gap={3} align="center" mb={2}>
                <Avatar name={k.nama} size="sm" />
                <Box>
                  <Text fontWeight="bold">{k.nama}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {k.jabatan !== "-" ? `${k.jabatan} | ` : ""}
                    {k.waktu}
                  </Text>
                </Box>
              </Flex>

              <Text fontSize="sm" color="gray.800">
                {k.isi}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Konfirmasi Hapus */}
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
              Yakin ingin menghapus komentar ini? Tindakan ini tidak bisa
              dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleHapusKomentar} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MateriDetail;
