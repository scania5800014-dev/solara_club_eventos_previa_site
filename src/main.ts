// Solara Club&Events - Interactive Core Engine (Vanilla TS/ES6+)

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initScrollReveal();
  initGallery();
  initContactForm();
  initBackToTop();
  initDateConstraints();
});

/* ==========================================================================
   Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-anchor');

  // Header background blur intensification on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('shadow-lg', 'bg-opacity-95');
      header?.classList.remove('bg-opacity-80');
    } else {
      header?.classList.remove('shadow-lg', 'bg-opacity-95');
      header?.classList.add('bg-opacity-80');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden', !isExpanded);
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }
}

/* ==========================================================================
   Scroll Spy for Active Nav State
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-anchor');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionEl = section as HTMLElement;
      const sectionHeight = sectionEl.offsetHeight;
      const sectionTop = sectionEl.offsetTop - 140;
      const sectionId = sectionEl.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('text-neon-cyan', 'border-b-2', 'border-[#00FFFF]');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-neon-cyan', 'border-b-2', 'border-[#00FFFF]');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Gallery Filtering & Lightbox
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;
  const visibleCards: HTMLElement[] = [];

  function updateVisibleCards() {
    visibleCards.length = 0;
    galleryItems.forEach(card => {
      const cardEl = card as HTMLElement;
      if (!cardEl.classList.contains('hidden')) {
        visibleCards.push(cardEl);
      }
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('btn-neon-primary', 'active');
        b.classList.add('btn-neon-secondary');
      });
      btn.classList.add('btn-neon-primary', 'active');
      btn.classList.remove('btn-neon-secondary');

      const filter = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemEl = item as HTMLElement;
        const category = itemEl.getAttribute('data-category') || '';
        const categories = category.split(' ').filter(Boolean);
        if (filter === 'all' || category === filter || categories.includes(filter)) {
          itemEl.classList.remove('hidden');
          setTimeout(() => itemEl.classList.add('revealed'), 50);
        } else {
          itemEl.classList.add('hidden');
        }
      });

      updateVisibleCards();
    });
  });

  updateVisibleCards();

  // Open Lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const cardEl = item as HTMLElement;
      const img = cardEl.querySelector('img') as HTMLImageElement | null;
      const title = cardEl.getAttribute('data-title') || 'Solara Club&Events';
      const indexInVisible = visibleCards.indexOf(cardEl);

      if (img && lightbox && lightboxImg) {
        currentIndex = indexInVisible >= 0 ? indexInVisible : 0;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) {
          const desc = cardEl.getAttribute('data-desc') || '';
          lightboxDesc.textContent = desc;
        }
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  function showLightboxIndex(index: number) {
    if (visibleCards.length === 0 || !lightboxImg) return;
    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;
    currentIndex = index;

    const card = visibleCards[currentIndex];
    const img = card.querySelector('img') as HTMLImageElement | null;
    const title = card.getAttribute('data-title') || 'Solara Club&Events';

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) {
        const desc = card.getAttribute('data-desc') || '';
        lightboxDesc.textContent = desc;
      }
    }
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showLightboxIndex(currentIndex - 1));
  lightboxNext?.addEventListener('click', () => showLightboxIndex(currentIndex + 1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentIndex + 1);
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  }
}

/* ==========================================================================
   Contact Form, Input Masking & WhatsApp Link Generator
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const phoneInput = document.getElementById('form-phone') as HTMLInputElement | null;
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalWhatsapp = document.getElementById('modal-whatsapp-btn') as HTMLAnchorElement | null;
  const modalSummary = document.getElementById('modal-summary');

  // Brazilian Phone Mask: (XX) XXXXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      let val = target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);

      if (val.length > 10) {
        val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (val.length > 6) {
        val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (val.length > 2) {
        val = val.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (val.length > 0) {
        val = val.replace(/^(\d*)$/, '($1');
      }
      target.value = val;
    });
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('form-name') as HTMLInputElement)?.value.trim();
      const phone = phoneInput?.value.trim() || '';
      const eventType = (document.getElementById('form-event-type') as HTMLSelectElement)?.value;
      const eventDate = (document.getElementById('form-date') as HTMLInputElement)?.value;
      const guests = (document.getElementById('form-guests') as HTMLInputElement)?.value;
      const message = (document.getElementById('form-message') as HTMLTextAreaElement)?.value.trim();

      if (!name || !phone) {
        alert('Por favor, preencha seu nome e telefone/WhatsApp.');
        return;
      }

      // Format date for BR if present
      let formattedDate = eventDate;
      if (eventDate) {
        const parts = eventDate.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }

      // Construct WhatsApp Message
      const waText = 
`Olá, equipe do Solara Club&Events! ✨
Gostaria de solicitar um orçamento para meu evento:

👤 *Nome:* ${name}
📱 *WhatsApp:* ${phone}
🎉 *Tipo de Evento:* ${eventType || 'Não especificado'}
📅 *Data Prevista:* ${formattedDate || 'A definir'}
👥 *Convidados:* ${guests ? `${guests} pessoas` : 'A definir'}
📝 *Mensagem:* ${message || 'Gostaria de agendar uma visita e saber valores.'}

Aguardo o contato. Obrigado!`;

      const encodedWaText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/5563992183515?text=${encodedWaText}`;

      // Update Modal
      if (modalSummary) {
        modalSummary.innerHTML = `
          <div class="space-y-1 text-sm text-slate-300">
            <p><strong class="text-white">Cliente:</strong> ${name}</p>
            <p><strong class="text-white">WhatsApp:</strong> ${phone}</p>
            <p><strong class="text-white">Evento:</strong> ${eventType || 'Geral'}</p>
            ${formattedDate ? `<p><strong class="text-white">Data:</strong> ${formattedDate}</p>` : ''}
            ${guests ? `<p><strong class="text-white">Capacidade:</strong> até ${guests} convidados</p>` : ''}
          </div>
        `;
      }

      if (modalWhatsapp) {
        modalWhatsapp.href = waUrl;
      }

      // Show modal
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }

      // Reset form
      form.reset();
    });
  }

  // Modal Close
  modalClose?.addEventListener('click', () => {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  });
}

/* ==========================================================================
   Date Constraints (Prevent Past Dates)
   ========================================================================== */
function initDateConstraints() {
  const dateInput = document.getElementById('form-date') as HTMLInputElement | null;
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}

/* ==========================================================================
   Back To Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn?.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTopBtn?.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn?.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
