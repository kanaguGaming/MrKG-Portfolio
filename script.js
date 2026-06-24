document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.scroll-section');

    // 1. Dynamic Scrollspy (Highlights active nav item on scroll)
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', // Triggers when section hits the upper-middle of the screen
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to the currently viewed section's link
                const currentId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    
                    // On mobile, auto-scroll the navigation ribbon to keep active item visible
                    if (window.innerWidth <= 850) {
                        activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => scrollObserver.observe(section));

    // 2. Reveal Animations on Scroll (Premium UI touch)
    const animateItems = document.querySelectorAll('.animate-item');
    
    // Initial reset for animation items
    animateItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight stagger delay to cards appearing at the same time
                setTimeout(() => {
                    entry.target.style.animation = `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
                }, index * 100); 
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes into view
        threshold: 0.1
    });

    animateItems.forEach(item => revealObserver.observe(item));

    // 3. Mouse tracking glow for glass cards (Premium feature retained)
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
