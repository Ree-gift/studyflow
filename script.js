document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    document.querySelectorAll('a[href^="#"], .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Modal system
    window.openModal = function(id) {
        document.getElementById(id).classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    window.closeModal = function(id) {
        document.getElementById(id).classList.remove('active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.open-login-modal').forEach(b => b.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active'); mobileMenu.classList.remove('active'); openModal('login-modal');
    }));
    document.querySelectorAll('.open-signup-modal').forEach(b => b.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active'); mobileMenu.classList.remove('active'); openModal('signup-modal');
    }));
    document.querySelectorAll('.open-demo-modal').forEach(b => b.addEventListener('click', () => openModal('demo-modal')));
    document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => closeModal(b.closest('.modal-overlay').id)));
    document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(o => closeModal(o.id)); });
    document.querySelectorAll('.switch-modal-link').forEach(l => l.addEventListener('click', e => {
        e.preventDefault(); closeModal(l.closest('.modal-overlay').id); setTimeout(() => openModal(l.dataset.switch + '-modal'), 200);
    }));

    document.querySelectorAll('.toggle-password').forEach(b => {
        b.addEventListener('click', () => { const i = b.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; });
    });

    const signupPassword = document.getElementById('signup-password');
    const strengthIndicator = document.getElementById('password-strength');
    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const v = signupPassword.value; let s = '';
            if (v.length === 0) s = '';
            else if (v.length < 6) s = 'weak';
            else if (v.length < 10 || !/[A-Z]/.test(v) || !/[0-9]/.test(v)) s = 'medium';
            else s = 'strong';
            strengthIndicator.dataset.strength = s;
            strengthIndicator.querySelector('.strength-text').textContent = s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
        });
    }

    // Toast
    let toastTimeout;
    window.showToast = function(msg) {
        const t = document.getElementById('toast');
        document.getElementById('toast-message').textContent = msg;
        t.classList.add('show'); clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => t.classList.remove('show'), 4000);
    };

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', e => {
        e.preventDefault(); closeModal('login-modal'); showToast('Welcome back! Redirecting to dashboard...'); loginForm.reset();
    });

    const signupForm = document.getElementById('signup-form');
    if (signupForm) signupForm.addEventListener('submit', e => {
        e.preventDefault(); const n = document.getElementById('signup-first').value;
        closeModal('signup-modal'); showToast(`Welcome, ${n}! Your account has been created.`);
        signupForm.reset(); strengthIndicator.removeAttribute('data-strength');
        strengthIndicator.querySelector('.strength-text').textContent = '';
    });

    // Pricing toggle
    const billingToggle = document.getElementById('billing-toggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    if (billingToggle) billingToggle.addEventListener('change', () => {
        const y = billingToggle.checked;
        toggleLabels.forEach(l => l.classList.toggle('active', (y && l.dataset.period === 'yearly') || (!y && l.dataset.period === 'monthly')));
        document.querySelectorAll('.pricing-price .price').forEach(p => {
            if (p.dataset.monthly && p.dataset.yearly) p.textContent = '$' + (y ? p.dataset.yearly : p.dataset.monthly);
        });
    });

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-text');
        const load = contactForm.querySelector('.btn-loading');
        btn.style.display = 'none'; load.style.display = 'inline';
        setTimeout(() => {
            btn.style.display = 'inline'; load.style.display = 'none';
            showToast('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        }, 1500);
    });

    // Feature Mini-Apps
    const miniApps = {
        'ai-plans': {
            icon: 'feature-icon-1',
            title: 'AI Study Plans',
            subtitle: 'Add a subject and watch AI generate a personalized study schedule',
            render: () => `
                <div class="ai-plans-app">
                    <div class="ai-input-section">
                        <input type="text" id="ai-subject-input" placeholder="Enter a subject (e.g., Mathematics)">
                        <button class="ai-generate-btn" id="ai-generate-btn">Generate Plan</button>
                    </div>
                    <div id="ai-plan-results"></div>
                </div>`
        },
        'pomodoro': {
            icon: 'feature-icon-2',
            title: 'Smart Pomodoro',
            subtitle: 'A fully working focus timer with break intervals',
            render: () => `
                <div class="pomodoro-app">
                    <div class="pomodoro-modes">
                        <button class="pomodoro-mode active" data-minutes="25" data-label="Focus">Focus</button>
                        <button class="pomodoro-mode" data-minutes="5" data-label="Short Break">Short Break</button>
                        <button class="pomodoro-mode" data-minutes="15" data-label="Long Break">Long Break</button>
                    </div>
                    <div class="pomodoro-timer">
                        <div class="pomodoro-progress" id="pom-progress">
                            <div class="pomodoro-progress-inner">
                                <div class="pomodoro-time" id="pom-time">25:00</div>
                                <div class="pomodoro-label" id="pom-label">Focus Time</div>
                            </div>
                        </div>
                    </div>
                    <div class="pomodoro-controls">
                        <button class="pomodoro-btn pomodoro-btn-primary" id="pom-start">Start</button>
                        <button class="pomodoro-btn pomodoro-btn-secondary" id="pom-reset">Reset</button>
                    </div>
                    <div class="pomodoro-sessions">
                        <span class="session-dot"></span>
                        <span class="session-dot"></span>
                        <span class="session-dot"></span>
                        <span class="session-dot"></span>
                    </div>
                </div>`
        },
        'analytics': {
            icon: 'feature-icon-3',
            title: 'Progress Analytics',
            subtitle: 'Visual dashboard showing study hours, streaks, and subject progress',
            render: () => `
                <div class="analytics-app">
                    <div class="analytics-summary">
                        <div class="stat-card"><div class="value">24.5h</div><div class="label">Study Time</div></div>
                        <div class="stat-card"><div class="value">12</div><div class="label">Day Streak</div></div>
                        <div class="stat-card"><div class="value">87%</div><div class="label">Tasks Done</div></div>
                    </div>
                    <h4 style="font-size:0.875rem;font-weight:700;margin-bottom:0.75rem;color:var(--gray-700)">Weekly Study Hours</h4>
                    <div class="chart-bars" id="chart-bars">
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:60%"></div><div class="chart-label">Mon</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:80%"></div><div class="chart-label">Tue</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:45%"></div><div class="chart-label">Wed</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:90%"></div><div class="chart-label">Thu</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:70%"></div><div class="chart-label">Fri</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:30%"></div><div class="chart-label">Sat</div></div>
                        <div class="chart-bar-wrap"><div class="chart-bar" style="height:50%"></div><div class="chart-label">Sun</div></div>
                    </div>
                    <h4 style="font-size:0.875rem;font-weight:700;margin:1.25rem 0 0.75rem;color:var(--gray-700)">Subject Progress</h4>
                    <div class="subject-bars">
                        <div class="subject-bar"><span class="name">Math</span><div class="bar-track"><div class="bar-fill" style="width:78%;background:var(--gradient)"></div></div><span class="percent">78%</span></div>
                        <div class="subject-bar"><span class="name">Physics</span><div class="bar-track"><div class="bar-fill" style="width:65%;background:linear-gradient(135deg,#0ea5e9,#06b6d4)"></div></div><span class="percent">65%</span></div>
                        <div class="subject-bar"><span class="name">English</span><div class="bar-track"><div class="bar-fill" style="width:90%;background:linear-gradient(135deg,#10b981,#14b8a6)"></div></div><span class="percent">90%</span></div>
                        <div class="subject-bar"><span class="name">History</span><div class="bar-track"><div class="bar-fill" style="width:55%;background:linear-gradient(135deg,#f59e0b,#f97316)"></div></div><span class="percent">55%</span></div>
                    </div>
                </div>`
        },
        'tasks': {
            icon: 'feature-icon-4',
            title: 'Task Management',
            subtitle: 'Add tasks, mark them complete, and manage priorities',
            render: () => `
                <div class="todo-app">
                    <div class="todo-input-row">
                        <input type="text" id="todo-input" placeholder="Add a new task...">
                        <button class="todo-add-btn" id="todo-add">Add Task</button>
                    </div>
                    <div class="todo-filters">
                        <button class="todo-filter active" data-filter="all">All</button>
                        <button class="todo-filter" data-filter="active">Active</button>
                        <button class="todo-filter" data-filter="completed">Completed</button>
                    </div>
                    <ul class="todo-list" id="todo-list"></ul>
                    <div class="todo-stats">
                        <span id="todo-count">0 tasks</span>
                        <span id="todo-completed">0 completed</span>
                    </div>
                </div>`
        },
        'collaboration': {
            icon: 'feature-icon-5',
            title: 'Collaboration',
            subtitle: 'Shared study notes with your group members in real-time',
            render: () => `
                <div class="collab-app">
                    <div class="collab-members">
                        <div class="collab-member"><span class="collab-member-dot"></span>You</div>
                        <div class="collab-member"><span class="collab-member-dot"></span>Sarah</div>
                        <div class="collab-member"><span class="collab-member-dot"></span>Michael</div>
                    </div>
                    <div class="collab-notes" id="collab-notes">
                        <div class="collab-note"><div class="collab-note-header"><span class="collab-note-author">Sarah</span><span class="collab-note-time">2m ago</span></div><div class="collab-note-text">Hey! I just uploaded the Chapter 5 summary notes. Check them out before our study session.</div></div>
                        <div class="collab-note"><div class="collab-note-header"><span class="collab-note-author">Michael</span><span class="collab-note-time">5m ago</span></div><div class="collab-note-text">Thanks! Also, can we focus on the integration problems? They might be on the exam.</div></div>
                    </div>
                    <div class="collab-input-row">
                        <input type="text" id="collab-input" placeholder="Type a note...">
                        <button class="collab-send-btn" id="collab-send">Send</button>
                    </div>
                </div>`
        },
        'focus': {
            icon: 'feature-icon-6',
            title: 'Focus Mode',
            subtitle: 'Select ambient sounds and start a focused study session',
            render: () => `
                <div class="focus-app">
                    <div class="focus-status">
                        <div class="status-text" id="focus-status-text">Select a sound and start your session</div>
                        <div class="session-time" id="focus-time">00:00</div>
                    </div>
                    <div class="focus-sounds">
                        <div class="focus-sound" data-sound="rain"><span class="focus-sound-icon">🌧️</span><span class="focus-sound-name">Rain</span></div>
                        <div class="focus-sound" data-sound="forest"><span class="focus-sound-icon">🌲</span><span class="focus-sound-name">Forest</span></div>
                        <div class="focus-sound" data-sound="ocean"><span class="focus-sound-icon">🌊</span><span class="focus-sound-name">Ocean</span></div>
                        <div class="focus-sound" data-sound="cafe"><span class="focus-sound-icon">☕</span><span class="focus-sound-name">Cafe</span></div>
                        <div class="focus-sound" data-sound="fire"><span class="focus-sound-icon">🔥</span><span class="focus-sound-name">Fireplace</span></div>
                        <div class="focus-sound" data-sound="white"><span class="focus-sound-icon">📡</span><span class="focus-sound-name">White Noise</span></div>
                    </div>
                    <div class="focus-controls">
                        <button class="focus-start-btn" id="focus-start">Start Session</button>
                    </div>
                </div>`
        }
    };

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.feature;
            const app = miniApps[key];
            if (!app) return;
            document.getElementById('mini-app-icon').className = 'mini-app-icon ' + app.icon;
            document.getElementById('mini-app-title').textContent = app.title;
            document.getElementById('mini-app-subtitle').textContent = app.subtitle;
            document.getElementById('mini-app-container').innerHTML = app.render();
            initMiniApp(key);
            openModal('feature-modal');
        });
    });

    // Mini app initializers
    function initMiniApp(key) {
        if (key === 'pomodoro') initPomodoro();
        else if (key === 'tasks') initTodo();
        else if (key === 'ai-plans') initAIPlans();
        else if (key === 'collaboration') initCollab();
        else if (key === 'focus') initFocus();
    }

    // Pomodoro
    function initPomodoro() {
        let time = 25 * 60, totalTime = 25 * 60, running = false, interval = null, sessions = 0;
        const display = document.getElementById('pom-time');
        const label = document.getElementById('pom-label');
        const progress = document.getElementById('pom-progress');
        const startBtn = document.getElementById('pom-start');
        const resetBtn = document.getElementById('pom-reset');
        const dots = document.querySelectorAll('.session-dot');
        const modes = document.querySelectorAll('.pomodoro-mode');

        function update() {
            const m = Math.floor(time / 60).toString().padStart(2, '0');
            const s = (time % 60).toString().padStart(2, '0');
            display.textContent = m + ':' + s;
            const deg = ((totalTime - time) / totalTime) * 360;
            progress.style.background = `conic-gradient(var(--primary) ${deg}deg, var(--gray-200) ${deg}deg)`;
        }

        modes.forEach(m => m.addEventListener('click', () => {
            clearInterval(interval); running = false;
            modes.forEach(x => x.classList.remove('active')); m.classList.add('active');
            time = parseInt(m.dataset.minutes) * 60; totalTime = time;
            label.textContent = m.dataset.label + ' Time';
            startBtn.textContent = 'Start'; update();
        }));

        startBtn.addEventListener('click', () => {
            if (running) {
                clearInterval(interval); running = false; startBtn.textContent = 'Resume';
            } else {
                running = true; startBtn.textContent = 'Pause';
                interval = setInterval(() => {
                    time--;
                    if (time <= 0) {
                        clearInterval(interval); running = false;
                        startBtn.textContent = 'Start';
                        if (document.querySelector('.pomodoro-mode.active').dataset.label === 'Focus') {
                            sessions = Math.min(sessions + 1, 4);
                            dots.forEach((d, i) => d.classList.toggle('completed', i < sessions));
                            showToast('Focus session complete! Take a break.');
                        }
                        time = totalTime;
                    }
                    update();
                }, 1000);
            }
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(interval); running = false;
            time = totalTime; startBtn.textContent = 'Start'; update();
        });
        update();
    }

    // Todo
    function initTodo() {
        let todos = [
            { id: 1, text: 'Math Assignment - Chapter 5', completed: false, priority: 'high' },
            { id: 2, text: 'Read Physics Chapter 12', completed: true, priority: 'medium' },
            { id: 3, text: 'Essay Draft - History', completed: false, priority: 'low' }
        ];
        let filter = 'all', nextId = 4;
        const list = document.getElementById('todo-list');
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('todo-add');
        const filters = document.querySelectorAll('.todo-filter');

        function render() {
            const filtered = filter === 'all' ? todos : filter === 'active' ? todos.filter(t => !t.completed) : todos.filter(t => t.completed);
            list.innerHTML = filtered.map(t => `
                <li class="todo-item">
                    <div class="todo-checkbox ${t.completed ? 'checked' : '" data-id="${t.id}"></div>
                    <span class="todo-text ${t.completed ? 'completed' : ''}">${t.text}</span>
                    <span class="todo-priority priority-${t.priority}">${t.priority}</span>
                    <button class="todo-delete" data-id="${t.id}">&times;</button>
                </li>`).join('');
            document.getElementById('todo-count').textContent = todos.filter(t => !t.completed).length + ' remaining';
            document.getElementById('todo-completed').textContent = todos.filter(t => t.completed).length + ' completed';
        }

        filters.forEach(f => f.addEventListener('click', () => {
            filters.forEach(x => x.classList.remove('active')); f.classList.add('active'); filter = f.dataset.filter; render();
        }));

        list.addEventListener('click', e => {
            const cb = e.target.closest('.todo-checkbox');
            if (cb) { const t = todos.find(x => x.id == cb.dataset.id); t.completed = !t.completed; render(); return; }
            const del = e.target.closest('.todo-delete');
            if (del) { todos = todos.filter(x => x.id != del.dataset.id); render(); }
        });

        function addTodo() {
            const v = input.value.trim(); if (!v) return;
            const priorities = ['high', 'medium', 'low'];
            todos.unshift({ id: nextId++, text: v, completed: false, priority: priorities[Math.floor(Math.random() * 3)] });
            input.value = ''; render();
        }

        addBtn.addEventListener('click', addTodo);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
        render();
    }

    // AI Plans
    function initAIPlans() {
        const input = document.getElementById('ai-subject-input');
        const btn = document.getElementById('ai-generate-btn');
        const results = document.getElementById('ai-plan-results');
        const tasks = ['Review lecture notes', 'Complete practice problems', 'Read textbook chapter', 'Write summary notes', 'Solve past exam questions', 'Create flashcards', 'Watch tutorial videos', 'Group discussion prep'];
        const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

        btn.addEventListener('click', () => {
            const subject = input.value.trim(); if (!subject) return;
            input.value = '';
            results.innerHTML = `<div class="ai-typing"><div class="ai-typing-dots"><span></span><span></span><span></span></div>AI is generating your study plan...</div>`;
            setTimeout(() => {
                const shuffled = tasks.sort(() => 0.5 - Math.random()).slice(0, 5);
                results.innerHTML = `<ul class="ai-plan-list">${shuffled.map((t, i) => `
                    <li class="ai-plan-item">
                        <span class="ai-plan-time">${times[i]}</span>
                        <span class="ai-plan-divider"></span>
                        <div class="ai-plan-details"><div class="ai-plan-subject">${subject}</div><div class="ai-plan-task">${t}</div></div>
                    </li>`).join('')}</ul>`;
            }, 1500);
        });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    }

    // Collaboration
    function initCollab() {
        const input = document.getElementById('collab-input');
        const send = document.getElementById('collab-send');
        const notes = document.getElementById('collab-notes');
        const autoReplies = [
            { author: 'Sarah', text: 'Great idea! Let me add that to my notes.' },
            { author: 'Michael', text: 'I found some good resources on this topic. Sharing now.' },
            { author: 'Sarah', text: 'Should we schedule a review session for Friday?' },
            { author: 'Michael', text: 'The professor mentioned this will definitely be on the exam.' }
        ];
        let replyIdx = 0;

        function addNote(author, text) {
            const note = document.createElement('div');
            note.className = 'collab-note';
            note.innerHTML = `<div class="collab-note-header"><span class="collab-note-author">${author}</span><span class="collab-note-time">Just now</span></div><div class="collab-note-text">${text}</div>`;
            notes.appendChild(note); notes.scrollTop = notes.scrollHeight;
        }

        function autoReply() {
            setTimeout(() => {
                const r = autoReplies[replyIdx % autoReplies.length];
                addNote(r.author, r.text); replyIdx++;
            }, 1500 + Math.random() * 1000);
        }

        send.addEventListener('click', () => { const v = input.value.trim(); if (!v) return; addNote('You', v); input.value = ''; autoReply(); });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') send.click(); });
    }

    // Focus Mode
    function initFocus() {
        let activeSound = null, running = false, interval = null, seconds = 0;
        const timeDisplay = document.getElementById('focus-time');
        const statusText = document.getElementById('focus-status-text');
        const startBtn = document.getElementById('focus-start');
        const sounds = document.querySelectorAll('.focus-sound');

        sounds.forEach(s => s.addEventListener('click', () => {
            sounds.forEach(x => x.classList.remove('active')); s.classList.add('active');
            activeSound = s.dataset.sound;
            statusText.textContent = running ? `Playing: ${s.querySelector('.focus-sound-name').textContent}` : `Selected: ${s.querySelector('.focus-sound-name').textContent}. Start when ready!`;
        }));

        startBtn.addEventListener('click', () => {
            if (running) {
                clearInterval(interval); running = false;
                startBtn.textContent = 'Start Session'; startBtn.classList.remove('active');
                statusText.textContent = 'Session paused';
            } else {
                if (!activeSound) { showToast('Please select a sound first!'); return; }
                running = true; startBtn.textContent = 'Stop Session'; startBtn.classList.add('active');
                statusText.textContent = `Playing: ${document.querySelector('.focus-sound.active .focus-sound-name').textContent}`;
                interval = setInterval(() => {
                    seconds++;
                    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const s = (seconds % 60).toString().padStart(2, '0');
                    timeDisplay.textContent = m + ':' + s;
                }, 1000);
            }
        });
    }
});
