class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                nav {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                }
.nav-link {
                    transition: all 0.3s ease;
                    position: relative;
                }
                .nav-link:hover {
                    color: white;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 3px;
                    bottom: -5px;
                    left: 0;
                    background-color: #fbbf24;
                    border-radius: 2px;
transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .resume-btn {
                    transition: all 0.3s ease;
                }
                .resume-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 10px 15px rgba(251, 191, 36, 0.3);
}
            </style>
            <nav class="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
                <div class="container mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="#projects" class="nav-link text-gray-700">Projects</a>
                            <a href="#about" class="nav-link text-gray-700">About</a>
                            <a href="#resume" class="resume-btn px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                                Resume
                            </a>
                        </div>
<button class="md:hidden focus:outline-none">
                            <i data-feather="menu" class="w-6 h-6 text-gray-700"></i>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('custom-navbar', CustomNavbar);