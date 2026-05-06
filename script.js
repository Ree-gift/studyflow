document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav-links a, .mobile-nav-links button').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Scroll header effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"], .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Modal system
    const modals = {};
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        modals[overlay.id] = overlay;
    });

    window.openModal = function(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    };

    // Open login modal
    document.querySelectorAll('.open-login-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            openModal('login-modal');
        });
    });

    // Open signup modal
    document.querySelectorAll('.open-signup-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            openModal('signup-modal');
        });
    });

    // Open demo modal
    document.querySelectorAll('.open-demo-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('demo-modal');
        });
    });

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            closeModal(overlay.id);
        });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
                closeModal(overlay.id);
            });
        }
    });

    // Switch between login/signup modals
    document.querySelectorAll('.switch-modal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.switch;
            const currentModal = link.closest('.modal-overlay');
            closeModal(currentModal.id);
            setTimeout(() => openModal(target + '-modal'), 200);
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
        });
    });

    // Password strength checker
    const signupPassword = document.getElementById('signup-password');
    const strengthIndicator = document.getElementById('password-strength');

    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const val = signupPassword.value;
            let strength = '';
            if (val.length === 0) {
                strength = '';
            } else if (val.length < 6) {
                strength = 'weak';
            } else if (val.length < 10 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
                strength = 'medium';
            } else {
                strength = 'strong';
            }
            strengthIndicator.dataset.strength = strength;
            strengthIndicator.querySelector('.strength-text').textContent =
                strength ? strength.charAt(0).toUpperCase() + strength.slice(1) : '';
        });
    }

    // Toast notification
    let toastTimeout;
    window.showToast = function(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        toastMessage.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
    };

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            closeModal('login-modal');
            showToast('Welcome back! Redirecting to dashboard...');
            loginForm.reset();
        });
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-first').value;
            closeModal('signup-modal');
            showToast(`Welcome, ${name}! Your account has been created.`);
            signupForm.reset();
            strengthIndicator.removeAttribute('data-strength');
            strengthIndicator.querySelector('.strength-text').textContent = '';
        });
    }

    // Feature cards interactivity
    const featureData = {
        'ai-plans': {
            icon: 'feature-icon-1',
            title: 'AI Study Plans',
            desc: 'Our AI analyzes your course load, upcoming deadlines, and personal learning patterns to create optimized study schedules. It adapts in real-time as you progress, ensuring you stay on track without feeling overwhelmed.',
            highlights: ['Auto-scheduling based on deadlines', 'Adapts to your learning pace', 'Spaced repetition integration', 'Priority task sorting', 'Exam countdown tracking', 'Weekly plan adjustments']
        },
        'pomodoro': {
            icon: 'feature-icon-2',
            title: 'Smart Pomodoro',
            desc: 'Go beyond the standard 25-minute timer. Our intelligent Pomodoro system tracks your focus patterns and suggests optimal work/break intervals tailored to your productivity rhythms.',
            highlights: ['Customizable session lengths', 'Smart break recommendations', 'Focus session tracking', 'Daily productivity reports', 'Ambient sound options', 'Auto-pause on distraction']
        },
        'analytics': {
            icon: 'feature-icon-3',
            title: 'Progress Analytics',
            desc: 'Visualize your study habits with comprehensive dashboards. Track time spent per subject, identify peak productivity hours, and discover areas for improvement with actionable insights.',
            highlights: ['Study time heatmaps', 'Subject-wise breakdown', 'Weekly & monthly trends', 'Productivity score tracking', 'Goal completion rates', 'Export reports as PDF']
        },
        'tasks': {
            icon: 'feature-icon-4',
            title: 'Task Management',
            desc: 'Keep all your assignments, projects, and exams in one organized workspace. Smart priority sorting ensures you always know what to tackle next.',
            highlights: ['Kanban board view', 'Deadline reminders', 'Priority auto-sorting', 'Recurring task templates', 'Subtask breakdown', 'Calendar integration']
        },
        'collaboration': {
            icon: 'feature-icon-5',
            title: 'Collaboration',
            desc: 'Study together, even when apart. Create study groups, share notes in real-time, and coordinate schedules with classmates seamlessly.',
            highlights: ['Real-time note sharing', 'Group study scheduling', 'Shared task boards', 'In-app messaging', 'Document collaboration', 'Role-based access control']
        },
        'focus': {
            icon: 'feature-icon-6',
            title: 'Focus Mode',
            desc: 'Eliminate distractions and enter a state of deep work. Block distracting websites, play ambient sounds, and track your focus streaks.',
            highlights: ['Website & app blocking', 'Ambient sound library', 'Focus streak tracking', 'Do Not Disturb sync', 'Session goal setting', 'Focus music playlists']
        }
    };

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const featureKey = card.dataset.feature;
            const data = featureData[featureKey];
            if (!data) return;

            const iconEl = document.getElementById('feature-detail-icon');
            iconEl.className = 'feature-detail-icon ' + data.icon;

            document.getElementById('feature-detail-title').textContent = data.title;
            document.getElementById('feature-detail-desc').textContent = data.desc;

            const highlightsContainer = document.getElementById('feature-highlights');
            highlightsContainer.innerHTML = data.highlights.map(h =>
                `<div class="highlight-item">${h}</div>`
            ).join('');

            openModal('feature-modal');
        });
    });

    // Pricing toggle
    const billingToggle = document.getElementById('billing-toggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            const isYearly = billingToggle.checked;
            toggleLabels.forEach(label => {
                label.classList.toggle('active',
                    (isYearly && label.dataset.period === 'yearly') ||
                    (!isYearly && label.dataset.period === 'monthly')
                );
            });

            document.querySelectorAll('.pricing-price .price').forEach(priceEl => {
                const monthly = priceEl.dataset.monthly;
                const yearly = priceEl.dataset.yearly;
                if (monthly && yearly) {
                    priceEl.textContent = '$' + (isYearly ? yearly : monthly);
                }
            });
        });
    }
});
