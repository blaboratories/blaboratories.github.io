document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let isScrolling = false;
    let sampleData = []; // Array to store samples
    let predictionCount = 0; // To keep track of the number of predictions made
    const interval = 1000; // 1 seconds in milliseconds

    // Populate the list with random words
    for (let i = 0; i < 4000; i++) {
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
        const isFastSwipe = Math.abs(initialVelocity) > 1; // Adjust threshold as needed

        if (isFastSwipe) {
            //let lastScrollTop = currentScrollTop;
            let lastTime = touchEndTime;
            const measurement = setInterval(function() {
                const newScrollTop = wordList.scrollTop;
                const newTime = Date.now();
                const timeDiff = newTime - lastTime;
                const newVelocity = (newScrollTop - lastScrollTop) / timeDiff;
                if (newVelocity === 0) {
                    clearInterval(measurement);
                }
               // Log data for analysis
                console.log(predictionCount + ', ' + newTime + ', ' + newScrollTop + ', ' + newVelocity);
                const wordItem = wordList.children[predictionCount];
                if (wordItem) {
                    wordItem.textContent += predictionCount + ', ' + newTime + ', ' + newScrollTop + ', ' + newVelocity;
                    wordItem.style.color = 'blue';
                }
                // Check if scrolling has stopped
                if (Math.abs(newVelocity) < 1) { // someThreshold is a small value
                    sampleData.push({ scrollTop: newScrollTop, time: newTime });
                    if (sampleData.length === 100) {
                        //const predictedStop = estimateStoppingPosition(sampleData);
                        //markPredictedStop(predictedStop, predictionCount++);
                    }
                      // Store all newScrollTop and newTime in a vector and at each multiple of 10 samples added
                    // use all samples stored so far to estimate where it will stop
                    
                    //markPredictedStop(predictedStop, predictionCount++);
                }
                predictionCount++
                // Update for next interval
                lastScrollTop = newScrollTop;
                lastTime = newTime;

            }, interval);
        }
    }, false);

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
});
