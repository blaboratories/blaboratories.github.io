document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let isScrolling = false;
    let deceleration = 0.0005; // Initial deceleration factor
    let predictionCount = 0; // To keep track of the number of predictions made
    const interval = 100; // 0.1 seconds in milliseconds
    const someThreshold = 0.1; // Define a small value as a threshold

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = '100msWord ' + i;
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
            let lastScrollTop = currentScrollTop;
            let lastTime = touchEndTime;
            const measurement = setInterval(function() {
                const newScrollTop = wordList.scrollTop;
                const newTime = Date.now();
                const timeDiff = newTime - lastTime;
                const newVelocity = (newScrollTop - lastScrollTop) / timeDiff;

                // Predict stopping point based on deceleration
                const remainingTime = Math.abs(newVelocity / deceleration); // Time to stop
                const predictedStop = newScrollTop + (newVelocity * remainingTime) + (0.5 * deceleration * remainingTime ** 2);
                
                // Update for next interval
                lastScrollTop = newScrollTop;
                lastTime = newTime;

                // Check if scrolling has stopped
                if (Math.abs(newVelocity) < someThreshold) { // someThreshold is a small value
                    clearInterval(measurement);
                    markPredictedStop(predictedStop, predictionCount++);
                }
            }, interval);
        }
    }, false);

    function checkScrollEnd(predictedStop) {
        let currentScrollTop = wordList.scrollTop;
        setTimeout(function() {
            if (wordList.scrollTop === currentScrollTop) {
                markScrolledWord(currentScrollTop);
                adjustDecelerationFactor(currentScrollTop, predictedStop);
                isScrolling = false;
            } else {
                checkScrollEnd(predictedStop);
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

    function markPredictedStop(predictedStop, predictionNumber) {
        const itemIndex = Math.round(predictedStop / 42);
        const wordItem = wordList.children[itemIndex];
        if (wordItem) {
            wordItem.textContent += ' (PREDICTED' + predictionNumber + ')';
            wordItem.style.color = 'blue';
        }
    }

    function adjustDecelerationFactor(actualStop, predictedStop) {
        const error = actualStop - predictedStop;
        const itemIndex = Math.round(actualStop / 42);
        const wordItem = wordList.children[itemIndex];

        if (Math.abs(error) > 10) { // Threshold to avoid over-adjusting
            deceleration -= error / 10000000; // Adjust this factor based on testing
        }
        if (wordItem) {
            wordItem.textContent += ' (Error: ' + error.toFixed(2) + ', Decel: ' + deceleration.toFixed(2) + ')';
            wordItem.style.color = 'blue';
        }
    }
});
