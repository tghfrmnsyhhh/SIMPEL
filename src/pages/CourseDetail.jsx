import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import ForumDiskusiList from "../pages/ForumDiskusi";
import MateriPage from "../pages/Materi";
import TugasList from "../pages/Tugas";
import Penilaian from "../pages/Penilaian";
import SiswaList from "../pages/SiswaKelas";
import BreadcrumbsPath from "../components/BreadcrumbsPath";
import { getCourseById } from "../utils/courseStorage";

import IconDiskusi from "../assets/icons/Diskusi.png";
import IconMateri from "../assets/icons/Materi.png";
import IconTugas from "../assets/icons/Tugas.png";
import IconPenilaian from "../assets/icons/Penilaian.png";
import IconSiswa from "../assets/icons/Siswa.png";

const CourseDetail = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [forums, setForums] = useState([]);
  const [tabIndex, setTabIndex] = useState(() => {
    const savedIndex = localStorage.getItem("lastCourseTabIndex");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  useEffect(() => {
    const fetchedCourse = getCourseById(id);
    setCourse(fetchedCourse);
  }, [id]);

  const tabs = [
    { label: "Forum Diskusi", icon: IconDiskusi },
    { label: "Materi", icon: IconMateri },
    { label: "Tugas", icon: IconTugas },
    { label: "Penilaian", icon: IconPenilaian },
    { label: "Siswa", icon: IconSiswa },
  ];

  const handleTabChange = (index) => {
    setTabIndex(index);
    localStorage.setItem("lastCourseTabIndex", index);
  };

  if (!course) {
    return (
      <Box p={6}>
        <Text fontSize="xl" color="red.500">
          Mata pelajaran tidak ditemukan.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box px={4} pt={4} bg="#E3E9FB">
        <BreadcrumbsPath
          paths={[
            { label: "Menu Utama", link: "/course" },
            { label: "Mata Pelajaran" },
            { label: tabs[tabIndex]?.label || "" },
          ]}
        />
      </Box>

      <Box bg="#E3E9FB" p={4} minH="100vh">
        <Box bg="#E3E9FB" borderRadius="lg" boxShadow="md" overflow="hidden">
          <Box bg="#2f4eb1" color="white" px={6} py={5}>
            <Flex justify="space-between" align="flex-start" flexWrap="wrap">
              <Box mb={{ base: 4, md: 0 }}>
                <Heading size="md" mb={1}>
                  {course.title}
                </Heading>
                <Text fontSize="sm" mb={1}>
                  {course.teacher}
                </Text>
                <Text fontSize="sm" mb={3}>
                  {course.category}
                </Text>
                <Text fontSize="sm">
                  <b>Kode Mapel:</b> {course.code || "-"}
                </Text>
              </Box>
              <Box textAlign={{ base: "left", md: "right" }}>
                <Text
                  bg="white"
                  color="#2f4eb1"
                  fontSize="xs"
                  fontWeight="bold"
                  px={3}
                  py={1}
                  borderRadius="md"
                  display="inline-block"
                  mb={2}
                >
                  KELAS {course.classLevel}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Tabs
            colorScheme="blue"
            variant="unstyled"
            index={tabIndex}
            onChange={handleTabChange}
            isFitted
          >
            <TabList
              display="flex"
              justifyContent="space-around"
              bg="white"
              px={4}
              py={3}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="semibold"
                  borderBottom={
                    tabIndex === index
                      ? "3px solid #2b6cb0"
                      : "3px solid transparent"
                  }
                  color={tabIndex === index ? "#2b6cb0" : "gray.600"}
                  _hover={{ color: "#2b6cb0" }}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    boxSize="20px"
                    mb={1}
                    filter={
                      tabIndex === index
                        ? "brightness(0) saturate(100%) invert(27%) sepia(91%) saturate(2103%) hue-rotate(203deg) brightness(91%) contrast(91%)"
                        : "none"
                    }
                  />
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels px={6} pb={6}>
              <TabPanel>
                <ForumDiskusiList forums={forums} setForums={setForums} />
              </TabPanel>
              <TabPanel>
                <MateriPage courseId={course.id} />
              </TabPanel>
              <TabPanel>
                <TugasList courseId={course.id} />
              </TabPanel>
              <TabPanel>
                <Penilaian courseId={course.id} />
              </TabPanel>
              <TabPanel>
                <SiswaList course={course} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
};

export default CourseDetail;
