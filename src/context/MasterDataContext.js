import React, { createContext, useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "masterDataStorage";

export const MasterDataContext = createContext();

export function MasterDataProvider({ children }) {
  // Load data master dari localStorage
  const loadStorage = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // Simpan data master ke localStorage
  const saveStorage = (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  // List master data yang kita simpan (sesuaikan dengan master data kamu)
  const masterListDefKeys = [
    "jurusan",
    "kelas",
    "statusGuru",
    "statusSiswa",
    "tahunAjar",
    "jabatan",
    "mataPelajaran",
  ];

  // State untuk menyimpan master data
  const [masterData, setMasterData] = useState(() => {
    const storage = loadStorage();
    const data = {};
    masterListDefKeys.forEach((key) => {
      data[key] = storage[key] || [];
    });
    return data;
  });

  // Setiap masterData berubah, simpan ke localStorage
  useEffect(() => {
    saveStorage(masterData);
  }, [masterData]);

  return (
    <MasterDataContext.Provider value={{ masterData, setMasterData }}>
      {children}
    </MasterDataContext.Provider>
  );
}
