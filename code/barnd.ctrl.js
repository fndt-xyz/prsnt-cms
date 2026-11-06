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

    // 2. Drag Logic
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false; // New flag

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false; 
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = 'auto';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', (e) => {
        isDown = false;
        slider.style.scrollBehavior = 'smooth';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        if (Math.abs(x - startX) > 5) isDragging = true; // more than 5px counts as a drag, so a slightly shaky click still opens the card
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Prevent clicks if the user was dragging
    slider.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
}
