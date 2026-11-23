document.addEventListener("DOMContentLoaded", () => {
    setupContactForm();
    setupThemeToggle();
    setupMobileMenu();
    setupSmoothNavigation();
    setupSkillAnimation();
});

function setupContactForm() {
    const form = document.querySelector("form");

    if (!form) return;

    const fields = [
        {
            input: document.getElementById("name"),
            message: "Por favor, preencha o seu nome."
        },
        {
            input: document.getElementById("email"),
            message: "Por favor, insira um email válido.",
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        },
        {
            input: document.getElementById("subject"),
            message: "Por favor, preencha o assunto."
        },
        {
            input: document.getElementById("message"),
            message: "Por favor, escreva sua mensagem."
        }
    ];

    function showError(input, message) {
        input.classList.add("border-red-500");

        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-message")) {
            error = document.createElement("div");
            error.className = "error-message text-sm text-red-500 mt-1";
            input.parentNode.appendChild(error);
        }

        error.textContent = message;
    }

    function showSuccess(message) {
        const successMessage = document.createElement("div");
        successMessage.className = "success-message text-sm text-green-500 mt-2";
        successMessage.textContent = message;
        form.appendChild(successMessage);

        setTimeout(() => successMessage.remove(), 5000);
    }

    function clearError(input) {
        input.classList.remove("border-red-500");

        const error = input.nextElementSibling;
        if (error && error.classList.contains("error-message")) {
            error.remove();
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = true;

        fields.forEach(({ input, message, validate }) => {
            const value = input.value.trim();
            clearError(input);

            if (value === "" || (validate && !validate(value))) {
                showError(input, message);
                isValid = false;
            }
        });

        if (!isValid) return;

        showSuccess("Mensagem enviada com sucesso!");
        form.reset();
        fields.forEach(({ input }) => clearError(input));
    });
}

function setupThemeToggle() {
    const html = document.documentElement;
    const userPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && userPrefersDark)) {
        html.classList.add("dark");
    }

    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        html.classList.toggle("dark");
        localStorage.setItem(
            "theme",
            html.classList.contains("dark") ? "dark" : "light"
        );
    });
}

function setupMobileMenu() {
    const button = document.getElementById("mobileMenuButton");
    const menu = document.getElementById("mobileMenu");

    if (!button || !menu) return;

    button.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
}

function setupSmoothNavigation() {
    const mobileMenu = document.getElementById("mobileMenu");

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            event.preventDefault();

            const targetId = anchor.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            mobileMenu?.classList.add("hidden");
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        });
    });
}

function setupSkillAnimation() {
    const skillsSection = document.getElementById("skills");
    const skillBars = document.querySelectorAll(".skill-progress");

    if (!skillsSection || !skillBars.length || !("IntersectionObserver" in window)) {
        return;
    }

    const animateSkillBars = () => {
        skillBars.forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = "0";
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animateSkillBars();
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    observer.observe(skillsSection);
}
