// Ambil semua data dari localStorage
export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// Simpan data (overwrite total)
export const setData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Tambah item baru ke array
export const addItem = (key, newItem) => {
  const data = getData(key);
  data.push(newItem);
  setData(key, data);
};

// Update item berdasarkan ID
export const updateItem = (key, id, updatedItem) => {
  const data = getData(key);
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedItem };
    setData(key, data);
  }
};

// Hapus item berdasarkan ID
export const deleteItem = (key, id) => {
  const data = getData(key);
  const filtered = data.filter((item) => item.id !== id);
  setData(key, filtered);
};

// Tambahan untuk data berdasarkan courseId
export const getDataByCourse = (key, courseId) => {
  const allData = getData(key);
  return allData.filter((item) => item.courseId === courseId);
};

export const addItemByCourse = (key, newItem) => {
  const data = getData(key);
  data.push(newItem);
  setData(key, data);
};

export const updateItemByCourse = (key, courseId, id, updatedItem) => {
  const data = getData(key);
  const index = data.findIndex(
    (item) => item.id === id && item.courseId === courseId
  );
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedItem };
    setData(key, data);
  }
};

export const deleteItemByCourse = (key, courseId, id) => {
  const data = getData(key);
  const filtered = data.filter(
    (item) => !(item.id === id && item.courseId === courseId)
  );
  setData(key, filtered);
};

// Inisialisasi jika belum ada
export const initStorage = () => {
  const keys = [
    "dataSiswa",
    "dataGuru",
    "jurusan",
    "kelas",
    "pengumumanDashboard",
    "tugas",
    "materi",
    "forumDiskusi",
    "penilaian",
    "mataPelajaran",
  ];
  keys.forEach((key) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
};

// Ambil semua jurusan (khusus masterData)
export const getAllJurusan = () => {
  const jurusanData = getData("jurusan");
  return jurusanData.map((item) => item.field1);
};

// Ambil semua kelas (khusus masterData)
export const getAllKelas = () => {
  const kelasData = getData("kelas");
  return kelasData.map((item) => item.field1);
};

// Ambil semua mata pelajaran (khusus masterData)
export const getAllMataPelajaran = () => {
  const mapelData = getData("masterDataStorage");
  return Array.isArray(mapelData?.mataPelajaran)
    ? mapelData.mataPelajaran.map((item) => item.field1)
    : [];
};
