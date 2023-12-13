document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStart = 0;
    let isScrolling;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = '4Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const touchEnd = e.changedTouches[0].clientY;
        if (Math.abs(touchStart - touchEnd) > 100) { // Detect a fast swipe
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
                markScrollArea(lastScrollTop);
            } else {
                checkScrollEnd(); // Keep checking until scrolling stops
            }
        }, 100); // Check every 100 milliseconds
    }

    function markScrollArea(scrollTop) {
        const viewHeight = wordList.clientHeight;
        const startIdx = Math.floor(scrollTop / 50);
        const endIdx = Math.min(startIdx + Math.floor(viewHeight / 50), 2000);
        for (let i = startIdx; i < endIdx; i++) {
            const wordItem = wordList.children[i];
            if (wordItem) {
                wordItem.textContent = 'SCROLLED';
                wordItem.style.color = 'green'; // Change color for visibility
            }
        }
    }
});
