export const LOCAL_STORAGE_KEY = "masterDataStorage";

export const getMasterDataOptions = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};

    return {
      statusGuru: (data.statusGuru || []).map((d) => d.field1),
      jabatan: (data.jabatan || []).map((d) => d.field1),
    };
  } catch {
    return { statusGuru: [], jabatan: [], mataPelajaran: [] };
  }
};
