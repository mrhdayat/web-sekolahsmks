document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Admin JS: Sidebar, Theme, Stats Loader ---
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarToggleIcon = document.getElementById('sidebar-toggle-icon');
    const sidebarOpenMobile = document.getElementById('sidebar-open-mobile');
    const sidebarCloseMobile = document.getElementById('sidebar-close-mobile');
    const themeToggleBtnAdmin = document.getElementById('theme-toggle-admin');
    const themeToggleIconLightAdmin = document.getElementById('theme-toggle-icon-light-admin');
    const themeToggleIconDarkAdmin = document.getElementById('theme-toggle-icon-dark-admin');
    const htmlElement = document.documentElement;
    const statsCardsContainer = document.getElementById('stats-cards-container');
    const statsSkeletons = document.getElementById('stats-cards-skeletons');
    const statsData = document.getElementById('stats-cards-data');

    if (statsCardsContainer) {
        setTimeout(() => {
            if (statsSkeletons && statsData) {
                statsSkeletons.classList.add('hidden');
                statsData.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }, 2000);
    }

    const SIDEBAR_COLLAPSED_KEY = 'admin_sidebar_collapsed';
    function applySidebarState(collapsed) {
        if (!sidebar) return;
        if (collapsed) {
            sidebar.classList.add('collapsed');
            sidebar.style.width = '5rem';
            if (sidebarToggleIcon) sidebarToggleIcon.setAttribute('data-lucide', 'chevrons-right');
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.style.width = '16rem';
            if (sidebarToggleIcon) sidebarToggleIcon.setAttribute('data-lucide', 'chevrons-left');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    let isSidebarCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    applySidebarState(isSidebarCollapsed);
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            isSidebarCollapsed = !isSidebarCollapsed;
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isSidebarCollapsed);
            applySidebarState(isSidebarCollapsed);
        });
    }
    if (sidebarOpenMobile && sidebar) {
        sidebarOpenMobile.addEventListener('click', () => {
            sidebar.classList.remove('hidden-mobile');
            sidebar.style.transform = 'translateX(0%)';
        });
    }
    if (sidebarCloseMobile && sidebar) {
        sidebarCloseMobile.addEventListener('click', () => {
            sidebar.classList.add('hidden-mobile');
            sidebar.style.transform = 'translateX(-100%)';
        });
    }

    const ADMIN_THEME_KEY = 'admin_theme';
    function applyAdminTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            if(themeToggleIconLightAdmin) themeToggleIconLightAdmin.classList.add('hidden');
            if(themeToggleIconDarkAdmin) themeToggleIconDarkAdmin.classList.remove('hidden');
        } else {
            htmlElement.classList.remove('dark');
            if(themeToggleIconLightAdmin) themeToggleIconLightAdmin.classList.remove('hidden');
            if(themeToggleIconDarkAdmin) themeToggleIconDarkAdmin.classList.add('hidden');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    let currentAdminTheme = localStorage.getItem(ADMIN_THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyAdminTheme(currentAdminTheme);
    if (themeToggleBtnAdmin) {
        themeToggleBtnAdmin.addEventListener('click', () => {
            const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem(ADMIN_THEME_KEY, newTheme);
            applyAdminTheme(newTheme);
        });
    }

    // --- NEW CRUD UI Logic ---

    // Page content elements
    const dashboardContent = document.getElementById('dashboard-content');
    const beritaContent = document.getElementById('berita-content');
    const mainContentTitle = document.querySelector('#admin-content-area header h2'); // More specific selector for header title

    // Sidebar navigation links (ensure hrefs are set in HTML: #dashboard, #berita)
    const navLinks = document.querySelectorAll('#admin-sidebar nav a');

    // Berita Modal elements
    const beritaModal = document.getElementById('berita-modal');
    const beritaModalContent = document.getElementById('berita-modal-content');
    const beritaModalTitle = document.getElementById('berita-modal-title');
    const closeBeritaModalBtn = document.getElementById('close-berita-modal-btn');
    const addBeritaBtn = document.getElementById('add-berita-btn');
    const beritaForm = document.getElementById('berita-form');
    const cancelBeritaFormBtn = document.getElementById('cancel-berita-form-btn');
    const beritaIdField = document.getElementById('berita-id');

    // Delete Confirmation Modal elements
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deleteConfirmModalContent = document.getElementById('delete-confirm-modal-content');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let itemToDeleteId = null;

    // Toast Notification elements
    const toastNotification = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const closeToastBtn = document.getElementById('close-toast-btn');
    let toastTimeout;

    // Function to show/hide pages
    function showPage(pageId) {
        [dashboardContent, beritaContent].forEach(content => {
            if (content) content.classList.add('hidden');
        });
        const activePage = document.getElementById(pageId + '-content');
        if (activePage) activePage.classList.remove('hidden');

        if (mainContentTitle) {
            let titleText = 'Dashboard'; // Default
            if (pageId === 'dashboard') titleText = 'Dashboard Utama';
            else if (pageId === 'berita') titleText = 'Manajemen Berita';
            // Add other page titles here
            mainContentTitle.textContent = titleText;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const pageId = href.substring(1); // Remove #
                if (pageId) { // Ensure pageId is not empty
                    showPage(pageId);
                     // Update active link state (optional)
                    navLinks.forEach(l => l.classList.remove('bg-blue-100', 'dark:bg-gray-700', 'font-semibold'));
                    link.classList.add('bg-blue-100', 'dark:bg-gray-700', 'font-semibold');
                }
            }
        });
    });
     // Set initial active link for dashboard (if it's the default)
    const initialActiveLink = document.querySelector('#admin-sidebar nav a[href="#dashboard"]');
    if(initialActiveLink) initialActiveLink.classList.add('bg-blue-100', 'dark:bg-gray-700', 'font-semibold');
    showPage('dashboard'); // Default to dashboard page

    // --- Modal Generic Functions ---
    function openModal(modal, modalContent) {
        if (!modal || !modalContent) return;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.style.opacity = '1';
            if (modalContent) modalContent.style.transform = 'scale(1)';
        }, 10);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeModal(modal, modalContent) {
        if (!modal || !modalContent) return;
        modal.style.opacity = '0';
        if (modalContent) modalContent.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // --- Berita Modal Logic ---
    if (addBeritaBtn) {
        addBeritaBtn.addEventListener('click', () => {
            if (beritaForm) beritaForm.reset();
            if (beritaIdField) beritaIdField.value = '';
            if (beritaModalTitle) beritaModalTitle.textContent = 'Tambah Berita Baru';
            document.querySelectorAll('#berita-form .validation-error').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('#berita-form input, #berita-form select, #berita-form textarea').forEach(el => el.classList.remove('border-red-500', 'dark:border-red-500'));
            openModal(beritaModal, beritaModalContent);
        });
    }

    if (closeBeritaModalBtn) closeBeritaModalBtn.addEventListener('click', () => closeModal(beritaModal, beritaModalContent));
    if (cancelBeritaFormBtn) cancelBeritaFormBtn.addEventListener('click', () => closeModal(beritaModal, beritaModalContent));
    if (beritaModal) beritaModal.addEventListener('click', (event) => { if (event.target === beritaModal) closeModal(beritaModal, beritaModalContent); });

    // --- Form Validation & Submission ---
    if (beritaForm) {
        beritaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            ['berita-judul', 'berita-kategori', 'berita-konten'].forEach(id => {
                const field = document.getElementById(id);
                const errorMsg = field.parentElement.querySelector('.validation-error');
                if (field.value.trim() === '') {
                    isValid = false;
                    field.classList.add('border-red-500', 'dark:border-red-500');
                    if (errorMsg) errorMsg.classList.remove('hidden');
                    field.classList.add('animate-shake');
                    setTimeout(() => field.classList.remove('animate-shake'), 500);
                } else {
                    field.classList.remove('border-red-500', 'dark:border-red-500');
                    if (errorMsg) errorMsg.classList.add('hidden');
                }
            });

            if (isValid) {
                const action = beritaIdField.value ? 'diperbarui' : 'ditambahkan';
                closeModal(beritaModal, beritaModalContent);
                showToast(`Berita berhasil ${action}!`, 'success');

                const newRowId = beritaIdField.value || Date.now().toString();
                const title = document.getElementById('berita-judul').value;
                const category = document.getElementById('berita-kategori').value;
                const status = document.getElementById('berita-status').value;
                const date = new Date().toISOString().split('T')[0];
                const tableBody = document.querySelector('#berita-content table tbody');
                const existingRow = tableBody ? tableBody.querySelector(`tr[data-id="${newRowId}"]`) : null;

                if (existingRow && beritaIdField.value) { // Edit
                    existingRow.cells[0].textContent = title;
                    existingRow.cells[1].textContent = category;
                    existingRow.cells[2].textContent = date;
                    existingRow.cells[3].innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200'}">${status}</span>`;
                } else if (tableBody) { // Add new
                     const newRowHtml = `
                        <tr data-id="${newRowId}">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${title}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${category}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${date}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200'}">${status}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button class="edit-berita-btn text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"><i data-lucide="edit" class="w-5 h-5"></i></button>
                                <button class="delete-berita-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                            </td>
                        </tr>`;
                    tableBody.insertAdjacentHTML('beforeend', newRowHtml);
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
                addEventListenersToTableButtons();
            }
        });
    }

    function addEventListenersToTableButtons() {
        const beritaTable = document.querySelector('#berita-content table');
        if (beritaTable) {
            beritaTable.addEventListener('click', (event) => {
                const editButton = event.target.closest('.edit-berita-btn');
                const deleteButton = event.target.closest('.delete-berita-btn');

                if (editButton) {
                    const row = editButton.closest('tr');
                    const id = row.dataset.id;
                    const title = row.cells[0].textContent;
                    const category = row.cells[1].textContent;
                    const statusText = row.cells[3].querySelector('span').textContent;

                    if(beritaForm) beritaForm.reset();
                    if(beritaIdField) beritaIdField.value = id;
                    if(beritaModalTitle) beritaModalTitle.textContent = 'Edit Berita';
                    if(document.getElementById('berita-judul')) document.getElementById('berita-judul').value = title;
                    if(document.getElementById('berita-kategori')) document.getElementById('berita-kategori').value = category;
                    if(document.getElementById('berita-status')) document.getElementById('berita-status').value = statusText; // Published or Draft
                    if(document.getElementById('berita-konten')) document.getElementById('berita-konten').value = "Konten berita '" + title + "' (placeholder). Isi aktual perlu diambil dari sumber data.";

                    document.querySelectorAll('#berita-form .validation-error').forEach(el => el.classList.add('hidden'));
                    document.querySelectorAll('#berita-form input, #berita-form select, #berita-form textarea').forEach(el => el.classList.remove('border-red-500', 'dark:border-red-500'));
                    openModal(beritaModal, beritaModalContent);
                }

                if (deleteButton) {
                    itemToDeleteId = deleteButton.closest('tr').dataset.id;
                    openModal(deleteConfirmModal, deleteConfirmModalContent);
                }
            });
        }
    }
    addEventListenersToTableButtons();

    // --- Delete Confirmation Logic ---
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => closeModal(deleteConfirmModal, deleteConfirmModalContent));
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (itemToDeleteId) {
                const rowToDelete = document.querySelector(`#berita-content table tr[data-id="${itemToDeleteId}"]`);
                if (rowToDelete) {
                    rowToDelete.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                    rowToDelete.style.opacity = '0';
                    rowToDelete.style.transform = 'translateX(-100px)';
                    setTimeout(() => {
                        rowToDelete.remove();
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    }, 300);
                }
                closeModal(deleteConfirmModal, deleteConfirmModalContent);
                showToast('Item berhasil dihapus!', 'success');
                itemToDeleteId = null;
            }
        });
    }
    if (deleteConfirmModal) deleteConfirmModal.addEventListener('click', (event) => { if (event.target === deleteConfirmModal) closeModal(deleteConfirmModal, deleteConfirmModalContent); });

    // --- Toast Notification Logic ---
    function showToast(message, type = 'success') {
        if (!toastNotification || !toastMessage) return;
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toastNotification.className = 'fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-xl z-[60] transform transition-all duration-300 ease-out'; // Reset classes

        if (type === 'success') toastNotification.classList.add('bg-green-500', 'text-white');
        else if (type === 'error') toastNotification.classList.add('bg-red-500', 'text-white');
        else toastNotification.classList.add('bg-blue-500', 'text-white'); // info

        toastNotification.classList.remove('hidden', 'translate-y-16', 'opacity-0');
        toastNotification.style.transform = 'translateY(0)';
        toastNotification.style.opacity = '1';

        toastTimeout = setTimeout(() => {
            toastNotification.style.transform = 'translateY(4rem)';
            toastNotification.style.opacity = '0';
            setTimeout(() => toastNotification.classList.add('hidden'), 300);
        }, 3000);
    }

    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', () => {
            clearTimeout(toastTimeout);
            toastNotification.style.transform = 'translateY(4rem)';
            toastNotification.style.opacity = '0';
            setTimeout(() => toastNotification.classList.add('hidden'), 300);
        });
    }

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s ease-in-out; }
    `;
    document.head.appendChild(styleSheet);

    if (typeof lucide !== 'undefined') lucide.createIcons();
    console.log("Admin dashboard CRUD UI, page switching, modals, and toast logic initialized.");
});
