/* =============================================
   CAMPUSFINDER — app.js
   College Lost & Found Portal Logic
============================================= */

'use strict';

// ===== SAMPLE DATA =====
const CATEGORY_ICONS = {
  electronics: '💻',
  accessories: '👓',
  clothing: '👕',
  books: '📚',
  keys: '🔑',
  bags: '🎒',
  other: '📦'
};

const sampleItems = [
  {
    id: 1,
    name: 'MacBook Pro (Black Sleeve)',
    category: 'electronics',
    location: 'Library',
    date: '2026-10-04',
    description: 'Found a MacBook Pro in a black sleeve near the reading area, 3rd floor library. Has some stickers on the lid.',
    finderName: 'Arjun Mehta',
    finderContact: 'arjun.m@college.edu',
    image: null,
    status: 'available'
  },
  {
    id: 2,
    name: 'Blue Water Bottle (Nike)',
    category: 'accessories',
    location: 'Gym',
    date: '2026-10-03',
    description: 'Blue Nike water bottle left near the treadmill section. Has initials "RK" scratched at the bottom.',
    finderName: 'Priya Nair',
    finderContact: '9876543210',
    image: null,
    status: 'available'
  },
  {
    id: 3,
    name: 'Bunch of Keys (3 keys + keyring)',
    category: 'keys',
    location: 'Cafeteria',
    date: '2026-10-05',
    description: 'Set of 3 keys found on a red keyring with a small bear charm, left on table near cafeteria entrance.',
    finderName: 'Mohammed Rizwan',
    finderContact: 'rizwan@college.edu',
    image: null,
    status: 'available'
  },
  {
    id: 4,
    name: 'College ID Card',
    category: 'keys',
    location: 'Lecture Hall A',
    date: '2026-10-05',
    description: 'Found a college ID card on a seat in Lecture Hall A after the 10AM class. Name visible but posting here privately.',
    finderName: 'Sneha Reddy',
    finderContact: 'sneha.r@college.edu',
    image: null,
    status: 'claimed'
  },
  {
    id: 5,
    name: 'Purple Umbrella',
    category: 'other',
    location: 'Lecture Hall B',
    date: '2026-10-02',
    description: 'Purple compact folding umbrella left behind in Lecture Hall B after afternoon session.',
    finderName: 'Kavya S',
    finderContact: '9123456789',
    image: null,
    status: 'available'
  },
  {
    id: 6,
    name: 'Engineering Drawing Kit',
    category: 'books',
    location: 'Lab',
    date: '2026-10-01',
    description: 'Full engineering drawing set including compass, scales, and protractor in a blue zip pouch. Left in Computer Lab.',
    finderName: 'Rahul Verma',
    finderContact: 'rahul.v@college.edu',
    image: null,
    status: 'available'
  },
  {
    id: 7,
    name: 'Black Hoodie (Medium)',
    category: 'clothing',
    location: 'Sports Ground',
    date: '2026-10-03',
    description: 'Plain black hoodie, size Medium, left on bench near the football ground. No name tag inside.',
    finderName: 'Deepika Menon',
    finderContact: 'deepika@college.edu',
    image: null,
    status: 'available'
  },
  {
    id: 8,
    name: 'Wireless Earbuds (white case)',
    category: 'electronics',
    location: 'Library',
    date: '2026-10-04',
    description: 'White wireless earbuds case (looks like Sony) found near the charging station in library ground floor.',
    finderName: 'Aditya Kumar',
    finderContact: '8765432109',
    image: null,
    status: 'available'
  },
  {
    id: 9,
    name: 'Backpack (Grey, Wildcraft)',
    category: 'bags',
    location: 'Parking Lot',
    date: '2026-10-02',
    description: 'Grey Wildcraft backpack found near the bike parking area. Contains some textbooks inside.',
    finderName: 'Pooja Sharma',
    finderContact: 'pooja.s@college.edu',
    image: null,
    status: 'available'
  }
];

