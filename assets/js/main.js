/**
 * WORLD PRO GOALTENDING — JAVASCRIPT CONTROLLER
 * Location: Calgary, Alberta, Canada
 * Handles Header transitions, Mobile Drawer, Booking Modals, Form Validation, and Toast alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initBookingModal();
  initForms();
  initSmoothScroll();
  initProgramTabs();
});

/* --- 1. HEADER SCROLL EFFECT --- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 2. MOBILE DRAWER NAVIGATION --- */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    hamburgerBtn.classList.add('active');
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    hamburgerBtn.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --- 3. BOOKING / INQUIRY MODAL --- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const backdrop = document.querySelector('.modal-backdrop');
  const closeBtns = document.querySelectorAll('.js-close-modal');
  const triggerBtns = document.querySelectorAll('[data-open-modal="booking"], .js-open-booking');
  const programSelect = document.getElementById('modalProgramSelect');

  if (!modal || !backdrop) return;

  const openModal = (programName = '') => {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');

    if (programSelect && programName) {
      programSelect.value = programName;
    }

    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  };

  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const program = btn.getAttribute('data-program') || '';
      openModal(program);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Global helper for opening modal
  window.openBookingModal = openModal;
}

/* --- 4. FORM VALIDATION & DEMO SUBMISSION --- */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const group = input.closest('.form-group');
        const val = input.value.trim();

        if (!val) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else if (input.type === 'email' && !validateEmail(val)) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }

        input.addEventListener('input', () => {
          if (group) group.classList.remove('has-error');
        }, { once: true });
      });

      if (!isValid) {
        showToast('Please fill out all required fields correctly.', 'error');
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" style="animation: spin 1s linear infinite; width:16px; height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Processing...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        form.reset();

        // Close modal if form is inside modal
        const modalBackdrop = form.closest('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.classList.remove('open');
          document.body.style.overflow = '';
        }

        showToast('Inquiry received! World Pro will be in touch shortly.', 'success');
      }, 900);
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --- 5. TOAST NOTIFICATION SYSTEM --- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconSvg = type === 'success'
    ? `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg style="color:#EF4444" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* --- 6. SMOOTH SCROLL FOR IN-PAGE ANCHORS --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 84;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- 7. PROGRAM TABS (FOR PROGRAMS PAGE) --- */
function initProgramTabs() {
  const filterBtns = document.querySelectorAll('.program-filter-btn');
  const programSections = document.querySelectorAll('.program-section-item');

  if (!filterBtns.length || !programSections.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      programSections.forEach(section => {
        if (filter === 'all' || section.getAttribute('data-category') === filter) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}
