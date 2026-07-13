// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Optional: Intersection Observer for scroll animations (fade in on scroll)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// --- Dynamic Counters ---
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.innerText = target;
                }
            };
            updateCounter();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// --- Contact Form Simulation ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            contactForm.reset();
            formStatus.innerText = 'Message sent successfully! We will contact you soon.';
            formStatus.style.color = 'var(--accent)';
            setTimeout(() => { formStatus.innerText = ''; }, 5000);
        }, 1500);
    });
}

// --- Chatbot Widget Logic ---
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendChatBtn = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.add('open');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', type);
        msgDiv.innerText = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    "That's a great question! One of our engineers will reach out to discuss this further.",
                    "We specialize in converting manual processes into AI-driven systems in minutes.",
                    "Would you like to schedule a quick 15-minute demo call with our team?"
                ];
                const reply = responses[Math.floor(Math.random() * responses.length)];
                addMessage(reply, 'bot');
            }, 1000);
        }
    };

    sendChatBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
}

// =========================================
// BROWSE SECTION: Filter Tabs
// =========================================
const browseTabs = document.querySelectorAll('.browse-tab');
const capabilityCards = document.querySelectorAll('.capability-card');

browseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        browseTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        capabilityCards.forEach((card, i) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                // Re-trigger reveal animation with stagger
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 60);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// =========================================
// BROWSE SECTION: Stagger Reveal on Scroll
// =========================================
const capRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const allCards = [...document.querySelectorAll('.capability-card:not(.hidden)')];
            const idx = allCards.indexOf(entry.target);
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, idx * 80);
            capRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

capabilityCards.forEach(card => capRevealObserver.observe(card));


// =========================================
// ROBOT SPECS MODAL LOGIC
// =========================================
const specsModal = document.getElementById('specs-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalSpecs = document.getElementById('modal-specs');

const defaultSpecs = {
    delivery: [
        { label: "Battery Life", value: "Up to 12-24 hours" },
        { label: "Payload Capacity", value: "30kg - 300kg" },
        { label: "Navigation", value: "3D LiDAR + Vision" },
        { label: "Interaction", value: "Multimodal Voice & Touch" }
    ],
    cleaning: [
        { label: "Cleaning Efficiency", value: "1000 - 1500 ㎡/h" },
        { label: "Battery Capacity", value: "20 Ah (3-4h charge)" },
        { label: "Water Tank", value: "4L Clean / 6.5L Waste" },
        { label: "Noise Level", value: "< 76 dB(A)" }
    ],
    humanoid: [
        { label: "Degrees of Freedom", value: "40+ DOF" },
        { label: "Perception", value: "Full-body tactile & vision" },
        { label: "Actuation", value: "High-torque joint motors" },
        { label: "Autonomy", value: "Embodied AI / LLM integration" }
    ]
};

// Open modal on card click
document.querySelectorAll('.capability-card[data-category="products"]').forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('.cap-bg-img').src;
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('.cap-desc').innerText;

        modalImg.src = img;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;

        // Determine spec type
        let specType = defaultSpecs.delivery;
        const lowerDesc = desc.toLowerCase();
        if (lowerDesc.includes('clean') || lowerDesc.includes('sweep') || lowerDesc.includes('scrub') || title.toLowerCase().includes('cc1') || title.toLowerCase().includes('mt1')) {
            specType = defaultSpecs.cleaning;
        } else if (lowerDesc.includes('humanoid') || title.includes('D7') || title.includes('D9')) {
            specType = defaultSpecs.humanoid;
        } else if (title.includes('T150') || title.includes('T300') || title.includes('T600')) {
            specType = [
                { label: "Payload Capacity", value: "150kg - 600kg" },
                { label: "Navigation", value: "Autonomous VSLAM" },
                { label: "Environment", value: "Industrial / Warehouse" },
                { label: "Integration", value: "Elevator & Gate API" }
            ];
        }

        // Generate specs HTML
        modalSpecs.innerHTML = '';
        specType.forEach(spec => {
            const specDiv = document.createElement('div');
            specDiv.className = 'spec-item';
            specDiv.innerHTML = `
                <div class="spec-label">${spec.label}</div>
                <div class="spec-value">${spec.value}</div>
            `;
            modalSpecs.appendChild(specDiv);
        });

        specsModal.classList.add('open');
    });
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    specsModal.classList.remove('open');
});

specsModal.addEventListener('click', (e) => {
    if (e.target === specsModal) {
        specsModal.classList.remove('open');
    }
});
