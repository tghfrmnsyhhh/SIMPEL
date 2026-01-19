import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./layouts/Layout";
import LupaPassword from "./pages/lupaPassword";
import Dashboard from "./pages/Dashboard";
import Guru from "./pages/Guru";
import Siswa from "./pages/Siswa";
import Course from "./pages/Course";
import CourseDetail from "./pages/CourseDetail";
import DetailMateri from "./pages/DetailMateri";
import KostumisasiSekolah from "./pages/KostumisasiSekolah";
import Tugas from "./pages/Tugas";
import DetailTugas from "./pages/DetailTugas";
import Penilaian from "./pages/Penilaian";
import Login from "./pages/Login";
import ResetPassword from "./pages/resetPassword";
import Profile from "./pages/Profile";
import MasterData from "./pages/MasterData";
import DataPengguna from "./pages/DataPengguna";
import ForumDetail from "./pages/DetailForumDiskusi";
import { MasterDataProvider } from "./context/MasterDataContext";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Bungkus route yang perlu master data dengan MasterDataProvider */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="siswa" element={<Siswa />} />
          <Route path="course" element={<Course />} />
          <Route path="course/:id" element={<CourseDetail />} />
          <Route path="/materi/:id" element={<DetailMateri />} />
          <Route path="tugas" element={<Tugas />} />
          <Route path="/tugas/:id" element={<DetailTugas />} />
          <Route path="/penilaian" element={<Penilaian />} />

          {/* Halaman Kostumisasi Sekolah */}
          <Route path="costum" element={<KostumisasiSekolah />} />

          <Route path="/profile" element={<Profile />} />

          {/* Provider untuk halaman yang butuh master data */}
          <Route
            path="guru"
            element={
              <MasterDataProvider>
                <Guru />
              </MasterDataProvider>
            }
          />

          <Route
            path="/masterdata"
            element={
              <MasterDataProvider>
                <MasterData />
              </MasterDataProvider>
            }
          />

          <Route path="/forum/:forumId" element={<ForumDetail />} />
          <Route path="/data-pengguna" element={<DataPengguna />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