// ===== STATE =====
let allItems = [...sampleItems];
let filteredItems = [...allItems];
let currentFilter = 'all';
let currentSearch = '';
let currentLocation = '';
let currentSort = 'newest';
let selectedItemId = null;
let uploadedImageDataURL = null;
let currentUser = JSON.parse(localStorage.getItem('campusfinder_user') || 'null');

// ===== DOM REFS =====
const itemsGrid = document.getElementById('items-grid');
const noResults = document.getElementById('no-results');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const locationFilter = document.getElementById('location-filter');
const sortFilter = document.getElementById('sort-filter');
const filterPills = document.querySelectorAll('.filter-pill');

const reportModal = document.getElementById('report-modal');
const contactModal = document.getElementById('contact-modal');
const detailModal = document.getElementById('detail-modal');
const loginModal = document.getElementById('login-modal');

const reportForm = document.getElementById('report-form');
const contactForm = document.getElementById('contact-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('item-image');
const uploadContent = document.getElementById('upload-content');
const uploadPreview = document.getElementById('upload-preview');
const previewImg = document.getElementById('preview-img');
const removeImgBtn = document.getElementById('remove-img-btn');

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const toast = document.getElementById('toast');

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateNavActiveLinks();
}, { passive: true });

function updateNavActiveLinks() {
  const sections = ['home', 'how-it-works', 'browse', 'stats'];
  const scrollPos = window.scrollY + 100;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const links = document.querySelectorAll(`.nav-link[href="#${id}"]`);
    const inView = el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos;
    links.forEach(l => l.classList.toggle('active', inView));
  });
}

// ===== HAMBURGER =====
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
mobileMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 20);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.hero-stats, .stats-grid').forEach(el => counterObserver.observe(el));

// ===== OPEN REPORT MODAL =====
function openReportModal() {
  reportForm.reset();
  clearImageUpload();
  clearFormErrors(reportForm);
  reportModal.showModal();
}
document.getElementById('report-btn').addEventListener('click', openReportModal);
document.getElementById('hero-report-btn').addEventListener('click', openReportModal);
document.getElementById('mobile-report-btn').addEventListener('click', openReportModal);
document.getElementById('hero-search-btn').addEventListener('click', () => {
  document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
});

// ===== CLOSE MODALS =====
document.getElementById('close-report-modal').addEventListener('click', () => reportModal.close());
document.getElementById('cancel-report-btn').addEventListener('click', () => reportModal.close());
document.getElementById('close-contact-modal').addEventListener('click', () => contactModal.close());
document.getElementById('cancel-contact-btn').addEventListener('click', () => contactModal.close());
document.getElementById('close-detail-modal').addEventListener('click', () => detailModal.close());

const closeLoginModalBtn = document.getElementById('close-login-modal');
if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', () => loginModal.close());

// Light dismiss
[reportModal, contactModal, detailModal, loginModal].forEach(dialog => {
  if (!dialog) return;
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    if (outside) dialog.close();
  });
});

// ===== AUTH SYSTEM =====
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const ssoBtn = document.getElementById('sso-btn');

function openLoginModal() {
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
  if (loginForm) clearFormErrors(loginForm);
  if (registerForm) clearFormErrors(registerForm);
  switchAuthTab('login');
  if (loginModal) loginModal.showModal();
}

function switchAuthTab(tab) {
  if (!tabLogin || !tabRegister) return;
  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.classList.remove('active');
    tabRegister.setAttribute('aria-selected', 'false');
    if (loginForm) loginForm.classList.remove('hidden');
    if (registerForm) registerForm.classList.add('hidden');
  } else {
    tabRegister.classList.add('active');
    tabRegister.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');
    if (registerForm) registerForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
  }
}

if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
if (tabRegister) tabRegister.addEventListener('click', () => switchAuthTab('register'));

