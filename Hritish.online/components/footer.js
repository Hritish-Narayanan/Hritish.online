class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }
                .social-icon {
                    transition: all 0.3s ease;
                }
                .social-icon:hover {
                    transform: translateY(-3px);
                    color: #5b21b6;
                }
            </style>
            <footer class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 border-t border-gray-700">
<div class="container mx-auto px-6">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="mb-6 md:mb-0">
                            <h2 class="text-2xl font-bold flex items-center gap-2">
                                <i data-feather="user" class="w-6 h-6 text-amber-400"></i>
                                <span>Hritish Narayanan</span>
                            </h2>
                            <p class="text-gray-300 mt-2">Software Developer | Security Enthusiast</p>
</div>
                        <div class="flex space-x-6 animate-pulse">
                            <a href="https://github.com/Hritish-Narayanan" class="social-icon text-gray-400 hover:text-white">
                                <i data-feather="github" class="w-5 h-5"></i>
                            </a>
                            <a href="https://www.linkedin.com/" class="social-icon text-gray-400 hover:text-white">
                                <i data-feather="linkedin" class="w-5 h-5"></i>
                            </a>
                            <a href="https://twitter.com/" class="social-icon text-gray-400 hover:text-white">
                                <i data-feather="twitter" class="w-5 h-5"></i>
                            </a>
                            <a href="mailto:hritishnarayanan@gmail.com" class="social-icon text-gray-400 hover:text-white">
                                <i data-feather="mail" class="w-5 h-5"></i>
</a>
                        </div>
                    </div>
                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p class="flex items-center justify-center gap-1">
                            <i data-feather="code" class="w-4 h-4 text-amber-400"></i>
                            <span>© ${new Date().getFullYear()} Hritish Narayanan</span>
</p>
</div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);