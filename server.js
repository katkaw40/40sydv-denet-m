
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kırşehir SYD Vakfı Dosya ve Görev Takip Portalı</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .backdrop-blur-custom { backdrop-filter: blur(8px); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col justify-between custom-scrollbar">

    <div id="toastContainer" class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"></div>

    <div id="announcementPopupModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div class="bg-red-700 text-white p-5 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="p-2.5 bg-red-800 rounded-xl">
                        <i class="fa-solid fa-bullhorn text-xl text-yellow-300"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base leading-tight">YÖNETİCİ / VAKIF DUYURUSU</h3>
                        <p class="text-[11px] text-red-200 mt-0.5">Sisteme giriş yapmadan önce okunması gereken duyurudur.</p>
                    </div>
                </div>
                <button onclick="closeModal('announcementPopupModal')" class="text-white/80 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="announcementPopupContent" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs text-slate-700"></div>
            <div class="p-4 bg-slate-50 border-t border-slate-200 text-right">
                <button onclick="closeModal('announcementPopupModal')" class="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow">Okudum / Kapat ve Giriş Yap</button>
            </div>
        </div>
    </div>

    <div id="adminRedBanner" class="hidden bg-red-600 text-white px-4 py-3 shadow-lg relative z-40 border-b-2 border-red-800">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <i class="fa-solid fa-triangle-exclamation text-2xl animate-bounce text-yellow-300"></i>
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-wide">DİKKAT: Personel Dosya Red Bildirimi!</h4>
                    <p id="adminRedBannerText" class="text-xs text-red-100"></p>
                </div>
            </div>
            <button onclick="dismissRedBanner()" class="bg-red-800 hover:bg-red-900 text-xs px-3 py-1.5 rounded-lg transition font-semibold">Anladım / Kapat</button>
        </div>
    </div>

    <div id="announcementsListModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div class="bg-red-800 text-white p-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-bullhorn"></i><span>Vakıf Duyuruları Arşivi</span>
                </h3>
                <button onclick="closeModal('announcementsListModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div id="announcementsListContent" class="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4"></div>
            <div class="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button onclick="closeModal('announcementsListModal')" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">Kapat</button>
            </div>
        </div>
    </div>

    <div id="loginScreen" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 relative">
        <div class="absolute inset-0 bg-[radial-gradient(#circle_at_center,rgba(255,255,255,0.05)_0,transparent_100%)] pointer-events-none"></div>
        <div class="max-w-md w-full bg-white/95 backdrop-blur-custom rounded-2xl shadow-2xl p-8 border border-slate-200 relative z-10">
            <div class="text-center mb-8">
                <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-red-50 p-2 flex items-center justify-center shadow-inner border border-red-100">
                    <div class="w-full h-full rounded-full bg-red-700 flex flex-col items-center justify-center text-white text-center p-1">
                        <i class="fa-solid fa-hands-holding-child text-2xl mb-1"></i>
                        <span class="text-[9px] font-black leading-none tracking-tighter uppercase">T.C. AİLE VE SOSYAL HİZMETLER BAKANLIĞI</span>
                    </div>
                </div>
                <h1 class="text-xl font-bold text-slate-800">T.C. KIRŞEHİR VALİLİĞİ</h1>
                <p class="text-xs font-semibold text-red-700 tracking-wider uppercase mt-1">Sosyal Yardımlaşma ve Dayanışma Vakfı</p>
                <div class="h-0.5 w-16 bg-red-600 mx-auto my-3 rounded-full"></div>
                <p class="text-xs text-slate-500 font-medium">Dosya ve Görev Takip Portalı</p>
            </div>

            <form id="loginForm" onsubmit="handleLogin(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Kullanıcı / Personel Seçimi</label>
                    <div class="relative">
                        <i class="fa-solid fa-user-gear absolute left-3 top-3.5 text-slate-400 text-sm"></i>
                        <select id="userSelect" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition" required></select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Sistem Şifresi</label>
                    <div class="relative">
                        <i class="fa-solid fa-lock absolute left-3 top-3.5 text-slate-400 text-sm"></i>
                        <input type="password" id="loginPassword" value="123456" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition" placeholder="Şifrenizi giriniz" required />
                    </div>
                    <span class="text-[10px] text-slate-400 mt-1 block">Varsayılan Şifre: <strong class="text-slate-600">123456</strong></span>
                </div>

                <button type="submit" class="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-red-700/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span>Sisteme Giriş Yap</span>
                </button>
            </form>
            <div class="mt-6 text-center text-[11px] text-slate-400">
                &copy; 2026 Kırşehir SYDV Bilgi İşlem Birimi (3 Yıllık Yasal Arşiv Korumalı)
            </div>
        </div>
    </div>

    <div id="forcePasswordModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div class="bg-amber-600 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-key"></i><span>Zorunlu Şifre Güncelleme</span>
                </h3>
            </div>
            <form onsubmit="handleForcePasswordSubmit(event)" class="p-5 space-y-4">
                <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> Güvenliğiniz için şifrenizi varsayılandan (123456) değiştirmeniz gerekmektedir. Lütfen yeni kişisel şifrenizi belirleyiniz.
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Yeni Şifreniz</label>
                    <input type="password" id="forceNewPass" required minlength="4" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-600 outline-none" placeholder="En az 4 karakter">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Yeni Şifreniz (Tekrar)</label>
                    <input type="password" id="forceNewPassConfirm" required minlength="4" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-600 outline-none" placeholder="Yeni şifrenizi tekrar giriniz">
                </div>
                <button type="submit" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition">
                    Şifreyi Kaydet ve Devam Et
                </button>
            </form>
        </div>
    </div>

    <div id="deliveryModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div class="bg-red-700 text-white p-5 flex items-center justify-between border-b border-red-800">
                <div class="flex items-center space-x-3">
                    <div class="p-2.5 bg-red-800 rounded-xl">
                        <i class="fa-solid fa-file-signature text-xl text-yellow-300"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg leading-tight">ZORUNLU DOSYA TESLİM - TESELLÜM ONAYI</h3>
                        <p class="text-xs text-red-200 mt-0.5">Sisteme erişebilmek için tarafınıza atanan yeni dosyaları onaylamalısınız.</p>
                    </div>
                </div>
            </div>

            <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-900 text-xs leading-relaxed">
                    <p class="font-bold text-sm mb-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Sayın <span id="deliveryStaffName" class="underline"></span>,</p>
                    Aşağıda detayları verilen dosyalar üzerinize zimmetlenmiştir. Lütfen referans numaralarını ve konularını inceleyip teslim aldığınızı onaylayınız.
                </div>

                <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table class="w-full text-left text-xs text-slate-600">
                        <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th class="p-3">Ref / Dosya No</th>
                                <th class="p-3">Detay / Konu</th>
                                <th class="p-3">Kategori</th>
                                <th class="p-3">Devreden / Veren</th>
                            </tr>
                        </thead>
                        <tbody id="unconfirmedFilesTable" class="divide-y divide-slate-200 bg-white"></tbody>
                    </table>
                </div>

                <div id="rejectionSection" class="hidden bg-red-50 p-4 rounded-xl border border-red-200 space-y-2">
                    <label class="block text-xs font-bold text-red-800 uppercase">
                        <i class="fa-solid fa-comment-slash mr-1"></i> Dosyaları Reddetme / Teslim Almama Gerekçesi (Zorunlu):
                    </label>
                    <textarea id="rejectionReason" rows="3" class="w-full p-3 bg-white border border-red-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 outline-none" placeholder="Lütfen dosyaları neden teslim almadığınızı açıklayınız..."></textarea>
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button id="toggleRejectBtn" onclick="toggleRejectionView()" class="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1">
                    <i class="fa-solid fa-xmark text-red-600"></i>
                    <span id="toggleRejectText">Dosyaları Teslim Almıyorum (Reddet)</span>
                </button>

                <div class="flex items-center space-x-2">
                    <button id="confirmRejectBtn" onclick="submitRejection()" class="hidden px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Reddin Gerekçesini Admin'e Gönder & Çık</span>
                    </button>

                    <button id="acceptFilesBtn" onclick="acceptAssignedFiles()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
                        <i class="fa-solid fa-circle-check text-sm"></i>
                        <span>Tarafıma Atanan Dosyaları Aldım, Onaylıyorum</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div id="staffArchiveModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div class="bg-red-800 text-white p-4 flex items-center justify-between">
                <h3 id="archiveModalTitle" class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-folder-closed"></i><span>Personel Dosya Arşivi</span>
                </h3>
                <button onclick="closeModal('staffArchiveModal')" class="text-white/80 hover:text-white text-base"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3" id="staffArchiveContent"></div>
            <div class="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button onclick="closeModal('staffArchiveModal')" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">Kapat</button>
            </div>
        </div>
    </div>

    <div id="fileDetailModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
            <div class="bg-slate-800 text-white p-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-circle-info text-yellow-400"></i><span>Dosya Detay ve Ekleyen Personel Bilgisi</span>
                </h3>
                <button onclick="closeModal('fileDetailModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div class="p-6 space-y-4 text-xs text-slate-700" id="fileDetailModalContent"></div>
            <div class="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button onclick="closeModal('fileDetailModal')" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">Kapat</button>
            </div>
        </div>
    </div>

    <div id="mainApp" class="hidden flex-1 flex flex-col">
        <header class="bg-red-800 text-white shadow-md sticky top-0 z-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-800 font-bold shadow-inner">
                            <i class="fa-solid fa-hands-holding-child text-xl"></i>
                        </div>
                        <div>
                            <h2 class="font-bold text-sm sm:text-base leading-tight">KIRŞEHİR SYD VAKFI</h2>
                            <p class="text-[10px] text-red-200 tracking-wide font-medium">Dosya ve Görev Takip Portalı</p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-3 sm:space-x-4">
                        <button onclick="openAnnouncementsListModal()" class="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-xl transition shadow text-xs font-bold flex items-center space-x-1.5 animate-pulse">
                            <i class="fa-solid fa-bullhorn"></i>
                            <span>Duyurular</span>
                        </button>

                        <div class="flex items-center space-x-3">
                            <div class="text-right hidden sm:block">
                                <div id="currentUserName" class="text-xs font-bold leading-tight">...</div>
                                <div id="currentUserRole" class="text-[10px] text-red-200">...</div>
                            </div>
                            <button onclick="openPasswordModal()" class="p-2 bg-red-900/80 hover:bg-red-900 text-white rounded-xl transition shadow-sm text-xs flex items-center space-x-1" title="Şifre Değiştir">
                                <i class="fa-solid fa-key"></i>
                                <span class="hidden md:inline">Şifre</span>
                            </button>
                            <button onclick="logout()" class="p-2 bg-red-900 hover:bg-red-950 text-white rounded-xl transition shadow-sm text-xs flex items-center space-x-1">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                <span class="hidden md:inline">Çıkış</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="staffActiveTaskAlert" class="hidden bg-amber-400 text-slate-900 px-4 py-2 font-bold text-xs flex items-center justify-between border-t border-amber-500">
                <div class="flex items-center space-x-2">
                    <i class="fa-solid fa-triangle-exclamation text-base animate-pulse"></i>
                    <span id="staffActiveTaskText">Üzerinizde tamamlanmayı bekleyen aktif görevler bulunmaktadır!</span>
                </div>
            </div>

            <div class="bg-red-900 border-t border-red-700/50">
                <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <nav class="flex space-x-1 sm:space-x-2 overflow-x-auto custom-scrollbar py-2 text-xs font-medium">
                        <button onclick="switchTab('tab-inceleme')" id="nav-tab-inceleme" class="tab-btn px-3 py-2 rounded-lg text-white font-semibold bg-red-800 whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-folder-open"></i><span>İnceleme Dosyaları</span>
                        </button>
                        <button onclick="switchTab('tab-kimde')" id="nav-tab-kimde" class="tab-btn px-3 py-2 rounded-lg text-red-200 hover:bg-red-800/60 hover:text-white whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-users-viewfinder"></i><span>Kime Hangi Dosya Verildi (Arşiv)</span>
                        </button>
                        <button onclick="switchTab('tab-mudur')" id="nav-tab-mudur" class="tab-btn px-3 py-2 rounded-lg text-red-200 hover:bg-red-800/60 hover:text-white whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-user-tie"></i><span>Müdür Bey Talimatları</span>
                        </button>
                        <button onclick="switchTab('tab-sikayet')" id="nav-tab-sikayet" class="tab-btn px-3 py-2 rounded-lg text-red-200 hover:bg-red-800/60 hover:text-white whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-comment-dots"></i><span>Vatandaş Şikayetleri</span>
                        </button>
                        <button onclick="switchTab('tab-hastane')" id="nav-tab-hastane" class="tab-btn px-3 py-2 rounded-lg text-red-200 hover:bg-red-800/60 hover:text-white whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-hospital-user"></i><span>Hastane Sevk Dilekçeleri</span>
                        </button>
                        <button onclick="switchTab('tab-toplanti')" id="nav-tab-toplanti" class="tab-btn px-3 py-2 rounded-lg text-red-200 hover:bg-red-800/60 hover:text-white whitespace-nowrap flex items-center space-x-2 transition">
                            <i class="fa-solid fa-people-group"></i><span>Toplantı Dosyaları</span>
                        </button>
                        <button onclick="switchTab('tab-admin')" id="nav-tab-admin" class="tab-btn hidden px-3 py-2 rounded-lg text-yellow-300 hover:bg-yellow-500/20 whitespace-nowrap flex items-center space-x-2 transition border border-yellow-400/30">
                            <i class="fa-solid fa-shield-halved"></i><span>Süper Admin Kontrol Paneli</span>
                        </button>
                    </nav>
                </div>
            </div>
        </header>

        <main class="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <div class="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-3 flex-1 min-w-[280px]">
                    <div class="relative w-full">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-sm"></i>
                        <input type="text" id="searchInput" onkeyup="filterFiles()" placeholder="Referans No veya açıklama ile arayın..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button id="addFileBtn" onclick="openNewFileModal()" class="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-2">
                        <i class="fa-solid fa-plus text-sm"></i>
                        <span id="addFileBtnText">Yeni Dosya Ekle</span>
                    </button>
                </div>
            </div>

            <div id="tab-inceleme" class="tab-content space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-folder-open text-red-700"></i>
                            <span>Sistemdeki Aktif İnceleme Dosyaları</span>
                        </h3>
                        <span id="incelemeCount" class="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">0 Dosya</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">İnceleme Gerekçesi / Konu</th>
                                    <th class="p-3">Ekleyen Personel</th>
                                    <th class="p-3">Atanan Personel</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="table-inceleme" class="divide-y divide-slate-200 bg-white"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-kimde" class="tab-content hidden space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <h3 class="font-bold text-sm text-slate-800 mb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-users-viewfinder text-red-700"></i>
                        <span>Personel Bazlı Zimmet ve Arşiv Özeti (3 Yıllık Yasal Korumalı)</span>
                    </h3>
                    <p class="text-xs text-slate-400 mb-4">Binlerce verinin performansla yönetilmesi için her personelin dosyaları tıklandığında açılır pencerede listelenir.</p>
                    <div id="kimdeMatrix" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
                </div>
            </div>

            <div id="tab-mudur" class="tab-content hidden space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-user-tie text-red-700"></i>
                            <span>Müdür Bey Yazılı Talimatları</span>
                        </h3>
                        <button id="addMudurBtn" onclick="openMudurModal()" class="hidden px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow transition">
                            <i class="fa-solid fa-plus mr-1"></i> Yeni Müdür Talimatı Gir
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Talimat Metni</th>
                                    <th class="p-3">Veren Makam</th>
                                    <th class="p-3">Görevli Personel</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlem / Açıklama</th>
                                </tr>
                            </thead>
                            <tbody id="table-mudur" class="divide-y divide-slate-200 bg-white"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-sikayet" class="tab-content hidden space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-comment-dots text-red-700"></i>
                            <span>Vatandaş Şikayetleri</span>
                        </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Şikayet Konusu</th>
                                    <th class="p-3">Ekleyen Personel</th>
                                    <th class="p-3">Atanan Personel</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="table-sikayet" class="divide-y divide-slate-200 bg-white"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-hastane" class="tab-content hidden space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-hospital-user text-red-700"></i>
                            <span>Sağlık Sevk ve Hastane Destek Dosyaları</span>
                        </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Sevk Dosyası Konusu</th>
                                    <th class="p-3">Ekleyen Personel</th>
                                    <th class="p-3">Takipçi Personel</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="table-hastane" class="divide-y divide-slate-200 bg-white"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-toplanti" class="tab-content hidden space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-people-group text-red-700"></i>
                            <span>Vakıf Mütevelli Heyeti ve Toplantı Dosyaları</span>
                        </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Toplantı Dosyası Konusu</th>
                                    <th class="p-3">Ekleyen Personel</th>
                                    <th class="p-3">Sorumlu Personel</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="table-toplanti" class="divide-y divide-slate-200 bg-white"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-admin" class="tab-content hidden space-y-6">
                <div class="bg-gradient-to-r from-slate-900 to-red-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-bold flex items-center space-x-2">
                            <i class="fa-solid fa-shield-halved text-yellow-400"></i>
                            <span>Süper Admin Sistem Yönetim & Sınırsız Kontrol Paneli</span>
                        </h3>
                        <p class="text-xs text-slate-300 mt-1">
                            Sistemdeki tüm kayıtları, duyuruları, şifreleri ve personel yetkilerini yönetebilirsiniz.
                        </p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h4 class="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-bullhorn text-red-700"></i>
                        <span>Personel Duyurusu Yayınla / Yönet</span>
                    </h4>
                    <form onsubmit="handleAddNewAnnouncement(event)" class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Duyuru Başlığı</label>
                            <input type="text" id="announcementTitle" placeholder="Örn: 2026 Yılı Mütevelli Heyet Toplantı Tarihi Hk." required class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Duyuru İçeriği / Metni</label>
                            <textarea id="announcementBody" rows="3" placeholder="Personelin okuyacağı duyuru detay metni..." required class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none"></textarea>
                        </div>
                        <button type="submit" class="bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl px-5 py-2.5 shadow transition">
                            <i class="fa-solid fa-paper-plane mr-1"></i> Tüm Personele Duyuru Yayınla
                        </button>
                    </form>

                    <div class="mt-4 pt-4 border-t border-slate-200">
                        <h5 class="font-bold text-xs text-slate-700 mb-2">Yayınlanmış Aktif Duyurular (İstediğiniz zaman silebilirsiniz)</h5>
                        <div class="overflow-x-auto border rounded-xl max-h-48 custom-scrollbar">
                            <table class="w-full text-left text-xs text-slate-600">
                                <thead class="bg-slate-100 text-slate-700 font-bold sticky top-0">
                                    <tr>
                                        <th class="p-3">Tarih</th>
                                        <th class="p-3">Başlık</th>
                                        <th class="p-3">İçerik</th>
                                        <th class="p-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody id="adminAnnouncementsTable" class="divide-y divide-slate-200"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-clock-rotate-left text-red-700"></i>
                            <span>Sistem Detaylı İşlem ve Log Takibi</span>
                        </h4>
                        <button onclick="clearActivityLogs()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <i class="fa-solid fa-trash mr-1"></i> Logları Temizle
                        </button>
                    </div>
                    <div class="overflow-x-auto border rounded-xl max-h-60 custom-scrollbar">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 font-bold sticky top-0">
                                <tr>
                                    <th class="p-3">Tarih / Saat</th>
                                    <th class="p-3">Kullanıcı (ID)</th>
                                    <th class="p-3">İşlem Türü</th>
                                    <th class="p-3">Detay</th>
                                </tr>
                            </thead>
                            <tbody id="activityLogsTable" class="divide-y divide-slate-200"></tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h4 class="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-user-plus text-green-600"></i>
                        <span>Yeni Personel Tanımlama</span>
                    </h4>
                    <form onsubmit="handleAddNewStaff(event)" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" id="newStaffName" placeholder="Personel Adı Soyadı" required class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                        <input type="text" id="newStaffRole" placeholder="Görevi / Unvanı" required class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl px-4 py-2.5 shadow transition">
                            + Personeli Sisteme Kaydet
                        </button>
                    </form>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h4 class="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-user-gear text-red-700"></i>
                        <span>Personel Listesi, Kimlik ID'leri, Şifre Sıfırlama ve Yetki Matrisi</span>
                    </h4>
                    <div id="permissionsMatrix" class="space-y-4"></div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 class="font-bold text-sm text-red-800 flex items-center space-x-2">
                            <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                            <span>Personel Tarafından Reddedilen Dosyalar</span>
                        </h4>
                    </div>
                    <div class="overflow-x-auto border border-slate-200 rounded-xl">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-red-50 text-red-900 font-bold border-b border-slate-200">
                                <tr>
                                    <th class="p-3">Tarih / Saat</th>
                                    <th class="p-3">Reddeden Personel</th>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Konu</th>
                                    <th class="p-3">Gerekçe</th>
                                    <th class="p-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="rejectionLogsTable" class="divide-y divide-slate-200"></tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 class="font-bold text-sm text-slate-800 flex items-center space-x-2">
                            <i class="fa-solid fa-database text-red-700"></i>
                            <span>Sistemdeki Tüm Dosya ve Görevlerin Süper Admin Yönetimi</span>
                        </h4>
                    </div>
                    <div class="overflow-x-auto border rounded-xl max-h-60 custom-scrollbar">
                        <table class="w-full text-left text-xs text-slate-600">
                            <thead class="bg-slate-100 text-slate-700 font-bold sticky top-0">
                                <tr>
                                    <th class="p-3">Ref No</th>
                                    <th class="p-3">Kategori</th>
                                    <th class="p-3">Ekleyen</th>
                                    <th class="p-3">Sorumlu</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="adminAllFilesTable" class="divide-y divide-slate-200"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
            T.C. Kırşehir Valiliği Sosyal Yardımlaşma ve Dayanışma Vakfı - Dosya Takip Portalı &copy; 2026 (3 Yıllık Yasal Arşiv Korumalı)
        </footer>
    </div>

    <div id="passwordModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div class="bg-red-700 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-key"></i><span>Kullanıcı Şifre Değiştirme</span>
                </h3>
                <button onclick="closeModal('passwordModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onsubmit="handlePasswordChange(event)" class="p-5 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Mevcut Şifre</label>
                    <input type="password" id="currentPassInput" required class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Yeni Şifre</label>
                    <input type="password" id="newPassInput" required class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                    <input type="password" id="newPassConfirmInput" required class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button type="button" onclick="closeModal('passwordModal')" class="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">İptal</button>
                    <button type="submit" class="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow">Şifreyi Güncelle</button>
                </div>
            </form>
        </div>
    </div>

    <div id="newFileModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div class="bg-red-700 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-file-circle-plus"></i><span id="newFileModalTitle">Yeni Dosya Oluştur</span>
                </h3>
                <button onclick="closeModal('newFileModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onsubmit="handleNewFileSubmit(event)" class="p-5 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Dosya Kategorisi / Modül</label>
                    <select id="formCategory" onchange="onCategoryChange(this.value)" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                        <option value="inceleme">İnceleme Dosyası</option>
                        <option value="sikayet">Vatandaş Şikayeti</option>
                        <option value="hastane">Hastane Sevk Dilekçesi</option>
                        <option value="toplanti">Toplantı Dosyası</option>
                    </select>
                </div>

                <div id="incelemeReasonContainer">
                    <label class="block text-xs font-bold text-slate-700 mb-1">İnceleme Gerekçesi (Neden Verildi?)</label>
                    <select id="formIncelemeReason" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none">
                        <option value="Hane ziyareti güncel değil">Hane ziyareti güncel değil</option>
                        <option value="Müdür inceleme talep etmekte">Müdür inceleme talep etmekte</option>
                        <option value="CİMER başvurusu">CİMER başvurusu</option>
                        <option value="Yeni dosya inceleme">Yeni dosya inceleme</option>
                    </select>
                </div>

                <div>
                    <div id="historyMatchAlert" class="hidden p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800 font-semibold mb-2">
                        <i class="fa-solid fa-triangle-exclamation"></i> <span id="historyMatchText"></span>
                    </div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Referans Numarası (Örn: bagbasi50 yazın, otomatik BAĞBAŞI-50 olsun)</label>
                    <input type="text" id="formRefNo" onblur="autoFormatRef(this)" onkeyup="checkHistoryMatch(this.value)" required placeholder="Örn: bagbasi50" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase font-bold text-red-700 focus:ring-2 focus:ring-red-600 outline-none">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Konu / Açıklama / Detay</label>
                    <textarea id="formDescription" rows="3" required placeholder="Dosya konusunu veya talebi yazınız..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Atanacak Personel (Zimmet)</label>
                    <select id="formAssignee" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none" required></select>
                </div>

                <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button type="button" onclick="closeModal('newFileModal')" class="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">İptal</button>
                    <button type="submit" class="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow">Kaydet ve Personele Gönder</button>
                </div>
            </form>
        </div>
    </div>

    <div id="mudurModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div class="bg-red-700 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-user-tie"></i><span>Müdür Bey Yazılı Talimatı Gir</span>
                </h3>
                <button onclick="closeModal('mudurModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onsubmit="handleMudurSubmit(event)" class="p-5 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Referans Numarası / Evrak No</label>
                    <input type="text" id="mudurRefNo" onblur="autoFormatRef(this)" required placeholder="Örn: MUDUR-01" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase font-bold text-red-700 focus:ring-2 focus:ring-red-600 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Talimat Detayı / Yazılı Emir</label>
                    <textarea id="mudurDescription" rows="3" required placeholder="Müdür Bey talimat metnini buraya yazınız..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none"></textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Görevlendirilecek Personel</label>
                    <select id="mudurAssignee" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 outline-none" required></select>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button type="button" onclick="closeModal('mudurModal')" class="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">İptal</button>
                    <button type="submit" class="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow">Talimatı Yayınla</button>
                </div>
            </form>
        </div>
    </div>

    <div id="transferModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div class="bg-amber-600 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-share-nodes"></i><span>Dosyayı Başka Personele Havale Et</span>
                </h3>
                <button onclick="closeModal('transferModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onsubmit="handleTransferSubmit(event)" class="p-5 space-y-4">
                <input type="hidden" id="transferFileId">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div class="font-bold text-slate-800">Referans No: <span id="transferRefNo" class="text-red-700"></span></div>
                    <div class="text-slate-600">Konu: <span id="transferSubject"></span></div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Havale Edilecek Personel</label>
                    <select id="transferTargetStaff" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-600 outline-none" required></select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Havale / Devir Gerekçesi (Zorunlu)</label>
                    <textarea id="transferReason" rows="3" required placeholder="Havale gerekçesini yazınız..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-600 outline-none"></textarea>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button type="button" onclick="closeModal('transferModal')" class="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">İptal</button>
                    <button type="submit" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow">Havale Et</button>
                </div>
            </form>
        </div>
    </div>

    <div id="completeModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div class="bg-emerald-600 text-white px-5 py-4 flex items-center justify-between">
                <h3 class="font-bold text-sm flex items-center space-x-2">
                    <i class="fa-solid fa-circle-check"></i><span id="completeModalTitle">Dosya İşlemini Tamamla & Onayla</span>
                </h3>
                <button onclick="closeModal('completeModal')" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onsubmit="handleCompleteSubmit(event)" class="p-5 space-y-4">
                <input type="hidden" id="completeFileId">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1" id="completeNoteLabel">İnceleme / Sonuç Notu</label>
                    <textarea id="completeNote" rows="3" required placeholder="İnceleme sonucunu / açıklamanızı yazınız..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"></textarea>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button type="button" onclick="closeModal('completeModal')" class="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">İptal</button>
                    <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow">Tamamlandı Olarak Kaydet</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let USERS = JSON.parse(localStorage.getItem('sydv_users')) || [
            { id: 1, name: "Süper Admin", role: "Süper Admin", isSuperAdmin: true, pass: "123456" },
            { id: 2, name: "Ayşe Kaya", role: "Sosyal Yardım Personeli", isSuperAdmin: false, pass: "123456" },
            { id: 3, name: "Mehmet Demir", role: "İnceleme Görevlisi", isSuperAdmin: false, pass: "123456" },
            { id: 4, name: "Fatma Şahin", role: "Vakıf Görevlisi", isSuperAdmin: false, pass: "123456" }
        ];

        let PERMISSIONS = JSON.parse(localStorage.getItem('sydv_perms')) || {
            2: { add_inceleme: true, add_sikayet: true, add_hastane: true, add_toplanti: false, can_transfer: true },
            3: { add_inceleme: true, add_sikayet: false, add_hastane: false, add_toplanti: false, can_transfer: true },
            4: { add_inceleme: false, add_sikayet: true, add_hastane: false, add_toplanti: true, can_transfer: false }
        };

        const initialFiles = [
            { id: "2026-101", category: "inceleme", incelemeReason: "Hane ziyareti güncel değil", description: "Hane incelemesi talebi değerlendirmesi.", assignedTo: 2, createdBy: 1, createdAt: "05.06.2026 10:15", deliveredConfirmed: false, status: "İncelemede" },
            { id: "2026-103", category: "sikayet", description: "Zeynep Arslan nakit yardım şikayet başvurusu.", assignedTo: 2, createdBy: 2, createdAt: "05.06.2026 14:00", deliveredConfirmed: true, status: "Tamamlandı" }
        ];

        let initialMudurFiles = [
            { id: "MUDUR-01", description: "Engelli vatandaş için medikal cihaz temini talimatı.", assignedTo: 3, createdBy: 1, createdAt: "05.06.2026 11:30", deliveredConfirmed: false, status: "İşlemde" }
        ];

        let initialAnnouncements = [
            { id: Date.now(), title: "Kırşehir SYDV Yeni Çalışma Dönemi", body: "Tüm personelimizin dikkatine; yeni evrak ve dosya havale sisteminde referans numarası formatına uyulması zorunludur.", date: "05.06.2026 09:00" }
        ];

        let currentUser = null;
        let files = JSON.parse(localStorage.getItem('sydv_files')) || initialFiles;
        let mudurFiles = JSON.parse(localStorage.getItem('sydv_mudur_files')) || initialMudurFiles;
        let announcements = JSON.parse(localStorage.getItem('sydv_announcements')) || initialAnnouncements;
        let rejectionLogs = JSON.parse(localStorage.getItem('sydv_rejection_logs')) || [];
        let activityLogs = JSON.parse(localStorage.getItem('sydv_activity_logs')) || [];
        let activeTab = 'tab-inceleme';

        window.onload = function() {
            USERS.forEach(u => {
                if (u.isSuperAdmin) u.name = "Süper Admin";
            });
            initUserDropdown();
            saveState();
            showLatestAnnouncementPopup();
        };

        function saveState() {
            localStorage.setItem('sydv_users', JSON.stringify(USERS));
            localStorage.setItem('sydv_perms', JSON.stringify(PERMISSIONS));
            localStorage.setItem('sydv_files', JSON.stringify(files));
            localStorage.setItem('sydv_mudur_files', JSON.stringify(mudurFiles));
            localStorage.setItem('sydv_announcements', JSON.stringify(announcements));
            localStorage.setItem('sydv_rejection_logs', JSON.stringify(rejectionLogs));
            localStorage.setItem('sydv_activity_logs', JSON.stringify(activityLogs));
        }

        function autoFormatRef(input) {
            let val = input.value.trim();
            if (!val) return;

            val = val.replace(/i/g, 'İ')
                     .replace(/ı/g, 'I')
                     .replace(/ş/g, 'Ş')
                     .replace(/ğ/g, 'Ğ')
                     .replace(/ü/g, 'Ü')
                     .replace(/ö/g, 'Ö')
                     .replace(/ç/g, 'Ç')
                     .toUpperCase();

            if (!val.includes('-')) {
                val = val.replace(/([A-ZÇĞİÖŞÜ]+)([0-9]+)/g, '$1-$2');
                val = val.replace(/([A-ZÇĞİÖŞÜ]+)\s+([0-9]+)/g, '$1-$2');
            }

            input.value = val;
            checkHistoryMatch(input.value);
        }

        function logActivity(actionType, detail) {
            if (!currentUser) return;
            const now = new Date().toLocaleString('tr-TR');
            activityLogs.unshift({
                time: now,
                userId: currentUser.id,
                userName: currentUser.name,
                role: currentUser.role,
                type: actionType,
                detail: detail
            });
            saveState();
            if (currentUser.isSuperAdmin) {
                renderActivityLogs();
            }
        }

        function initUserDropdown() {
            const select = document.getElementById('userSelect');
            select.innerHTML = '<option value="">Lütfen Kullanıcı Seçiniz...</option>';
            USERS.forEach(u => {
                select.innerHTML += `<option value="${u.id}">[ID: ${u.id}] ${u.name} (${u.role})</option>`;
            });
        }

        function handleLogin(e) {
            e.preventDefault();
            const userId = parseInt(document.getElementById('userSelect').value);
            const pass = document.getElementById('loginPassword').value;
            const user = USERS.find(u => u.id === userId);

            if (!user) return;
            if (pass !== user.pass) {
                alert("Hatalı şifre!");
                return;
            }

            currentUser = user;

            if (currentUser.pass === "123456") {
                document.getElementById('forcePasswordModal').classList.remove('hidden');
                return;
            }

            proceedLoginSession();
        }

        function handleForcePasswordSubmit(e) {
            e.preventDefault();
            const p1 = document.getElementById('forceNewPass').value;
            const p2 = document.getElementById('forceNewPassConfirm').value;

            if (p1 !== p2) {
                alert("Şifreler birbiriyle uyuşmuyor!");
                return;
            }
            if (p1.length < 4) {
                alert("Şifre en az 4 karakter olmalıdır!");
                return;
            }
            if (p1 === "123456") {
                alert("Varsayılan şifreden (123456) farklı yeni bir şifre belirlemelisiniz!");
                return;
            }

            currentUser.pass = p1;
            const targetUser = USERS.find(u => u.id === currentUser.id);
            if (targetUser) targetUser.pass = p1;

            saveState();
            document.getElementById('forcePasswordModal').classList.add('hidden');
            logActivity("Şifre Güncelleme", "İlk giriş zorunlu şifre değiştirildi.");
            showToast("Şifreniz başarıyla güncellendi.", "success");
            proceedLoginSession();
        }

        function proceedLoginSession() {
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');

            document.getElementById('currentUserName').innerText = `[ID: ${currentUser.id}]${currentUser.name}`;
            document.getElementById('currentUserRole').innerText = currentUser.role;

            const adminTabBtn = document.getElementById('nav-tab-admin');
            if (currentUser.isSuperAdmin) adminTabBtn.classList.remove('hidden');
            else adminTabBtn.classList.add('hidden');

            updateAddButtonVisibility();

            if (!currentUser.isSuperAdmin) {
                const unconfirmedFiles = files.filter(f => f.assignedTo === currentUser.id && !f.deliveredConfirmed && f.status !== 'Tamamlandı');
                const unconfirmedMudur = mudurFiles.filter(m => m.assignedTo === currentUser.id && !m.deliveredConfirmed && m.status !== 'Tamamlandı');
                const allUnconfirmed = [...unconfirmedFiles, ...unconfirmedMudur];
                if (allUnconfirmed.length > 0) showDeliveryModal(allUnconfirmed);
            }

            logActivity("Sisteme Giriş", "Portala başarıyla giriş yapıldı.");
            checkAdminRedNotifications();
            checkStaffActiveTasks();
            renderAllTables();
            renderPermissionsMatrix();
            renderRejectionLogs();
            renderAdminAnnouncements();
            renderAdminAllFiles();
            renderActivityLogs();
            switchTab(activeTab);
            showToast(`Hoş geldiniz, ${currentUser.name}`, 'info');
        }

        function showLatestAnnouncementPopup() {
            if (announcements.length === 0) return;
            const latest = announcements[0];
            const content = document.getElementById('announcementPopupContent');
            content.innerHTML = `
                <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-red-700 text-sm">${latest.title}</span>
                        <span class="text-[10px] text-slate-400">${latest.date}</span>
                    </div>
                    <p class="text-slate-800 leading-relaxed text-xs whitespace-pre-line">${latest.body}</p>
                </div>
            `;
            document.getElementById('announcementPopupModal').classList.remove('hidden');
        }

        function openAnnouncementsListModal() {
            const container = document.getElementById('announcementsListContent');
            container.innerHTML = '';

            if (announcements.length === 0) {
                container.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Sistemde kayıtlı duyuru bulunmamaktadır.</p>`;
            } else {
                announcements.forEach(a => {
                    container.innerHTML += `
                        <div class="p-4 bg-slate-50 border rounded-xl space-y-2 shadow-sm">
                            <div class="flex items-center justify-between border-b pb-1.5">
                                <span class="font-bold text-red-700 text-xs">${a.title}</span>
                                <span class="text-[10px] text-slate-400">${a.date}</span>
                            </div>
                            <p class="text-slate-700 text-xs whitespace-pre-line">${a.body}</p>
                        </div>
                    `;
                });
            }
            document.getElementById('announcementsListModal').classList.remove('hidden');
        }

        function logout() {
            if (currentUser) {
                logActivity("Oturum Kapatma", "Sistemden çıkış yapıldı.");
            }
            currentUser = null;
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('deliveryModal').classList.add('hidden');
            document.getElementById('forcePasswordModal').classList.add('hidden');
            document.getElementById('announcementPopupModal').classList.add('hidden');
            document.getElementById('announcementsListModal').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
        }

        function checkStaffActiveTasks() {
            if (!currentUser || currentUser.isSuperAdmin) return;
            const activeTasks = files.filter(f => f.assignedTo === currentUser.id && f.status !== 'Tamamlandı').length;
            const activeMudur = mudurFiles.filter(m => m.assignedTo === currentUser.id && m.status !== 'Tamamlandı').length;
            const totalActive = activeTasks + activeMudur;

            const alertBox = document.getElementById('staffActiveTaskAlert');
            const alertText = document.getElementById('staffActiveTaskText');

            if (totalActive > 0) {
                alertText.innerHTML = `Dikkat! Üzerinizde sonuçlandırılmamış <strong>${totalActive} adet aktif görev/talimat</strong> bulunmaktadır.`;
                alertBox.classList.remove('hidden');
            } else {
                alertBox.classList.add('hidden');
            }
        }

        function openPasswordModal() {
            document.getElementById('currentPassInput').value = '';
            document.getElementById('newPassInput').value = '';
            document.getElementById('newPassConfirmInput').value = '';
            document.getElementById('passwordModal').classList.remove('hidden');
        }

        function handlePasswordChange(e) {
            e.preventDefault();
            const curr = document.getElementById('currentPassInput').value;
            const nuevo = document.getElementById('newPassInput').value;
            const conf = document.getElementById('newPassConfirmInput').value;

            if (curr !== currentUser.pass) {
                alert("Mevcut şifreniz hatalı!");
                return;
            }
            if (nuevo !== conf) {
                alert("Yeni şifreler birbiriyle uyuşmuyor!");
                return;
            }
            if (nuevo.length < 4) {
                alert("Şifre en az 4 karakter olmalıdır!");
                return;
            }

            currentUser.pass = nuevo;
            const targetUser = USERS.find(u => u.id === currentUser.id);
            if (targetUser) targetUser.pass = nuevo;

            saveState();
            logActivity("Şifre Değiştirme", "Kullanıcı şifresini güncelledi.");
            closeModal('passwordModal');
            showToast("Şifreniz başarıyla güncellendi.", "success");
        }

        function showDeliveryModal(unconfirmedList) {
            document.getElementById('deliveryStaffName').innerText = currentUser.name;
            const tbody = document.getElementById('unconfirmedFilesTable');
            tbody.innerHTML = '';

            unconfirmedList.forEach(item => {
                const creator = USERS.find(u => u.id === item.createdBy)?.name || "Müdürlük / Süper Admin";
                const isMudur = item.isMudur || item.id.includes('MUDUR');
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 font-bold text-red-700">${item.id}</td>
                        <td class="p-3 font-semibold text-slate-800">${item.description}</td>
                        <td class="p-3 text-slate-600">${isMudur ? 'MÜDÜR TALİMATI' : item.category.toUpperCase()}</td>
                        <td class="p-3 text-slate-600 font-medium">${creator}</td>
                    </tr>
                `;
            });

            document.getElementById('rejectionSection').classList.add('hidden');
            document.getElementById('confirmRejectBtn').classList.add('hidden');
            document.getElementById('acceptFilesBtn').classList.remove('hidden');
            document.getElementById('deliveryModal').classList.remove('hidden');
        }

        function acceptAssignedFiles() {
            files.forEach(f => {
                if (f.assignedTo === currentUser.id && !f.deliveredConfirmed) {
                    f.deliveredConfirmed = true;
                }
            });
            mudurFiles.forEach(m => {
                if (m.assignedTo === currentUser.id && !m.deliveredConfirmed) {
                    m.deliveredConfirmed = true;
                }
            });
            saveState();
            renderAllTables();
            document.getElementById('deliveryModal').classList.add('hidden');
            showToast("Tarafınıza atanan tüm görevler teslim alındı onaylandı.", "success");
        }

        function toggleRejectionView() {
            const sec = document.getElementById('rejectionSection');
            const confirmBtn = document.getElementById('confirmRejectBtn');
            const acceptBtn = document.getElementById('acceptFilesBtn');

            if (sec.classList.contains('hidden')) {
                sec.classList.remove('hidden');
                confirmBtn.classList.remove('hidden');
                acceptBtn.classList.add('hidden');
            } else {
                sec.classList.add('hidden');
                confirmBtn.classList.add('hidden');
                acceptBtn.classList.remove('hidden');
            }
        }

        function submitRejection() {
            const reason = document.getElementById('rejectionReason').value.trim();
            if (!reason) {
                alert("Lütfen bir gerekçe yazınız!");
                return;
            }

            const unconfirmedFiles = files.filter(f => f.assignedTo === currentUser.id && !f.deliveredConfirmed);
            const unconfirmedMudur = mudurFiles.filter(m => m.assignedTo === currentUser.id && !m.deliveredConfirmed);

            [...unconfirmedFiles, ...unconfirmedMudur].forEach(item => {
                rejectionLogs.unshift({
                    date: new Date().toLocaleString('tr-TR'),
                    staffName: currentUser.name,
                    fileId: item.id,
                    subject: item.description,
                    reason: reason
                });
                logActivity("Görev/Dosya Reddi", `Ref: ${item.id} nolu dosya/talimat reddedildi. Gerekçe: ${reason}`);
            });

            saveState();
            alert("Red gerekçeniz Süper Admin'e bildirilmiştir.");
            document.getElementById('deliveryModal').classList.add('hidden');
            logout();
        }

        function checkAdminRedNotifications() {
            if (currentUser && currentUser.isSuperAdmin && rejectionLogs.length > 0) {
                const latest = rejectionLogs[0];
                document.getElementById('adminRedBannerText').innerHTML = `
                    <strong>${latest.staffName}</strong>, <span class="underline">${latest.fileId}</span> referanslı görevi/dosyayı teslim almayı reddetti. <br>
                    <strong>Gerekçe:</strong> "${latest.reason}" (${latest.date})
                `;
                document.getElementById('adminRedBanner').classList.remove('hidden');
            } else {
                document.getElementById('adminRedBanner').classList.add('hidden');
            }
        }

        function dismissRedBanner() {
            document.getElementById('adminRedBanner').classList.add('hidden');
        }

        function switchTab(tabId) {
            activeTab = tabId;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(tabId).classList.remove('hidden');
            updateAddButtonVisibility();
        }

        function updateAddButtonVisibility() {
            const addBtn = document.getElementById('addFileBtn');
            const addMudurBtn = document.getElementById('addMudurBtn');
            if (!currentUser) return;

            if (currentUser.isSuperAdmin) {
                if (addBtn) addBtn.style.display = 'flex';
                if (addMudurBtn) addMudurBtn.style.display = 'flex';
                return;
            }

            const userPerms = PERMISSIONS[currentUser.id] || {};
            let canAdd = false;
            if (activeTab === 'tab-inceleme' && userPerms.add_inceleme) canAdd = true;
            if (activeTab === 'tab-sikayet' && userPerms.add_sikayet) canAdd = true;
            if (activeTab === 'tab-hastane' && userPerms.add_hastane) canAdd = true;
            if (activeTab === 'tab-toplanti' && userPerms.add_toplanti) canAdd = true;

            if (addBtn) addBtn.style.display = canAdd ? 'flex' : 'none';
            if (addMudurBtn) addMudurBtn.style.display = (currentUser.id === 1 || currentUser.role.includes('Müdür') || currentUser.isSuperAdmin) ? 'flex' : 'none';
        }

        function renderAllTables() {
            renderTable('inceleme', 'table-inceleme');
            renderMudurTable();
            renderTable('sikayet', 'table-sikayet');
            renderTable('hastane', 'table-hastane');
            renderTable('toplanti', 'table-toplanti');
            renderKimdeMatrixModalCards();
            checkStaffActiveTasks();
            if (currentUser && currentUser.isSuperAdmin) {
                renderAdminAnnouncements();
                renderAdminAllFiles();
                renderActivityLogs();
            }
        }

        function handleAddNewAnnouncement(e) {
            e.preventDefault();
            if (!currentUser || !currentUser.isSuperAdmin) return;

            const title = document.getElementById('announcementTitle').value.trim();
            const body = document.getElementById('announcementBody').value.trim();
            const nowStr = new Date().toLocaleString('tr-TR');

            announcements.unshift({
                id: Date.now(),
                title: title,
                body: body,
                date: nowStr
            });

            saveState();
            document.getElementById('announcementTitle').value = '';
            document.getElementById('announcementBody').value = '';
            renderAdminAnnouncements();
            logActivity("Duyuru Yayınlama", `Yeni duyuru yayınlandı: ${title}`);
            showToast("Duyuru başarıyla yayınlandı.", "success");
        }

        function renderAdminAnnouncements() {
            const tbody = document.getElementById('adminAnnouncementsTable');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (announcements.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400">Yayınlanmış duyuru yok.</td></tr>`;
                return;
            }

            announcements.forEach((a) => {
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 text-slate-500 font-semibold">${a.date}</td>
                        <td class="p-3 font-bold text-red-700">${a.title}</td>
                        <td class="p-3 text-slate-700">${a.body}</td>
                        <td class="p-3 text-right">
                            <button onclick="deleteAnnouncement(${a.id})" class="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded shadow"><i class="fa-solid fa-trash"></i> Sil</button>
                        </td>
                    </tr>
                `;
            });
        }

        function deleteAnnouncement(id) {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
                announcements = announcements.filter(a => a.id !== id);
                saveState();
                renderAdminAnnouncements();
                logActivity("Duyuru Silme", `Duyuru silindi ID: ${id}`);
                showToast("Duyuru silindi.", "warning");
            }
        }

        function renderTable(category, tableElementId) {
            const tbody = document.getElementById(tableElementId);
            if (!tbody) return;
            tbody.innerHTML = '';

            const filteredFiles = files.filter(f => f.category === category && f.status !== 'Tamamlandı');

            if (category === 'inceleme') {
                document.getElementById('incelemeCount').innerText = `${filteredFiles.length} Aktif Dosya`;
            }

            if (filteredFiles.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Dosya bulunmamaktadır.</td></tr>`;
                return;
            }

            filteredFiles.forEach(f => {
                const creatorStaff = USERS.find(u => u.id === f.createdBy)?.name || "Sistem / Admin";
                const assignedStaff = USERS.find(u => u.id === f.assignedTo)?.name || "Atanmadı";

                let displayDesc = f.description;
                if (category === 'inceleme' && f.incelemeReason) {
                    displayDesc = `<strong class="text-red-700">[${f.incelemeReason}]</strong>${f.description}`;
                }

                let statusBadge = `<span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">İşlemde</span>`;

                const canTransfer = (currentUser.isSuperAdmin || (PERMISSIONS[currentUser.id]?.can_transfer && f.assignedTo === currentUser.id));
                const canComplete = (currentUser.isSuperAdmin || (f.assignedTo === currentUser.id));

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 font-bold text-red-700">${f.id}</td>
                        <td class="p-3 text-slate-600 font-medium">${displayDesc}</td>
                        <td class="p-3 text-slate-600"><i class="fa-solid fa-user-pen text-slate-400 mr-1"></i>${creatorStaff}</td>
                        <td class="p-3 font-medium text-slate-700">${assignedStaff}</td>
                        <td class="p-3">${statusBadge}</td>
                        <td class="p-3 text-right space-x-1">
                            <button onclick="openFileDetailModal('${f.id}')" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg" title="Detay"><i class="fa-solid fa-eye"></i></button>
                            ${canTransfer ? `<button onclick="openTransferModal('${f.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded-lg">Havale</button>` : ''}
                            ${canComplete ? `<button onclick="openCompleteModal('${f.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg">Onayla</button>` : ''}
                            ${currentUser.isSuperAdmin ? `<button onclick="deleteFile('${f.id}')" class="px-2 py-1 bg-red-100 text-red-700 text-[11px] font-semibold rounded-lg"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            });
        }

        function renderMudurTable() {
            const tbody = document.getElementById('table-mudur');
            if (!tbody) return;
            tbody.innerHTML = '';

            const activeMudur = mudurFiles.filter(m => m.status !== 'Tamamlandı');

            if (activeMudur.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Aktif müdür talimatı bulunmamaktadır.</td></tr>`;
                return;
            }

            activeMudur.forEach(m => {
                const creator = USERS.find(u => u.id === m.createdBy)?.name || "Müdürlük";
                const assigned = USERS.find(u => u.id === m.assignedTo)?.name || "Atanmadı";
                const canComplete = (currentUser.isSuperAdmin || m.assignedTo === currentUser.id);

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 font-bold text-red-700">${m.id}</td>
                        <td class="p-3 text-slate-800 font-medium">${m.description}</td>
                        <td class="p-3 text-slate-600"><i class="fa-solid fa-user-tie text-red-700 mr-1"></i>${creator}</td>
                        <td class="p-3 font-medium text-slate-700">${assigned}</td>
                        <td class="p-3"><span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Talimat Bekliyor</span></td>
                        <td class="p-3 text-right space-x-1">
                            ${canComplete ? `<button onclick="openMudurCompleteModal('${m.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow">Okudum & Açıklama Gir</button>` : ''}
                            ${currentUser.isSuperAdmin ? `<button onclick="deleteMudurFile('${m.id}')" class="px-2 py-1 bg-red-100 text-red-700 text-[11px] font-semibold rounded-lg"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            });
        }

        function openFileDetailModal(fileId) {
            const f = files.find(x => x.id === fileId);
            if (!f) return;

            const creator = USERS.find(u => u.id === f.createdBy);
            const assignee = USERS.find(u => u.id === f.assignedTo);

            const content = document.getElementById('fileDetailModalContent');
            content.innerHTML = `
                <div class="space-y-2 bg-slate-50 p-4 rounded-xl border">
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Referans Numarası:</strong> <span class="font-bold text-red-700">${f.id}</span></div>
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Dosya Kategorisi:</strong> <span class="uppercase font-bold">${f.category}</span></div>${f.incelemeReason ? `<div class="flex justify-between border-b pb-2"><strong class="text-slate-500">İnceleme Gerekçesi:</strong> <span class="font-bold text-red-700">${f.incelemeReason}</span></div>` : ''}
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Ekleyen Personel:</strong> <span class="font-bold text-slate-800">${creator ? creator.name + ' (ID: ' + creator.id + ')' : 'Sistem'}</span></div>
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Eklenme Tarihi / Saati:</strong> <span class="semibold">${f.createdAt}</span></div>
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Atanan Sorumlu Personel:</strong> <span class="font-bold text-slate-800">${assignee ? assignee.name + ' (ID: ' + assignee.id + ')' : 'Atanmadı'}</span></div>
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Teslim Onay Durumu:</strong> <span>${f.deliveredConfirmed ? '✔️ Teslim Alındı' : '⏳ Onay Bekliyor'}</span></div>
                    <div class="flex justify-between border-b pb-2"><strong class="text-slate-500">Son Durum:</strong> <span class="font-bold">${f.status}</span></div>
                    <div><strong class="text-slate-500 block mb-1">Konu / Açıklama / Detay:</strong> <p class="bg-white p-2.5 rounded border text-slate-800">${f.description}</p></div>
                </div>
            `;
            document.getElementById('fileDetailModal').classList.remove('hidden');
        }

        function renderKimdeMatrixModalCards() {
            const container = document.getElementById('kimdeMatrix');
            if (!container) return;
            container.innerHTML = '';

            USERS.filter(u => !u.isSuperAdmin).forEach(staff => {
                const staffFiles = files.filter(f => f.assignedTo === staff.id);
                
                container.innerHTML += `
                    <div class="bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <div class="flex items-center justify-between mb-3 border-b pb-2">
                                <h4 class="font-bold text-xs text-slate-800">${staff.name} <span class="text-[10px] text-slate-400 font-normal">(ID: ${staff.id})</span></h4>
                                <span class="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">${staffFiles.length} Dosya Arşivi</span>
                            </div>
                            <p class="text-[11px] text-slate-500 mb-3">Personelin üzerine kayıtlı tüm 3 yıllık dosya geçmişi.</p>
                        </div>
                        <button onclick="openStaffArchiveModal(${staff.id}, '${staff.name}')" class="w-full py-2 bg-slate-100 hover:bg-red-700 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2">
                            <i class="fa-solid fa-folder-open"></i>
                            <span>Arşiv Dosyalarını Görüntüle</span>
                        </button>
                    </div>
                `;
            });
        }

        function openStaffArchiveModal(staffId, staffName) {
            document.getElementById('archiveModalTitle').innerHTML = `<i class="fa-solid fa-folder-open"></i><span>${staffName} - 3 Yıllık Dosya Arşivi</span>`;
            const contentContainer = document.getElementById('staffArchiveContent');
            contentContainer.innerHTML = '';

            const staffFiles = files.filter(f => f.assignedTo === staffId);

            if (staffFiles.length === 0) {
                contentContainer.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Bu personele ait kayıtlı dosya bulunmamaktadır.</p>`;
            } else {
                staffFiles.forEach(sf => {
                    let statusText = sf.status === 'Tamamlandı' 
                        ? '<span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Tamamlandı</span>' 
                        : '<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Aktif / İşlemde</span>';
                    
                    contentContainer.innerHTML += `
                        <div class="p-3.5 bg-slate-50 border rounded-xl text-xs flex items-center justify-between gap-3 shadow-sm">
                            <div>
                                <div class="flex items-center space-x-2">
                                    <span class="font-bold text-red-700">Ref: ${sf.id}</span>
                                    <span class="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 border rounded">${sf.category}</span>
                                </div>
                                <div class="text-slate-700 font-medium mt-1">${sf.description}</div>
                            </div>
                            <div class="text-right flex flex-col items-end gap-1.5 shrink-0">
                                ${statusText}
                                <span class="text-[10px] text-slate-400">Ekleyen ID: ${sf.createdBy}</span>
                            </div>
                        </div>
                    `;
                });
            }

            document.getElementById('staffArchiveModal').classList.remove('hidden');
        }

        function renderAdminAllFiles() {
            const tbody = document.getElementById('adminAllFilesTable');
            if (!tbody) return;
            tbody.innerHTML = '';

            const allCombined = [...files, ...mudurFiles];
            if (allCombined.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Sistemde hiç dosya yok.</td></tr>`;
                return;
            }

            allCombined.forEach(f => {
                const creator = USERS.find(u => u.id === f.createdBy)?.name || "Sistem";
                const staffName = USERS.find(u => u.id === f.assignedTo)?.name || "Atanmadı";
                let statusBadge = f.status === 'Tamamlandı'
                    ? `<span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Tamamlandı</span>`
                    : `<span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">İşlemde</span>`;

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 font-bold text-red-700">${f.id}</td>
                        <td class="p-3 uppercase text-[10px] font-bold text-slate-500">${f.category || 'MÜDÜR'}</td>
                        <td class="p-3 text-slate-600">${creator}</td>
                        <td class="p-3 font-medium">${staffName}</td>
                        <td class="p-3">${statusBadge}</td>
                        <td class="p-3 text-right space-x-1">
                            <button onclick="deleteFileCompletely('${f.id}')" class="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function deleteFileCompletely(fileId) {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Bu kaydı tamamen silmek istediğinize emin misiniz?")) {
                files = files.filter(f => f.id !== fileId);
                mudurFiles = mudurFiles.filter(m => m.id !== fileId);
                saveState();
                renderAllTables();
                showToast("Kayıt sistemden silindi.", "warning");
            }
        }

        function renderActivityLogs() {
            const tbody = document.getElementById('activityLogsTable');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (activityLogs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400">Henüz kaydedilmiş işlem logu bulunmamaktadır.</td></tr>`;
                return;
            }

            activityLogs.forEach(log => {
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3 font-semibold text-slate-500">${log.time}</td>
                        <td class="p-3 font-bold text-slate-800">${log.userName} <span class="text-[10px] text-blue-600 font-mono">[ID: ${log.userId}]</span></td>
                        <td class="p-3"><span class="bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded">${log.type}</span></td>
                        <td class="p-3 text-slate-700">${log.detail}</td>
                    </tr>
                `;
            });
        }

        function clearActivityLogs() {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Tüm işlem loglarını temizlemek istediğinize emin misiniz?")) {
                activityLogs = [];
                saveState();
                renderActivityLogs();
                showToast("İşlem logları temizlendi.", "warning");
            }
        }

        function renderRejectionLogs() {
            const tbody = document.getElementById('rejectionLogsTable');
            if (!tbody) return;
            tbody.innerHTML = '';
            if (rejectionLogs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Henüz dosya reddi bulunmamaktadır.</td></tr>`;
                return;
            }
            rejectionLogs.forEach((log, index) => {
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-3">${log.date}</td>
                        <td class="p-3 font-bold">${log.staffName}</td>
                        <td class="p-3 text-red-700 font-bold">${log.fileId}</td>
                        <td class="p-3">${log.subject}</td>
                        <td class="p-3 text-red-800 font-semibold bg-red-50">${log.reason}</td>
                        <td class="p-3 text-right space-x-1">
                            <button onclick="adminActionDelete('${log.fileId}',${index})" class="px-2 py-1 bg-red-600 text-white text-[10px] font-semibold rounded shadow">Sil</button>
                        </td>
                    </tr>
                `;
            });
        }

        function adminActionDelete(fileId, logIndex) {
            if (confirm("Bu reddedilen kaydı silmek istediğinize emin misiniz?")) {
                files = files.filter(f => f.id !== fileId);
                mudurFiles = mudurFiles.filter(m => m.id !== fileId);
                rejectionLogs.splice(logIndex, 1);
                saveState();
                renderAllTables();
                renderRejectionLogs();
                checkAdminRedNotifications();
                showToast("Kayıt silindi.", "warning");
            }
        }

        function handleAddNewStaff(e) {
            e.preventDefault();
            if (!currentUser.isSuperAdmin) return;

            const name = document.getElementById('newStaffName').value.trim();
            const role = document.getElementById('newStaffRole').value.trim();

            const newId = Date.now();
            USERS.push({ id: newId, name: name, role: role, isSuperAdmin: false, pass: "123456" });
            PERMISSIONS[newId] = { add_inceleme: true, add_sikayet: true, add_hastane: false, add_toplanti: false, can_transfer: true };

            saveState();
            initUserDropdown();
            renderPermissionsMatrix();
            renderKimdeMatrixModalCards();
            document.getElementById('newStaffName').value = '';
            document.getElementById('newStaffRole').value = '';
            logActivity("Personel Tanımlama", `Yeni personel eklendi: ${name} [ID:${newId}] (Şifre: 123456)`);
            showToast("Yeni personel eklendi (Şifresi: 123456).", "success");
        }

        function resetStaffPassword(staffId) {
            if (!currentUser.isSuperAdmin) return;
            const staff = USERS.find(u => u.id === staffId);
            if (!staff) return;

            if (confirm(`"${staff.name}" adlı personelin şifresini 123456 olarak sıfırlamak istediğinize emin misiniz?`)) {
                staff.pass = "123456";
                saveState();
                renderPermissionsMatrix();
                logActivity("Şifre Sıfırlama", `Personel şifresi sıfırlandı: ${staff.name}`);
                showToast(`${staff.name} adlı personelin şifresi sıfırlandı.`, "warning");
            }
        }

        function deleteStaff(staffId) {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Bu personeli silmek istediğinize emin misiniz?")) {
                USERS = USERS.filter(u => u.id !== staffId);
                delete PERMISSIONS[staffId];
                saveState();
                initUserDropdown();
                renderPermissionsMatrix();
                renderKimdeMatrixModalCards();
                logActivity("Personel Silme", `Personel silindi ID: ${staffId}`);
                showToast("Personel silindi.", "warning");
            }
        }

        function renderPermissionsMatrix() {
            const container = document.getElementById('permissionsMatrix');
            if (!container) return;
            container.innerHTML = '';

            USERS.filter(u => !u.isSuperAdmin).forEach(staff => {
                const p = PERMISSIONS[staff.id] || {};
                container.innerHTML += `
                    <div class="p-4 bg-slate-50 border rounded-2xl flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h5 class="font-bold text-xs">${staff.name} <span class="text-[11px] text-blue-600 font-mono">[ID: ${staff.id}]</span></h5>
                            <p class="text-[10px] text-slate-500">${staff.role}</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 text-xs">
                            <button onclick="resetStaffPassword(${staff.id})" class="bg-amber-600 hover:bg-amber-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold shadow flex items-center space-x-1 mr-2">
                                <i class="fa-solid fa-rotate-right"></i><span>Şifreyi Sıfırla (123456)</span>
                            </button>
                            <label class="bg-white p-1.5 border rounded cursor-pointer"><input type="checkbox" ${p.add_inceleme ? 'checked' : ''} onchange="togglePermission(${staff.id}, 'add_inceleme')"> İnceleme</label>
                            <label class="bg-white p-1.5 border rounded cursor-pointer"><input type="checkbox" ${p.add_sikayet ? 'checked' : ''} onchange="togglePermission(${staff.id}, 'add_sikayet')"> Şikayet</label>
                            <label class="bg-white p-1.5 border rounded cursor-pointer"><input type="checkbox" ${p.add_hastane ? 'checked' : ''} onchange="togglePermission(${staff.id}, 'add_hastane')"> Hastane</label>
                            <label class="bg-white p-1.5 border rounded cursor-pointer"><input type="checkbox" ${p.add_toplanti ? 'checked' : ''} onchange="togglePermission(${staff.id}, 'add_toplanti')"> Toplantı</label>
                            <label class="bg-amber-50 p-1.5 border border-amber-300 rounded cursor-pointer font-bold"><input type="checkbox" ${p.can_transfer ? 'checked' : ''} onchange="togglePermission(${staff.id}, 'can_transfer')"> Havale</label>
                            <button onclick="deleteStaff(${staff.id})" class="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold ml-2">Sil</button>
                        </div>
                    </div>
                `;
            });
        }

        function togglePermission(staffId, key) {
            if (!PERMISSIONS[staffId]) PERMISSIONS[staffId] = {};
            PERMISSIONS[staffId][key] = !PERMISSIONS[staffId][key];
            saveState();
            logActivity("Yetki Güncelleme", `Personel ID: ${staffId} yetkisi değiştirildi.`);
            updateAddButtonVisibility();
            showToast("Yetki güncellendi.", "success");
        }

        function openNewFileModal() {
            const select = document.getElementById('formAssignee');
            select.innerHTML = '';
            USERS.filter(u => !u.isSuperAdmin).forEach(u => {
                select.innerHTML += `<option value="${u.id}">[ID: ${u.id}] ${u.name} (${u.role})</option>`;
            });

            const catSelect = document.getElementById('formCategory');
            if (activeTab === 'tab-sikayet') catSelect.value = 'sikayet';
            else if (activeTab === 'tab-hastane') catSelect.value = 'hastane';
            else if (activeTab === 'tab-toplanti') catSelect.value = 'toplanti';
            else catSelect.value = 'inceleme';

            onCategoryChange(catSelect.value);

            document.getElementById('formRefNo').value = '';
            document.getElementById('formDescription').value = '';
            document.getElementById('historyMatchAlert').classList.add('hidden');
            document.getElementById('newFileModal').classList.remove('hidden');
        }

        function onCategoryChange(cat) {
            const reasonCont = document.getElementById('incelemeReasonContainer');
            if (cat === 'inceleme') {
                reasonCont.classList.remove('hidden');
            } else {
                reasonCont.classList.add('hidden');
            }
        }

        function openMudurModal() {
            const select = document.getElementById('mudurAssignee');
            select.innerHTML = '';
            USERS.filter(u => !u.isSuperAdmin).forEach(u => {
                select.innerHTML += `<option value="${u.id}">[ID: ${u.id}] ${u.name} (${u.role})</option>`;
            });
            document.getElementById('mudurRefNo').value = '';
            document.getElementById('mudurDescription').value = '';
            document.getElementById('mudurModal').classList.remove('hidden');
        }

        function handleMudurSubmit(e) {
            e.preventDefault();
            const refInput = document.getElementById('mudurRefNo');
            autoFormatRef(refInput);
            const refNo = refInput.value.trim();
            const description = document.getElementById('mudurDescription').value.trim();
            const assigneeId = parseInt(document.getElementById('mudurAssignee').value);

            mudurFiles.unshift({
                id: refNo,
                description: description,
                assignedTo: assigneeId,
                createdBy: currentUser.id,
                createdAt: new Date().toLocaleString('tr-TR'),
                deliveredConfirmed: false,
                status: "İşlemde"
            });

            saveState();
            renderAllTables();
            closeModal('mudurModal');
            logActivity("Müdür Talimatı", `Ref: ${refNo} nolu müdür talimatı yayınlandı.`);
            showToast("Müdür talimatı ilgili personele gönderildi.", "success");
        }

        function checkHistoryMatch(val) {
            if (!val || val.trim().length < 2) {
                const alertBox = document.getElementById('historyMatchAlert');
                if (alertBox) alertBox.classList.add('hidden');
                return;
            }

            val = val.trim().toUpperCase();
            let foundFile = null;
            files.forEach(f => {
                if (f.id && f.id.toUpperCase() === val) foundFile = f;
            });
            mudurFiles.forEach(m => {
                if (m.id && m.id.toUpperCase() === val) foundFile = m;
            });

            const alertBox = document.getElementById('historyMatchAlert');
            const alertText = document.getElementById('historyMatchText');
            const select = document.getElementById('formAssignee');

            if (foundFile) {
                const staff = USERS.find(u => u.id === foundFile.assignedTo);
                const foundStaffName = staff ? staff.name : "başka bir personele";
                const foundDate = foundFile.createdAt || "tarih belirtilmemiş";
                
                if (alertText && alertBox) {
                    alertText.innerHTML = `Bu referans numarası daha önce <strong>${foundStaffName}</strong> adlı personele <strong>${foundDate}</strong> tarihinde verilmiştir!`;
                    alertBox.classList.remove('hidden');
                }
                if (select) select.value = foundFile.assignedTo;
            } else {
                if (alertBox) alertBox.classList.add('hidden');
            }
        }

        function handleNewFileSubmit(e) {
            e.preventDefault();
            const category = document.getElementById('formCategory').value;
            const refInput = document.getElementById('formRefNo');
            autoFormatRef(refInput);
            const refNo = refInput.value.trim();

            const description = document.getElementById('formDescription').value.trim();
            const assigneeId = parseInt(document.getElementById('formAssignee').value);
            const incelemeReason = category === 'inceleme' ? document.getElementById('formIncelemeReason').value : null;

            files.unshift({
                id: refNo,
                category: category,
                incelemeReason: incelemeReason,
                description: description,
                assignedTo: assigneeId,
                createdBy: currentUser.id,
                createdAt: new Date().toLocaleString('tr-TR'),
                deliveredConfirmed: false,
                status: "İşlemde"
            });

            saveState();
            renderAllTables();
            closeModal('newFileModal');
            logActivity("Dosya Oluşturma", `Ref: ${refNo} (${category.toUpperCase()}) eklendi.`);
            showToast(`${refNo} referanslı yeni dosya oluşturuldu.`, 'success');
        }

        function openTransferModal(fileId) {
            const file = files.find(f => f.id === fileId);
            if (!file) return;

            document.getElementById('transferFileId').value = file.id;
            document.getElementById('transferRefNo').innerText = file.id;
            document.getElementById('transferSubject').innerText = file.description;

            const select = document.getElementById('transferTargetStaff');
            select.innerHTML = '';
            USERS.filter(u => !u.isSuperAdmin && u.id !== file.assignedTo).forEach(u => {
                select.innerHTML += `<option value="${u.id}">[ID: ${u.id}] ${u.name} (${u.role})</option>`;
            });

            document.getElementById('transferModal').classList.remove('hidden');
        }

        function handleTransferSubmit(e) {
            e.preventDefault();
            const fileId = document.getElementById('transferFileId').value;
            const targetStaffId = parseInt(document.getElementById('transferTargetStaff').value);
            const file = files.find(f => f.id === fileId);

            if (file) {
                const targetStaff = USERS.find(u => u.id === targetStaffId);
                file.assignedTo = targetStaffId;
                file.deliveredConfirmed = false;
                saveState();
                renderAllTables();
                closeModal('transferModal');
                logActivity("Dosya Havale", `Ref: ${fileId} nolu dosya${targetStaff ? targetStaff.name : 'personele'} havale edildi.`);
                showToast("Dosya havale edildi.", "info");
            }
        }

        let currentCompletingMudurId = null;
        function openMudurCompleteModal(mudurId) {
            currentCompletingMudurId = mudurId;
            document.getElementById('completeFileId').value = mudurId;
            document.getElementById('completeModalTitle').innerText = "Müdür Talimatı Açıklaması & Onayı";
            document.getElementById('completeNoteLabel').innerText = "Talimat Sonuç / Açıklama Notu";
            document.getElementById('completeNote').value = '';
            document.getElementById('completeModal').classList.remove('hidden');
        }

        function openCompleteModal(fileId) {
            currentCompletingMudurId = null;
            document.getElementById('completeFileId').value = fileId;
            document.getElementById('completeModalTitle').innerText = "Dosya İşlemini Tamamla & Onayla";
            document.getElementById('completeNoteLabel').innerText = "İnceleme / Sonuç Notu";
            document.getElementById('completeNote').value = '';
            document.getElementById('completeModal').classList.remove('hidden');
        }

        function handleCompleteSubmit(e) {
            e.preventDefault();
            const fileId = document.getElementById('completeFileId').value;
            const note = document.getElementById('completeNote').value;

            if (currentCompletingMudurId) {
                const m = mudurFiles.find(x => x.id === fileId);
                if (m) {
                    m.status = "Tamamlandı";
                    m.note = note;
                    saveState();
                    renderAllTables();
                    closeModal('completeModal');
                    logActivity("Müdür Talimatı Tamamlama", `Ref: ${fileId} talimatı onaylandı. Not: ${note}`);
                    showToast("Müdür talimatı tamamlandı.", "success");
                }
            } else {
                const file = files.find(f => f.id === fileId);
                if (file) {
                    file.status = "Tamamlandı";
                    file.note = note;
                    saveState();
                    renderAllTables();
                    closeModal('completeModal');
                    logActivity("Dosya Tamamlama", `Ref: ${fileId} onaylandı. Not: ${note}`);
                    showToast("Dosya tamamlandı ve 3 yıllık arşive işlendi.", "success");
                }
            }
            currentCompletingMudurId = null;
        }

        function deleteFile(fileId) {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Dosyayı silmek istediğinize emin misiniz?")) {
                files = files.filter(f => f.id !== fileId);
                saveState();
                renderAllTables();
                logActivity("Dosya Silme", `Ref: ${fileId} silindi.`);
                showToast("Dosya silindi.", "warning");
            }
        }

        function deleteMudurFile(mudurId) {
            if (!currentUser.isSuperAdmin) return;
            if (confirm("Bu müdür talimatını silmek istediğinize emin misiniz?")) {
                mudurFiles = mudurFiles.filter(m => m.id !== mudurId);
                saveState();
                renderAllTables();
                logActivity("Müdür Talimatı Silme", `Ref: ${mudurId} silindi.`);
                showToast("Müdür talimatı silindi.", "warning");
            }
        }

        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
        function filterFiles() {
            const q = document.getElementById('searchInput').value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(r => {
                r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
            });
        }
        function showToast(msg, type='info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `bg-slate-800 text-white p-3 rounded-xl shadow text-xs font-semibold flex justify-between`;
            toast.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()" class="ml-2">✕</button>`;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    </script>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log(`Kırşehir SYDV Kurumsal Portal çalışıyor: http://localhost:${PORT}`);
});