function updateAuthUI() {
  const navActions = document.getElementById('nav-actions');
  const mobileActions = document.getElementById('mobile-actions');
  
  if (currentUser) {
    const avatarChar = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤';
    const userHTML = `
      <div class="user-pill">
        <div class="user-pill-avatar">${avatarChar}</div>
        <span>${escapeHtml(currentUser.name)}</span>
        <button class="user-signout-btn" id="signout-btn" title="Sign Out">Logout</button>
      </div>
      <button class="btn btn-primary" id="report-btn">+ Report Found Item</button>
    `;
    const mobileUserHTML = `
      <div class="user-pill" style="justify-content:center">
        <div class="user-pill-avatar">${avatarChar}</div>
        <span>${escapeHtml(currentUser.name)}</span>
        <button class="user-signout-btn" id="mobile-signout-btn">Logout</button>
      </div>
      <button class="btn btn-primary" id="mobile-report-btn" style="width:100%">+ Report Found Item</button>
    `;
    if (navActions) navActions.innerHTML = userHTML;
    if (mobileActions) mobileActions.innerHTML = mobileUserHTML;

    const navReport = navActions ? navActions.querySelector('#report-btn') : null;
    const mobReport = mobileActions ? mobileActions.querySelector('#mobile-report-btn') : null;
    if (navReport) navReport.addEventListener('click', openReportModal);
    if (mobReport) mobReport.addEventListener('click', openReportModal);

    const signoutBtn = document.getElementById('signout-btn');
    const mobSignoutBtn = document.getElementById('mobile-signout-btn');
    const handleSignout = () => {
      currentUser = null;
      localStorage.removeItem('campusfinder_user');
      updateAuthUI();
      showToast('success', 'Signed out successfully.');
    };
    if (signoutBtn) signoutBtn.addEventListener('click', handleSignout);
    if (mobSignoutBtn) mobSignoutBtn.addEventListener('click', handleSignout);

    // Pre-fill inputs
    const finderNameInput = document.getElementById('finder-name');
    const finderContactInput = document.getElementById('finder-contact');
    if (finderNameInput && !finderNameInput.value) finderNameInput.value = currentUser.name;
    if (finderContactInput && !finderContactInput.value) finderContactInput.value = currentUser.email;

    const claimantNameInput = document.getElementById('claimant-name');
    const claimantContactInput = document.getElementById('claimant-contact');
    if (claimantNameInput && !claimantNameInput.value) claimantNameInput.value = currentUser.name;
    if (claimantContactInput && !claimantContactInput.value) claimantContactInput.value = currentUser.email;
  } else {
    const defaultNavHTML = `
      <button class="btn btn-ghost" id="nav-login-btn">&#128273; Sign In</button>
      <button class="btn btn-primary" id="report-btn">+ Report Found Item</button>
    `;
    const defaultMobileHTML = `
      <button class="btn btn-ghost" id="mobile-login-btn" style="width:100%">&#128273; Sign In</button>
      <button class="btn btn-primary" id="mobile-report-btn" style="width:100%">+ Report Found Item</button>
    `;
    if (navActions) navActions.innerHTML = defaultNavHTML;
    if (mobileActions) mobileActions.innerHTML = defaultMobileHTML;

    const nLogin = document.getElementById('nav-login-btn');
    const mLogin = document.getElementById('mobile-login-btn');
    const nReport = document.getElementById('report-btn');
    const mReport = document.getElementById('mobile-report-btn');

    if (nLogin) nLogin.addEventListener('click', openLoginModal);
    if (mLogin) mLogin.addEventListener('click', openLoginModal);
    if (nReport) nReport.addEventListener('click', openReportModal);
    if (mReport) mReport.addEventListener('click', openReportModal);
  }
}

// Login Submit
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    
    if (!emailInput.value.trim()) {
      showError('login-email-error', 'Please enter your email or Student ID.');
      return;
    }
    clearError('login-email-error');
    if (!passInput.value) {
      showError('login-password-error', 'Please enter your password.');
      return;
    }
    clearError('login-password-error');

    const rawVal = emailInput.value.trim();
    const name = rawVal.includes('@') 
      ? capitalize(rawVal.split('@')[0].replace('.', ' '))
      : 'Student (' + rawVal + ')';
      
    currentUser = {
      name: name,
      email: rawVal.includes('@') ? rawVal : rawVal + '@college.edu',
      role: 'Student'
    };
    localStorage.setItem('campusfinder_user', JSON.stringify(currentUser));
    loginModal.close();
    updateAuthUI();
    showToast('success', `Welcome back, ${currentUser.name}!`);
  });
}

