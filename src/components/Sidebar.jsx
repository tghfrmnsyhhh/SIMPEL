import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/Sidebar.css";

import IconBeranda from "../assets/icons/IconBeranda.png";
import IconGuru from "../assets/icons/IconGuru.png";
import IconSiswa from "../assets/icons/IconSiswa.png";
import IconMataPelajaran from "../assets/icons/IconMataPelajaran.png";
import IconKostumisasi from "../assets/icons/IconKostumisasiDataSekolah.png";
import IconMasterData from "../assets/icons/IconMasterData.png";
import IconDataPengguna from "../assets/icons/IconDataPengguna.png";
import Logo from "../assets/images/Logo.png";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const sidebarClass = isMobile ? "sidebar mobile" : "sidebar";
  const fullClass = `${sidebarClass} ${isOpen ? "open" : "closed"}`;

  const [schoolData, setSchoolData] = useState({
    namaSekolah: "Simpel LMS",
    logoUrl: Logo,
  });

  const [role, setRole] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataSekolah"));
    if (data) {
      setSchoolData({
        namaSekolah: data.namaSekolah || "Simpel LMS",
        logoUrl: data.logo || Logo,
      });
    }

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRole(storedRole.toLowerCase());

    const handleUpdate = () => {
      const updated = JSON.parse(localStorage.getItem("dataSekolah"));
      if (updated) {
        setSchoolData({
          namaSekolah: updated.namaSekolah || "Simpel LMS",
          logoUrl: updated.logo || Logo,
        });
      }
    };

    window.addEventListener("dataSekolahUpdated", handleUpdate);
    return () => {
      window.removeEventListener("dataSekolahUpdated", handleUpdate);
    };
  }, []);

  const commonItems = [
    { section: "Menu Utama" },
    { to: "/dashboard", label: "Beranda", icon: IconBeranda },
    { to: "/course", label: "Mata Pelajaran", icon: IconMataPelajaran },
    { section: "Menu Data" },
    { to: "/guru", label: "Guru", icon: IconGuru },
    { to: "/siswa", label: "Siswa", icon: IconSiswa },
  ];

  const adminItems = [
    { section: "Menu Admin" },
    { to: "/MasterData", label: "Master Data", icon: IconMasterData },
    { to: "/data-pengguna", label: "Data Pengguna", icon: IconDataPengguna },
    { to: "/costum", label: "Kostumisasi Sekolah", icon: IconKostumisasi },
  ];

  const navItems =
    role === "admin" ? [...commonItems, ...adminItems] : commonItems;

  return (
    <>
      <div className={fullClass}>
        <div className="sidebar-header">
          <img
            src={schoolData.logoUrl || Logo}
            alt="Logo Sekolah"
            className="sidebar-logo"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: isOpen ? "10px" : "0",
            }}
          />
          {isOpen && (
            <span className="logo-text" title={schoolData.namaSekolah}>
              {schoolData.namaSekolah}
            </span>
          )}
        </div>

        <nav className="nav-links">
          {navItems.map((item, index) =>
            item.section ? (
              isOpen && (
                <div key={`section-${index}`} className="section-label">
                  {item.section}
                </div>
              )
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                <span className="nav-icon">
                  <img src={item.icon} alt={item.label} className="nav-img" />
                </span>
                {isOpen && <span className="nav-text">{item.label}</span>}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {isMobile && isOpen && <div className="overlay" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
