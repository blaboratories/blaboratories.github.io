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

document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStartTime = 0;
    let touchStartY = 0;
    let sampleData = [];
    let predictionCount = 0;
    const interval = 100; // Reduced to 0.1 seconds

    for (let i = 0; i < 4000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartTime = e.timeStamp;
        touchStartY = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const touchEndTime = e.timeStamp;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        const initialVelocity = deltaY / deltaTime;
        const isFastSwipe = Math.abs(initialVelocity) > 1;

        if (isFastSwipe) {
            let lastScrollTop = wordList.scrollTop;
            let lastTime = touchEndTime;

            const measurement = setInterval(function() {
                const newScrollTop = wordList.scrollTop;
                const newTime = Date.now();
                const timeDiff = newTime - lastTime;
                const newVelocity = (newScrollTop - lastScrollTop) / timeDiff;

                if (Math.abs(newVelocity) < 1) {
                    sampleData.push({ scrollTop: newScrollTop, time: newTime });
                    if (sampleData.length === 100) {
                        clearInterval(measurement);
                    }
                }

                if (predictionCount < wordList.children.length) {
                    const wordItem = wordList.children[predictionCount];
                    if (wordItem) {
                        wordItem.textContent += ' ' + predictionCount + ', ' + newTime + ', ' + newScrollTop + ', ' + newVelocity;
                        wordItem.style.color = 'blue';
                    }
                }
                predictionCount++;
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
