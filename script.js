document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to re-trigger animations inside a container
    const triggerAnimations = (container) => {
        const animatedItems = container.querySelectorAll('.animate-item');
        animatedItems.forEach((item, index) => {
            // Remove animation
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            
            // Add animation back with a stagger delay
            item.style.animation = `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
            item.style.animationDelay = `${index * 0.1}s`; // 100ms stagger
        });
    };

    // Initialize animation for home tab on load
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) triggerAnimations(activeTab);

    // Tab Switching Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            
            // Show target section
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                // Trigger staggered entrance animation
                triggerAnimations(targetSection);
            }

            // Scroll to top of container smoothly on mobile
            if (window.innerWidth <= 850) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add subtle mouse tracking glow to cards (Premium UI touch)
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});