document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let isScrolling = false;
    let decelerationFactor = 0.5; // Initial deceleration factor
    let lastPredictedStop = 0;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartTime = e.timeStamp;
        touchStartY = e.touches[0].clientY;
        isScrolling = true;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const touchEndTime = e.timeStamp;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        const initialVelocity = deltaY / deltaTime;
        const isFastSwipe = Math.abs(initialVelocity) > 2; // Adjust threshold as needed

        if (isFastSwipe) {
            const predictedStop = wordList.scrollTop + (initialVelocity * decelerationFactor * 1000);
            lastPredictedStop = predictedStop;
            markPredictedStop(predictedStop);
            checkScrollEnd();
        }
    }, false);

    function checkScrollEnd() {
        let currentScrollTop = wordList.scrollTop;
        setTimeout(function() {
            if (wordList.scrollTop === currentScrollTop) {
                markScrolledWord(currentScrollTop);
                adjustDecelerationFactor(currentScrollTop);
                isScrolling = false;
            } else {
                checkScrollEnd();
            }
        }, 150);
    }

    function markScrolledWord(scrollTop) {
        const itemIndex = Math.round(scrollTop / 42);
        clearMarks();
        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent = 'SCROLLED';
            wordItem.style.color = 'green';
        }
    }

    function markPredictedStop(predictedStop) {
        const itemIndex = Math.round(predictedStop / 42);
        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent += ' (PREDICTED)';
            wordItem.style.color = 'blue';
        }
    }

    function clearMarks() {
        const words = wordList.getElementsByClassName('word');
        for (let word of words) {
            if (word.textContent.includes('SCROLLED') || word.textContent.includes('(PREDICTED)')) {
                word.textContent = word.textContent.replace('SCROLLED', '').replace('(PREDICTED)', '').trim();
                word.style.color = '';
            }
        }
    }

    function adjustDecelerationFactor(actualStop) {
        const error = actualStop - lastPredictedStop;
        if (Math.abs(error) > 10) { // Threshold to avoid over-adjusting
            decelerationFactor += error / 1000; // Adjust this factor based on testing
        }
    }
});