// Register Submit
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const role = document.getElementById('reg-role').value;
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    let valid = true;
    if (!name) { showError('reg-name-error', 'Name is required'); valid = false; } else clearError('reg-name-error');
    if (!email) { showError('reg-email-error', 'Email is required'); valid = false; } else clearError('reg-email-error');
    if (!pass || pass.length < 6) { showError('reg-password-error', 'Password must be at least 6 characters'); valid = false; } else clearError('reg-password-error');
    if (pass !== confirm) { showError('reg-confirm-error', 'Passwords do not match'); valid = false; } else clearError('reg-confirm-error');

    if (!valid) return;

    currentUser = { name, email, role };
    localStorage.setItem('campusfinder_user', JSON.stringify(currentUser));
    loginModal.close();
    updateAuthUI();
    showToast('success', `Account created! Welcome, ${name}.`);
  });
}

// SSO Submit
if (ssoBtn) {
  ssoBtn.addEventListener('click', () => {
    currentUser = { name: 'Student (SSO Verified)', email: 'student.sso@college.edu', role: 'Student' };
    localStorage.setItem('campusfinder_user', JSON.stringify(currentUser));
    loginModal.close();
    updateAuthUI();
    showToast('success', 'Logged in via College SSO!');
  });
}

// ===== IMAGE UPLOAD =====
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});
fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });
uploadArea.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
removeImgBtn.addEventListener('click', e => { e.stopPropagation(); clearImageUpload(); });

function handleFile(file) {
  if (!file.type.startsWith('image/')) { showError('image-error', 'Please select a valid image file.'); return; }
  if (file.size > 5 * 1024 * 1024) { showError('image-error', 'Image must be under 5MB.'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    uploadedImageDataURL = ev.target.result;
    previewImg.src = uploadedImageDataURL;
    uploadContent.classList.add('hidden');
    uploadPreview.classList.remove('hidden');
    clearError('image-error');
  };
  reader.readAsDataURL(file);
}
function clearImageUpload() {
  uploadedImageDataURL = null;
  previewImg.src = '';
  fileInput.value = '';
  uploadContent.classList.remove('hidden');
  uploadPreview.classList.add('hidden');
}

// ===== FORM VALIDATION =====
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; }
  const inputId = id.replace('-error', '');
  const input = document.getElementById(inputId);
  if (input) input.classList.add('error');
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; }
  const inputId = id.replace('-error', '');
  const input = document.getElementById(inputId);
  if (input) input.classList.remove('error');
}
function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validateReportForm() {
  let valid = true;
  const fields = [
    { id: 'item-name', errorId: 'item-name-error', msg: 'Please enter the item name.' },
    { id: 'item-category', errorId: 'category-error', msg: 'Please select a category.' },
    { id: 'found-location', errorId: 'location-error', msg: 'Please select where you found it.' },
    { id: 'found-date', errorId: 'date-error', msg: 'Please enter the date found.' },
    { id: 'item-description', errorId: 'description-error', msg: 'Please describe the item.' },
    { id: 'finder-name', errorId: 'finder-name-error', msg: 'Please enter your name.' },
    { id: 'finder-contact', errorId: 'finder-contact-error', msg: 'Please enter your contact info.' },
  ];
  fields.forEach(({ id, errorId, msg }) => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) { showError(errorId, msg); valid = false; }
    else clearError(errorId);
  });
  if (!uploadedImageDataURL) {
    showError('image-error', 'Please upload a photo of the item.');
    valid = false;
  } else clearError('image-error');
  return valid;
}

function validateContactForm() {
  let valid = true;
  [
    { id: 'claimant-name', errorId: 'claimant-name-error', msg: 'Please enter your name.' },
    { id: 'claimant-contact', errorId: 'claimant-contact-error', msg: 'Please enter your contact.' },
    { id: 'claim-message', errorId: 'claim-message-error', msg: 'Please write a message.' },
  ].forEach(({ id, errorId, msg }) => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) { showError(errorId, msg); valid = false; }
    else clearError(errorId);
  });
  return valid;
}

