import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn("Supabase URL atau Anon Key belum diatur di .env. Fitur yang bergantung pada Supabase mungkin tidak berfungsi.");
    // Sediakan mock client jika dalam mode DEV dan tidak ada env vars
    // Ini hanya untuk pengembangan lokal agar tidak error, idealnya env tetap diisi
  } else {
    throw new Error("Supabase URL atau Anon Key belum diatur.");
  }
}

// Ekspor instance Supabase client jika URL dan Key tersedia
// Atau ekspor null/mock jika tidak (untuk dev mode tanpa env)
const client: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabase = client;

// Expose to window for client-side scripts if in browser
if (typeof window !== 'undefined' && client) {
  (window as any).supabase = client;
}

// Contoh fungsi untuk mengambil data guru (bisa diletakkan di sini atau di file service terpisah)
export interface Guru {
  id: number;
  nama: string;
  jabatan: string | null;
  mapel: string | null;
  foto_url: string | null;
  quotes: string | null;
  created_at?: string;
}

export async function getSemuaGuru(): Promise<Guru[]> {
  if (!supabase) {
    console.warn('Supabase client tidak tersedia, mengembalikan data mock untuk guru.');
    // Data mock jika Supabase tidak terkonfigurasi (hanya untuk DEV)
    return import.meta.env.DEV ? [
      { id: 1, nama: "Mock Guru 1 (Supabase off)", jabatan: "Kepala Sekolah", mapel: "Mock Mapel", foto_url: "/images/placeholders/guru-1.jpg", quotes: "Ini mock data." },
      { id: 2, nama: "Mock Guru 2 (Supabase off)", jabatan: "Guru TKJ", mapel: "Mock Jaringan", foto_url: "/images/placeholders/guru-2.jpg", quotes: "Supabase belum konek." },
    ] : [];
  }

  try {
    const { data, error } = await supabase
      .from('guru') // Nama tabel Anda
      .select('id, nama, jabatan, mapel, foto_url, quotes')
      .order('nama', { ascending: true });

    if (error) {
      console.error('Error fetching guru:', error.message);
      throw error;
    }
    return data as Guru[];
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return import.meta.env.DEV ? [ // Fallback mock data on error during DEV
      { id: 99, nama: "Error Fetch Guru", jabatan: "Error", mapel: "Error", foto_url: "/images/placeholders/guru-error.jpg", quotes: "Gagal mengambil data dari Supabase." }
    ] : [];
  }
}

// Anda juga perlu membuat tabel 'profil_sekolah' di Supabase
// dengan kolom seperti: id, nama_sekolah, visi, misi, sejarah_singkat, alamat, email, telepon, logo_url, dll.
export interface ProfilSekolah {
  id: number;
  nama_sekolah: string;
  visi: string | null;
  misi: string | null; // Bisa berupa text atau json array
  sejarah_singkat: string | null;
  alamat: string | null;
  email: string | null;
  telepon: string | null;
  logo_url: string | null;
  // tambahkan field lain jika perlu
}

export async function getProfilSekolah(): Promise<ProfilSekolah | null> {
  if (!supabase) {
    console.warn('Supabase client tidak tersedia, mengembalikan data mock untuk profil sekolah.');
    return import.meta.env.DEV ? {
      id: 1,
      nama_sekolah: "SMKS Mock Muhammadiyah Satui (Supabase Off)",
      visi: "Mock Visi: Menjadi sekolah mock yang unggul.",
      misi: "Mock Misi 1.\nMock Misi 2.",
      sejarah_singkat: "Mock sejarah singkat sekolah.",
      alamat: "Jl. Mock Alamat No. 123",
      email: "mock@example.com",
      telepon: "08123456789",
      logo_url: "/favicon.svg"
    } : null;
  }

  try {
    const { data, error, status } = await supabase
      .from('profil_sekolah')
      .select('*')
      .limit(1) // Asumsi hanya ada 1 profil sekolah, atau ambil berdasarkan ID tertentu
      .single(); // Mengambil satu baris saja

    if (error && status !== 406) { // 406 berarti tidak ada row, itu bukan error fatal
      console.error('Error fetching profil sekolah:', error.message);
      throw error;
    }

    if (data) {
      return data as ProfilSekolah;
    }
    return null; // Jika tidak ada data

  } catch (err) {
    console.error('Supabase fetch error (profil_sekolah):', err);
    return import.meta.env.DEV ? { // Fallback mock data on error during DEV
      id: 99,
      nama_sekolah: "Error Fetch Profil",
      visi: "Error",
      misi: "Error",
      sejarah_singkat: "Error",
      alamat: "Error",
      email: "Error",
      telepon: "Error",
      logo_url: "/favicon.svg"
    } : null;
  }
}
