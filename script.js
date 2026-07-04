document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navOverlay = document.getElementById("navOverlay");

    const demoModal = document.getElementById("demoModal");
    const demoOverlay = document.getElementById("demoOverlay");
    const closeDemo = document.getElementById("closeDemo");
    const closeDemoSecondary = document.getElementById("closeDemoSecondary");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const demoStatus = document.getElementById("demoStatus");
    const viewLiveBtn = document.getElementById("viewLiveBtn");

    const scrollProgressBar = document.getElementById("scrollProgressBar");
    const backToTop = document.getElementById("backToTop");

    const revealElements = document.querySelectorAll(".reveal");
    const liveDemoButtons = document.querySelectorAll(".live-demo-btn");
    const navLinksAnchors = document.querySelectorAll(".nav-links a");
    const renderAppURL = "https://ai-resume-analyser-y5cv.onrender.com/";


    const supportsIntersectionObserver = "IntersectionObserver" in window;

    function setNavState(isOpen) {
        hamburger.classList.toggle("active", isOpen);
        navLinks.classList.toggle("active", isOpen);
        navOverlay.classList.toggle("active", isOpen);
        navOverlay.hidden = !isOpen;
        hamburger.setAttribute("aria-expanded", String(isOpen));
        body.style.overflow = isOpen ? "hidden" : "";
    }

    function closeMenu() {
        setNavState(false);
    }

    if (hamburger && navLinks && navOverlay) {
        hamburger.addEventListener("click", () => {
            const isOpen = !navLinks.classList.contains("active");
            setNavState(isOpen);
        });

        navOverlay.addEventListener("click", closeMenu);

        navLinksAnchors.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });
    }

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            closeModal();
        }
    });

    if (revealElements.length) {
        if (supportsIntersectionObserver) {
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.16 });

            revealElements.forEach((element) => observer.observe(element));
        } else {
            revealElements.forEach((element) => element.classList.add("show"));
        }
    }

    function updateScrollUI() {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        const progress = Math.min((scrollTop / maxScroll) * 100, 100);

        if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
        if (backToTop) backToTop.classList.toggle("active", scrollTop > 500);

        const sections = document.querySelectorAll("main section[id]");
        let currentId = "";

        sections.forEach((section) => {
            const top = section.offsetTop - 140;
            if (scrollTop >= top) currentId = section.id;
        });

        navLinksAnchors.forEach((anchor) => {
            const hrefId = anchor.getAttribute("href")?.slice(1);
            anchor.classList.toggle("active", hrefId === currentId);
        });
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const navbar = document.querySelector(".navbar");
            const navbarHeight = navbar ? navbar.offsetHeight + 20 : 100;
            const targetTop = window.scrollY + target.getBoundingClientRect().top - navbarHeight;

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: "smooth"
            });

            closeMenu();
        });
    });
});
