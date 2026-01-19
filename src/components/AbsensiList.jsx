import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Attendance = ({ courseId }) => {
  return (
    <Box>
      <Text>Fitur absensi untuk course ID: {courseId}</Text>
      {/* Kamu bisa menambahkan checkbox atau table untuk siswa di sini */}
    </Box>
  );
};

export default Attendance;
