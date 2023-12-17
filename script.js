document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let touchEndTime = 0;
    let touchEndY = 0;
    let isScrolling = false;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'bWord ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartTime = e.timeStamp;
        touchStartY = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        touchEndTime = e.timeStamp;
        touchEndY = e.changedTouches[0].clientY;
        const deltaY = Math.abs(touchStartY - touchEndY);
        const deltaTime = touchEndTime - touchStartTime;
        const scrollSpeed = deltaY / deltaTime;
        const isFastSwipe = scrollSpeed > 100; // Adjust these values as needed
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
        const itemIndex = Math.round(scrollTop / 42); // Mark top of view for upward scroll

        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent = 'SCROLLED';
            wordItem.style.color = 'green'; // Change color for visibility
        }
    }
});
