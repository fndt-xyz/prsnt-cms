/**
 * Herond Slider Controller
 * Manages the slide transitions, dynamic label generation, 
 * and progress bar indicators.
 */

function initHeroSlider() {
    // 1. Select the newly injected elements
    const track = document.getElementById('hero-track');
    const labelWrap = document.getElementById('hero-labels');
    const barWrap = document.getElementById('hero-bars');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Safety check: if the HTML hasn't loaded properly, exit to avoid errors
    if (!track || !labelWrap || !barWrap) {
        console.error("Herond Controller: Required DOM elements not found.");
        return;
    }

    // 2. Configuration: Labels for your slides
    const slides = [
        { label: "sld_01" },
        { label: "sld_02" },
        { label: "sld_03" }
    ];

    let current = 0;
    const total = slides.length;

    /**
     * Updates the visual state of the slider
     */
    function move(index) {
        // Handle infinite loop logic
        current = (index + total) % total;
        
        // Move the track
        track.style.transform = `translateX(-${current * 100}%)`;

        // Update Text Labels (Controller 02)
        const lbls = labelWrap.querySelectorAll('button');
        lbls.forEach((l, i) => {
            if (i === current) {
                l.style.color = "#1e293b"; // slate-800
                l.style.opacity = "1";
                l.style.transform = "scale(1.1)";
            } else {
                l.style.color = "#94a3b8"; // slate-400
                l.style.opacity = "0.6";
                l.style.transform = "scale(1)";
            }
        });

        // Update Progress Bars (Controller 01)
        const bars = barWrap.querySelectorAll('button');
        bars.forEach((b, i) => {
            if (i === current) {
                b.style.width = "32px";
                b.style.backgroundColor = "#475569"; // slate-600
                b.style.opacity = "1";
            } else {
                b.style.width = "12px";
                b.style.backgroundColor = "#cbd5e1"; // slate-300
                b.style.opacity = "0.5";
            }
        });
    }

    // 3. Generate Control Elements
    labelWrap.innerHTML = '';
    barWrap.innerHTML = '';

    slides.forEach((s, i) => {
        // Create Text Label
        const lbl = document.createElement('button');
        // Applying classes from your element.css/tailwind-like setup
        lbl.className = "text-xs font-bold tracking-widest lowercase cursor-pointer transition-all duration-300";
        lbl.innerText = s.label;
        lbl.style.border = "none";
        lbl.style.background = "none";
        lbl.style.padding = "0 4px";
        lbl.onclick = (e) => { e.preventDefault(); move(i); };
        labelWrap.appendChild(lbl);

        // Add Separator |
        if (i < total - 1) {
            const sep = document.createElement('span');
            sep.innerText = "|";
            sep.className = "select-none";
            sep.style.color = "#e2e8f0";
            labelWrap.appendChild(sep);
        }

        // Create Progress Bar
        const bar = document.createElement('button');
        bar.className = "h-1.5 rounded-full cursor-pointer transition-all duration-500";
        bar.style.border = "none";
        bar.style.padding = "0";
        bar.style.margin = "0 4px";
        bar.onclick = (e) => { e.preventDefault(); move(i); };
        barWrap.appendChild(bar);
    });

    // 4. Attach Arrow Listeners
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.preventDefault();
            move(current - 1);
        };
    }
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            move(current + 1);
        };
    }

    // 5. Initialize First Slide
    move(0);
}
