import { Box, Text, Heading, Flex, Stack, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import iconEdit from "../assets/icons/Edit.png";
import iconDelete from "../assets/icons/Hapus.png";

const CourseCard = ({ course, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
      borderLeft="5px solid"
      borderColor="#4169E1"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "lg",
      }}
    >
      {/* Judul dan Kelas */}
      <Flex justify="space-between" align="start" mb={2}>
        <Heading
          size="md"
          color="#4169E1"
          cursor="pointer"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          {course.title}
        </Heading>
        <Badge bg="#C4D1F6" color="#2c5282" fontSize="0.7rem">
          KELAS {course.classLevel}
        </Badge>
      </Flex>

      {/* Deskripsi */}
      <Text fontSize="sm" color="gray.700" mb={2}>
        {course.description}
      </Text>

      {/* Guru */}
      <Text fontSize="sm" color="gray.800" mb={4}>
        <strong>Guru:</strong> {course.teacher}
      </Text>

      {/* Info 2 kolom */}
      <Flex justify="space-between" align="start" mb={4}>
        <Stack spacing={3}>
          <Box>
            <Text fontWeight="bold">Kode:</Text>
            <Text>{course.code || "-"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Jurusan:</Text>
            <Text>{course.category}</Text>
          </Box>
        </Stack>

        <Box
          height="100px"
          borderLeft="4px solid"
          borderColor="blue.500"
          mx={2}
        />

        <Stack spacing={3}>
          <Box>
            <Text fontWeight="bold">Semester:</Text>
            <Text>{course.semester}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Tahun Ajar:</Text>
            <Text>{course.year}</Text>
          </Box>
        </Stack>
      </Flex>

      {/* Tombol Icon */}
      <Flex justify="flex-end" gap={2}>
        <Box
          as="button"
          onClick={onEdit}
          bg="#F9BA32"
          borderRadius="md"
          p="6px"
          cursor="pointer"
          aria-label="Edit"
          transition="all 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <img src={iconEdit} alt="Edit" width={18} height={18} />
        </Box>

        <Box
          as="button"
          onClick={onDelete}
          bg="#F31014"
          borderRadius="md"
          p="6px"
          cursor="pointer"
          aria-label="Hapus"
          transition="all 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <img src={iconDelete} alt="Hapus" width={18} height={18} />
        </Box>
      </Flex>
    </Box>
  );
};

export default CourseCard;
