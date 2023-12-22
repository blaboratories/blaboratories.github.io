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
        word.textContent = '6Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStartTime = e.timeStamp;
        touchStartY = e.touches[0].clientY;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const startTopY = wordList.scrollTop;
        const touchEndTime = e.timeStamp;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        const initialVelocity = deltaY / deltaTime;
        const isFastSwipe = Math.abs(initialVelocity) > 1;

        if (isFastSwipe) {
            let lastScrollTop = startTopY;
            //let lastTime = touchEndTime;
            const measurement = setInterval(function() {
                const newScrollTop = wordList.scrollTop;
                //const newTime = Date.now();
                //const timeDiff = newTime - lastTime;
                //const newVelocity = (newScrollTop - lastScrollTop) / timeDiff;

                if (newScrollTop === lastScrollTop) {
                    //sampleData.push({ scrollTop: newScrollTop, time: newTime });
                    clearInterval(measurement);
                    if (predictionCount < wordList.children.length) {
                        const wordItem = wordList.children[predictionCount];
                        const deltaY = lastScrollTop - startTopY;
                        if (wordItem) {
                            wordItem.textContent = initialVelocity.toFixed(6) + ', ' + deltaY.toFixed(1);
                            wordItem.style.color = 'blue';
                        }
                    }
                    predictionCount++;
                }
                lastScrollTop = newScrollTop;
                //lastTime = newTime;
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
