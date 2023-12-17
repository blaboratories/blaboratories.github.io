document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime, touchStartY, touchEndTime, touchEndY;
    let decelerationFactor = 0.5; // Initial guess for the deceleration factor
    let isScrolling = false;

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
        touchEndTime = e.timeStamp;
        touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        const initialVelocity = deltaY / deltaTime;
        const isFastSwipe = Math.abs(initialVelocity) > 0.5; // Adjust this threshold as needed

        if (isFastSwipe) {
            const predictedStop = wordList.scrollTop + (initialVelocity * decelerationFactor * 1000); // Adjust for scale
            markPredictedStop(predictedStop);
            checkScrollEnd(predictedStop);
        }
    }, false);

    function checkScrollEnd(predictedStop) {
        setTimeout(function() {
            if (isScrolling) {
                const actualStop = wordList.scrollTop;
                adjustDecelerationFactor(predictedStop, actualStop);
                isScrolling = false;
            } else {
                checkScrollEnd(predictedStop); // Keep checking until scrolling stops
            }
        }, 150);
    }

    function markPredictedStop(predictedStop) {
        const itemIndex = Math.round(predictedStop / 42);
        clearPredictedMarks();
        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent = 'PREDICTED';
            wordItem.style.color = 'blue';
        }
    }

    function clearPredictedMarks() {
        const words = wordList.getElementsByClassName('word');
        for (let word of words) {
            if (word.textContent.includes('PREDICTED')) {
                word.textContent = word.textContent.replace('PREDICTED', '');
                word.style.color = '';
            }
        }
    }

    function adjustDecelerationFactor(predictedStop, actualStop) {
        // Adjust the deceleration factor based on the difference between predicted and actual stop
        const error = actualStop - predictedStop;
        if (Math.abs(error) > 10) { // Threshold to avoid over-adjusting for small errors
            decelerationFactor += error / 1000; // Adjust this factor based on testing
        }
    }
});
