/**
 * Herond Slider Controller - v0.04
 * Supports Click, Navigation, Mouse Drag, and Touch Swipe.
 * Integrated with % based infinite loop logic.
 */

function initHeroSlider() {
    const track = document.getElementById('hero-track');
    const labelWrap = document.getElementById('hero-labels');
    const barWrap = document.getElementById('hero-bars');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track || !labelWrap || !barWrap) return;

    const slides = [ { label: "sld_01" }, { label: "sld_02" }, { label: "sld_03" } ];
    let current = 0;
    const total = slides.length;

    // --- DRAG STATE ---
    let startX = 0;
    let isDragging = false;
    const threshold = 50; // "Slight drag" (50px) to trigger move

    /**
     * core move logic - handles the infinite loop
     */
    function move(index) {
        current = (index + total) % total; // The "Circle Back" logic
        track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        track.style.transform = `translateX(-${current * 100}%)`;
        updateUI();
    }

    function updateUI() {
        // Sync Labels
        labelWrap.querySelectorAll('button').forEach((l, i) => {
            l.style.color = (i === current) ? "#1e293b" : "#94a3b8";
            l.style.opacity = (i === current) ? "1" : "0.6";
            l.style.transform = (i === current) ? "scale(1.1)" : "scale(1)";
        });
        // Sync Progress Bars
        barWrap.querySelectorAll('button').forEach((b, i) => {
            b.style.width = (i === current) ? "32px" : "12px";
            b.style.backgroundColor = (i === current) ? "#475569" : "#cbd5e1";
            b.style.opacity = (i === current) ? "1" : "0.5";
        });
    }

    // --- GESTURE HANDLERS ---

    const handleStart = (e) => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        track.style.transition = "none"; // Stop transition for instant feel
    };

    const handleEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
        const diff = startX - endX;

        // Logic: If drag > threshold, use the move() modulo logic to circle back
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                move(current + 1); // Swiped Left -> Go Next
            } else {
                move(current - 1); // Swiped Right -> Go Prev
            }
        } else {
            move(current); // Snap back if drag was too small
        }
    };

    // Prevent default browser image dragging
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // --- EVENT LISTENERS ---

    // Mouse
    track.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd); // Window ensures it catches release outside track

    // Touch
    track.addEventListener('touchstart', handleStart, { passive: true });
    track.addEventListener('touchend', handleEnd);

    // --- UI GENERATOR ---
    labelWrap.innerHTML = '';
    barWrap.innerHTML = '';
    slides.forEach((s, i) => {
        const lbl = document.createElement('button');
        lbl.className = "text-xs font-bold tracking-widest lowercase cursor-pointer transition-all duration-300";
        lbl.innerText = s.label;
        lbl.style.cssText = "border:none; background:none; padding: 0 4px;";
        lbl.onclick = () => move(i);
        labelWrap.appendChild(lbl);

        if (i < total - 1) {
            const sep = document.createElement('span');
            sep.innerText = "|";
            sep.style.color = "#e2e8f0";
            labelWrap.appendChild(sep);
        }

        const bar = document.createElement('button');
        bar.className = "h-1.5 rounded-full cursor-pointer transition-all duration-500";
        bar.style.cssText = "border:none; padding:0; margin:0 4px;";
        bar.onclick = () => move(i);
        barWrap.appendChild(bar);
    });

    if (prevBtn) prevBtn.onclick = () => move(current - 1);
    if (nextBtn) nextBtn.onclick = () => move(current + 1);

    move(0);
}
