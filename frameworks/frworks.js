/* --- FRWORK CONTROLLER --- */
const Frmwrk = {
    manifest: [
        { file: "cntnt01.01.html", label: "intro", title: "frameworks overview" },
        { file: "cntnt01.02.html", label: "installation", title: "setting up prsnt" },
        { file: "cntnt01.03.html", label: "logic", title: "how it works" },
        { file: "cntnt01.04.html", label: "deployment", title: "going live" }
    ],
    currentIndex: 0,

    async init() {
        const container = document.getElementById('link-button-container');
        if (!container) return;
        this.renderSidebar();
        await this.load(0);
    },

    renderSidebar() {
        const container = document.getElementById('link-button-container');
        container.innerHTML = this.manifest.map((item, index) => `
            <button onclick="window.Frmwrk.load(${index})" 
                    class="link-item-btn ${index === this.currentIndex ? 'active' : 'inactive'}"
                    id="btn-${index}">
                ${item.label}
            </button>
        `).join('');
    },

    async load(index) {
        const item = this.manifest[index];
        const contentArea = document.getElementById('sbcnt-content-area');
        const headerArea = document.getElementById('view-title-text');

        try {
            // Using a cache-busting timestamp for localhost reliability
            const response = await fetch(`./${item.file}?t=${Date.now()}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();

            contentArea.innerHTML = html;
            headerArea.innerText = item.title;

            document.querySelectorAll('.link-item-btn').forEach(b => {
                b.classList.remove('active');
                b.classList.add('inactive');
            });
            
            const activeBtn = document.getElementById(`btn-${index}`);
            if (activeBtn) {
                activeBtn.classList.remove('inactive');
                activeBtn.classList.add('active');
            }
            
            this.currentIndex = index;
        } catch (e) {
            console.error("Frmwrk Load Error:", e);
            contentArea.innerHTML = `<div style="color:red">Error loading ${item.file}</div>`;
        }
    },

    next() { this.load((this.currentIndex + 1) % this.manifest.length); },
    prev() { this.load((this.currentIndex - 1 + this.manifest.length) % this.manifest.length); }
};

// Explicitly export to global window object
window.Frmwrk = Frmwrk;
