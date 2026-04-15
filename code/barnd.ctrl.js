function initBarndCarousel() {
    const slider = document.getElementById('barnd-scroll');
    const prevBtn = document.getElementById('barnd-prev');
    const nextBtn = document.getElementById('barnd-next');

    if (!slider || !prevBtn || !nextBtn) return;

    // 1. Button Logic
    function scroll(direction) {
        const offset = direction === 'left' ? -slider.clientWidth : slider.clientWidth;
        slider.scrollBy({ left: offset, behavior: 'smooth' });
    }

    prevBtn.onclick = () => scroll('left');
    nextBtn.onclick = () => scroll('right');

    // 2. Mouse Drag Logic (for Desktop)
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });
}
