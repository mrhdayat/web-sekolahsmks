// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { supabase } from '@lib/supabase'; // Pastikan path ini benar

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // Daftar rute admin yang diproteksi
  const adminRoutes = ['/admin/dashboard', '/admin/dashboard/']; // Tambahkan path admin lainnya

  // Cek apakah rute saat ini adalah rute admin
  const isAdminRoute = url.pathname.startsWith('/admin/') && url.pathname !== '/admin/login';

  if (isAdminRoute) {
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      // console.log('Middleware: No tokens found, redirecting to login.');
      return redirect('/admin/login');
    }

    // Validasi token dengan Supabase (opsional, tapi lebih aman)
    // Ini akan melakukan network request, jadi pertimbangkan dampaknya.
    // Atau, andalkan RLS di Supabase untuk proteksi data.
    if (supabase) {
        const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (error || !session) {
            // Jika token tidak valid atau error, hapus cookie dan redirect
            // console.log('Middleware: Invalid session or error, redirecting to login.', error?.message);
            cookies.delete('sb-access-token', { path: '/' });
            cookies.delete('sb-refresh-token', { path: '/' });
            return redirect('/admin/login');
        }

        // Jika session valid, perbarui cookie jika ada perubahan (misal access token di-refresh)
        if (session.access_token !== accessToken) {
            cookies.set("sb-access-token", session.access_token, {
                path: "/", maxAge: session.expires_in, httpOnly: true, secure: import.meta.env.PROD, sameSite: "lax",
            });
        }
        if (session.refresh_token && session.refresh_token !== refreshToken) { // refresh_token mungkin tidak selalu berubah
             cookies.set("sb-refresh-token", session.refresh_token, {
                path: "/", maxAge: 60 * 60 * 24 * 7, httpOnly: true, secure: import.meta.env.PROD, sameSite: "lax",
            });
        }
        // Simpan user di context agar bisa diakses di endpoint/halaman (opsional)
        context.locals.user = session.user;
    } else {
        // console.warn("Supabase client not available in middleware for token validation.");
        // Jika Supabase tidak ada di middleware, kita hanya bisa bergantung pada keberadaan cookie
        // Ini kurang aman. Pastikan Supabase client bisa diimpor dan digunakan di sini.
    }
  }

  // Jika bukan rute admin yang diproteksi, atau jika sudah login (lolos cek di atas), lanjutkan.
  return next();
});