// ===== REPORT FORM SUBMIT =====
reportForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateReportForm()) return;

  const btn = document.getElementById('submit-report-btn');
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  setTimeout(() => {
    const newItem = {
      id: Date.now(),
      name: document.getElementById('item-name').value.trim(),
      category: document.getElementById('item-category').value,
      location: document.getElementById('found-location').value,
      date: document.getElementById('found-date').value,
      description: document.getElementById('item-description').value.trim(),
      finderName: document.getElementById('finder-name').value.trim(),
      finderContact: document.getElementById('finder-contact').value.trim(),
      image: uploadedImageDataURL,
      status: 'available'
    };
    allItems.unshift(newItem);
    applyFilters();
    reportModal.close();
    showToast('success', '✅ Item reported successfully! Thank you for helping.');
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  }, 1200);
});

// ===== CONTACT FORM SUBMIT =====
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateContactForm()) return;

  const btn = contactForm.querySelector('.btn-submit');
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  setTimeout(() => {
    contactModal.close();
    showToast('success', '💬 Message sent! The finder will contact you soon.');
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  }, 1200);
});

// ===== CLEAR SEARCH =====
document.getElementById('clear-search-btn').addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  locationFilter.value = '';
  currentLocation = '';
  filterPills.forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
  currentFilter = 'all';
  applyFilters();
});

// ===== FILTERS =====
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.toLowerCase().trim();
  applyFilters();
});
locationFilter.addEventListener('change', () => {
  currentLocation = locationFilter.value;
  applyFilters();
});
sortFilter.addEventListener('change', () => {
  currentSort = sortFilter.value;
  applyFilters();
});
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentFilter = pill.dataset.filter;
    applyFilters();
  });
});

function applyFilters() {
  filteredItems = allItems.filter(item => {
    const matchCat = currentFilter === 'all' || item.category === currentFilter;
    const matchLoc = !currentLocation || item.location === currentLocation;
    const matchSearch = !currentSearch ||
      item.name.toLowerCase().includes(currentSearch) ||
      item.location.toLowerCase().includes(currentSearch) ||
      item.description.toLowerCase().includes(currentSearch) ||
      item.category.toLowerCase().includes(currentSearch);
    return matchCat && matchLoc && matchSearch;
  });
  if (currentSort === 'oldest') {
    filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  renderItems();
}

// ===== RENDER ITEMS =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function daysAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return days + ' days ago';
}

