document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let isScrolling = false;
    let deceleration = 0.5; // Initial deceleration factor
    let lastPredictedStop = 0;

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = '1Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartTime = e.timeStamp;
        touchStartY = e.touches[0].clientY;
        isScrolling = true;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        let currentScrollTop = wordList.scrollTop;
        const touchEndTime = e.timeStamp;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        const initialVelocity = deltaY / deltaTime;
        const isFastSwipe = Math.abs(initialVelocity) > 2; // Adjust threshold as needed

        if (isFastSwipe) {
const predictedStop = currentScrollTop + (-(initialVelocity ** 2) / (2 * deceleration));
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

    function adjustDecelerationFactor(actualStop) {
        const error = actualStop - lastPredictedStop;
        const itemIndex = Math.round(actualStop / 42);
        const wordItem = wordList.children[itemIndex];

        if (Math.abs(error) > 10) { // Threshold to avoid over-adjusting
            deceleration -= error / 1000; // Adjust this factor based on testing
        }
        if (wordItem) {
            wordItem.textContent += ' (Error: ' + error.toFixed(2) + ', Decel: ' + deceleration.toFixed(2) + ')';
            wordItem.style.color = 'blue';
        }
    }
});
