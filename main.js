(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var slides = [
    {
      quote:
        'Saber que os arquivos são desbloqueados faz toda diferença, porque posso adaptar para minha realidade.',
      name: 'Mariana Silva',
      role: 'Gestora Financeira',
      photo: 'assets/testimonial-mariana.jpg',
      useInitials: false,
    },
    {
      quote:
        'Em poucos dias já organizei o fluxo de caixa e parei de perder tempo refazendo a mesma planilha.',
      name: 'Ricardo Santos',
      role: 'Empresário',
      useInitials: true,
      initials: 'RS',
    },
    {
      quote:
        'O acervo cobre desde o operacional até relatórios para a diretoria. Vale cada centavo.',
      name: 'Carla Mendes',
      role: 'Controller',
      useInitials: true,
      initials: 'CM',
    },
  ]

  var idx = 0
  var quoteEl = document.getElementById('testimonial-quote')
  var nameEl = document.getElementById('testimonial-name')
  var roleEl = document.getElementById('testimonial-role')
  var avatarEl = document.getElementById('testimonial-avatar')
  var initialsEl = document.getElementById('testimonial-initials')
  var prevBtn = document.querySelector('.testimonials-section__nav-btn--prev')
  var nextBtn = document.querySelector('.testimonials-section__nav-btn--next')

  function renderTestimonial() {
    if (!quoteEl || !nameEl || !roleEl || !avatarEl || !initialsEl) return

    var slide = slides[idx]
    quoteEl.textContent = slide.quote
    nameEl.textContent = slide.name
    roleEl.textContent = slide.role

    if (slide.useInitials) {
      avatarEl.setAttribute('hidden', '')
      initialsEl.removeAttribute('hidden')
      initialsEl.textContent = slide.initials
      return
    }

    avatarEl.removeAttribute('hidden')
    initialsEl.setAttribute('hidden', '')
    avatarEl.src = slide.photo
    avatarEl.alt = ''
  }

  function goToSlide(delta) {
    idx = (idx + delta + slides.length) % slides.length
    renderTestimonial()
  }

  if (prevBtn && nextBtn && quoteEl) {
    prevBtn.addEventListener('click', function () {
      goToSlide(-1)
    })

    nextBtn.addEventListener('click', function () {
      goToSlide(1)
    })
  }

  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'))
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return

      faqItems.forEach(function (other) {
        if (other !== item) {
          other.open = false
        }
      })
    })
  })

  var footerYear = document.getElementById('footer-year')
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear())
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return
  }

  document.documentElement.classList.add('motion-safe')

  var revealSelector = [
    '.benefits-bar__item',
    '.problem-section__title',
    '.problem-section__gallery-card',
    '.problem-section__lead',
    '.problem-section__copy p',
    '.problem-section__list li',
    '.problem-section__cta',
    '.modules-section__title',
    '.modules-card',
    '.compare-section__eyebrow',
    '.compare-section__title',
    '.compare-section__col',
    '.compare-section__footer-note',
    '.compare-section__proof',
    '.testimonials-section__eyebrow',
    '.testimonials-section__title',
    '.testimonials-section__nav',
    '.testimonials-section__content',
    '.offer-card__logo',
    '.offer-card__rule',
    '.offer-card__title',
    '.offer-card__list li',
    '.offer-card__was',
    '.offer-card__price-block',
    '.offer-card__cta',
    '.offer-card__payments',
    '.offer-card__trust',
    '.guarantee-section__visual',
    '.guarantee-section__title',
    '.guarantee-section__body p',
    '.faq-section__title',
    '.faq-item',
    '.faq-section__support-title',
    '.faq-section .offer-card__cta',
    '.site-footer__inner p',
  ].join(', ')

  var revealElements = Array.prototype.slice.call(document.querySelectorAll(revealSelector))
  var delayByScope = new Map()

  function getRevealKind(element) {
    if (
      element.classList.contains('problem-section__gallery-card--left') ||
      element.classList.contains('compare-section__col--before')
    ) {
      return 'left'
    }

    if (
      element.classList.contains('problem-section__gallery-card--right') ||
      element.classList.contains('compare-section__col--after')
    ) {
      return 'right'
    }

    if (
      element.classList.contains('modules-card') ||
      element.classList.contains('testimonials-section__content') ||
      element.classList.contains('offer-card__price-block')
    ) {
      return 'zoom'
    }

    return 'up'
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return

        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px',
    }
  )

  revealElements.forEach(function (element) {
    var scope =
      element.closest(
        '.problem-section__body, .modules-section__grid, .compare-section__grid, .offer-card, .faq-section__list, section, footer'
      ) || element.parentElement

    var step = delayByScope.get(scope) || 0
    element.setAttribute('data-reveal', getRevealKind(element))
    element.style.setProperty('--reveal-delay', String(Math.min(step, 6) * 60) + 'ms')
    delayByScope.set(scope, step + 1)
    revealObserver.observe(element)
  })
})()
