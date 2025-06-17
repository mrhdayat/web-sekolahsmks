console.log("Landing page script loaded.");

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
    });

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIconLight = document.getElementById('theme-toggle-icon-light');
    const themeToggleIconDark = document.getElementById('theme-toggle-icon-dark');
    const htmlElement = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            if(themeToggleIconLight) themeToggleIconLight.classList.add('hidden');
            if(themeToggleIconDark) themeToggleIconDark.classList.remove('hidden');
        } else {
            htmlElement.classList.remove('dark');
            if(themeToggleIconLight) themeToggleIconLight.classList.remove('hidden');
            if(themeToggleIconDark) themeToggleIconDark.classList.add('hidden');
        }
    }

    let currentTheme = localStorage.getItem('theme') ||
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            lucide.createIcons(); // Re-render icons if their visibility changed
        });
    }

    // Hero Title Animation
    gsap.to("#hero-title", {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: "expo.out",
        delay: 0.5
    });

    // Hero Slogan Animation
    gsap.to("#hero-slogan", {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: "expo.out",
        delay: 1.0
    });

    // Scroll Down Button Animation
    gsap.to("#scroll-down-button", {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: "expo.out",
        delay: 1.5
    });

    // Parallax effect for hero background
    const heroBackground = document.getElementById('hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
    }

    // Lottie Animation
    const lottieContainer = document.getElementById('lottie-animation-container');
    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json'
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const scrolled = (scrollTop / scrollHeight) * 100;
                scrollIndicator.style.width = scrolled + '%';
            } else {
                scrollIndicator.style.width = '0%';
            }
        });
    }

    // Initialize Lucide Icons (important to call after DOM modifications and theme is set)
    lucide.createIcons();
});
