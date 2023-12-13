document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartY = 0;
    let touchEndY = 0;
    let isScrolling;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        const isFastSwipe = Math.abs(touchStartY - touchEndY) > 100;
        if (isFastSwipe) {
            if (isScrolling) {
                clearTimeout(isScrolling);
            }
            checkScrollEnd();
        }
    }, false);

    function checkScrollEnd() {
        let lastScrollTop = wordList.scrollTop;
        isScrolling = setTimeout(function() {
            if (wordList.scrollTop === lastScrollTop) {
                // Adjust marking based on scroll direction
                const scrollDirection = touchStartY > touchEndY ? 'down' : 'up';
                markScrollArea(lastScrollTop, scrollDirection);
            } else {
                checkScrollEnd(); // Keep checking until scrolling stops
            }
        }, 150); // Check interval
    }

    function markScrollArea(scrollTop, scrollDirection) {
        const itemIndex = scrollDirection === 'down' 
                          ? Math.round((scrollTop + wordList.clientHeight) / 50) // Mark bottom of view for downward scroll
                          : Math.round(scrollTop / 50); // Mark top of view for upward scroll

        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent = 'SCROLLED';
            wordItem.style.color = 'green'; // Change color for visibility
        }
    }
});
