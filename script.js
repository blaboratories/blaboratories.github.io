document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStart = 0;
    let scrollStart = 0;
    let scrollEnd = 0;
    let scrollObservations = [];

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'Word ' + i;
        wordList.appendChild(word);
    }

    // Detect touch and scroll start
    wordList.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
        scrollStart = wordList.scrollTop;
    }, false);

    // Detect touch end and scroll end
    wordList.addEventListener('touchend', function(e) {
        touchEnd = e.changedTouches[0].clientY;
        if (Math.abs(touchStart - touchEnd) > 100) { // Detect a fast swipe
            setTimeout(() => {
                scrollEnd = wordList.scrollTop;
                if (scrollObservations.length < 2) {
                    scrollObservations.push({ start: scrollStart, end: scrollEnd });
                } else if (scrollObservations.length === 2) {
                    const predictedStop = predictStopPoint(scrollObservations);
                    insertForceItem(predictedStop);
                }
            }, 300); // Wait a bit for the scroll to stop
        }
    }, false);

    function predictStopPoint(observations) {
        // Simple average calculation for prediction
        const totalDistance = observations.reduce((acc, observation) => acc + (observation.end - observation.start), 0);
        return totalDistance / observations.length + scrollStart;
    }

    function insertForceItem(position) {
        // Logic to insert 'FORCE' item at the predicted position
        const forceItem = document.createElement('div');
        forceItem.className = 'word';
        forceItem.textContent = 'FORCE';
        wordList.insertBefore(forceItem, wordList.children[Math.round(position / 50)]); // Assuming each item is approximately 50px tall
    }
});