function renderItems() {
  const count = filteredItems.length;
  resultsCount.textContent = count === 0 ? 'No items found' :
    count === 1 ? '1 item found' : count + ' items found';

  if (count === 0) {
    itemsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  itemsGrid.innerHTML = filteredItems.map((item, i) => `
    <article class="item-card animate-in" style="animation-delay:${i * 0.05}s" role="listitem" data-id="${item.id}" tabindex="0" aria-label="Found item: ${item.name}">
      ${item.image
        ? `<img class="item-card-img" src="${item.image}" alt="${item.name}" loading="lazy" />`
        : `<div class="item-card-img-placeholder">${CATEGORY_ICONS[item.category] || '📦'}</div>`
      }
      <div class="item-card-body">
        <div class="item-card-header">
          <h3 class="item-card-title">${escapeHtml(item.name)}</h3>
          <span class="item-card-badge ${item.status === 'claimed' ? 'badge-claimed' : 'badge-available'}">
            ${item.status === 'claimed' ? 'Claimed' : 'Available'}
          </span>
        </div>
        <div class="item-card-meta">
          <div class="item-meta-row">📍 ${escapeHtml(item.location)}</div>
          <div class="item-meta-row">📅 ${daysAgo(item.date)}</div>
          <div class="item-meta-row">🏷️ ${capitalize(item.category)}</div>
        </div>
        <p class="item-card-desc">${escapeHtml(item.description)}</p>
      </div>
      <div class="item-card-footer">
        <button class="btn btn-outline view-btn" data-id="${item.id}" aria-label="View details for ${item.name}">View Details</button>
        ${item.status !== 'claimed'
          ? `<button class="btn btn-primary contact-btn" data-id="${item.id}" aria-label="Contact finder for ${item.name}">Contact Finder</button>`
          : `<button class="btn btn-ghost" disabled style="opacity:0.5;cursor:not-allowed">Claimed</button>`
        }
      </div>
    </article>
  `).join('');

  // Bind events
  itemsGrid.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDetailModal(parseInt(btn.dataset.id)); });
  });
  itemsGrid.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openContactModal(parseInt(btn.dataset.id)); });
  });
  itemsGrid.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => openDetailModal(parseInt(card.dataset.id)));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openDetailModal(parseInt(card.dataset.id)); });
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ===== OPEN DETAIL MODAL =====
function openDetailModal(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;
  selectedItemId = id;
  const detailContent = document.getElementById('detail-content');
  detailContent.innerHTML = `
    ${item.image
      ? `<img class="detail-img" src="${item.image}" alt="${escapeHtml(item.name)}" />`
      : `<div class="detail-img-placeholder">${CATEGORY_ICONS[item.category] || '📦'}</div>`
    }
    <div>
      <div class="detail-header">
        <div>
          <h2 id="detail-modal-title" class="detail-title">${escapeHtml(item.name)}</h2>
          <span class="item-card-badge ${item.status === 'claimed' ? 'badge-claimed' : 'badge-available'}" style="display:inline-block;margin-bottom:12px">
            ${item.status === 'claimed' ? 'Claimed' : 'Available'}
          </span>
        </div>
      </div>
      <div class="detail-meta">
        <div class="detail-meta-row">📍 <strong>Location:</strong> ${escapeHtml(item.location)}</div>
        <div class="detail-meta-row">📅 <strong>Date Found:</strong> ${formatDate(item.date)}</div>
        <div class="detail-meta-row">🏷️ <strong>Category:</strong> ${capitalize(item.category)}</div>
        <div class="detail-meta-row">👤 <strong>Found by:</strong> ${escapeHtml(item.finderName)}</div>
      </div>
    </div>
    <div>
      <div class="detail-desc-label">Description</div>
      <p class="detail-desc">${escapeHtml(item.description)}</p>
    </div>
    ${item.status !== 'claimed'
      ? `<div class="detail-action"><button class="btn btn-primary" id="detail-contact-btn" style="min-width:180px">💬 Contact Finder</button></div>`
      : `<div class="detail-action"><button class="btn btn-ghost" disabled style="opacity:0.5">This item has been claimed</button></div>`
    }
  `;
  detailModal.showModal();
  const detailContactBtn = document.getElementById('detail-contact-btn');
  if (detailContactBtn) {
    detailContactBtn.addEventListener('click', () => {
      detailModal.close();
      openContactModal(id);
    });
  }
}

// ===== OPEN CONTACT MODAL =====
function openContactModal(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;
  selectedItemId = id;

  document.getElementById('contact-item-name').textContent = `"${item.name}"`;
  document.getElementById('finder-info-value').textContent = `${item.finderName} — ${item.finderContact}`;

  const preview = document.getElementById('contact-item-preview');
  preview.innerHTML = `
    ${item.image
      ? `<img class="contact-preview-img" src="${item.image}" alt="${escapeHtml(item.name)}" />`
      : `<div class="contact-preview-placeholder">${CATEGORY_ICONS[item.category] || '📦'}</div>`
    }
    <div class="contact-preview-info">
      <h4>${escapeHtml(item.name)}</h4>
      <p>📍 ${escapeHtml(item.location)} &nbsp;|&nbsp; 📅 ${formatDate(item.date)}</p>
    </div>
  `;
  contactForm.reset();
  clearFormErrors(contactForm);
  contactModal.showModal();
}

// ===== TOAST =====
let toastTimer = null;
function showToast(type, msg) {
  const icon = type === 'success' ? '✅' : '❌';
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-msg').textContent = msg;
  toast.className = `toast ${type} show`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== INIT =====
function init() {
  const dateInput = document.getElementById('found-date');
  if (dateInput) dateInput.max = new Date().toISOString().split('T')[0];
  updateAuthUI();
  applyFilters();
}
init();