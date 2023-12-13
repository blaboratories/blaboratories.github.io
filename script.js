document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStart = 0;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = '3Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const touchEnd = e.changedTouches[0].clientY;
        if (Math.abs(touchStart - touchEnd) > 100) { // Detect a fast swipe
            // Wait for a moment to allow scrolling to stop
            setTimeout(function() {
                markScrollArea(wordList.scrollTop);
            }, 500); // Delay to account for inertial scrolling
        }
    }, false);

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
