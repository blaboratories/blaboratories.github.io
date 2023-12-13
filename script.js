document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.getElementById('wordList');
    let touchStart = 0;
    let scrollStart = 0;
    let scrollObservations = [];

    // Populate the list with random words
    for (let i = 0; i < 2000; i++) {
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = 'Word ' + i;
        wordList.appendChild(word);
    }

    wordList.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
        scrollStart = wordList.scrollTop;
    }, false);

    wordList.addEventListener('touchend', function(e) {
        const touchEnd = e.changedTouches[0].clientY;
        if (Math.abs(touchStart - touchEnd) > 100) { // Detect a fast swipe
            setTimeout(() => {
                const scrollEnd = wordList.scrollTop;
                console.log('Fast swipe detected. Start:', scrollStart, 'End:', scrollEnd);
                if (scrollObservations.length < 2) {
                    scrollObservations.push({ start: scrollStart, end: scrollEnd });
                    markStopPoint(scrollEnd);
                    console.log('Observation recorded:', scrollObservations.length);
                } else if (scrollObservations.length === 2) {
                    const predictedStop = predictStopPoint(scrollObservations);
                    console.log('Predicted stop:', predictedStop);
                    insertForceItem(predictedStop);
                }
            }, 300); // Adjust timing as needed
        }
    }, false);

    function predictStopPoint(observations) {
        const totalDistance = observations.reduce((acc, observation) => acc + (observation.end - observation.start), 0);
        return totalDistance / observations.length + scrollStart;
    }

    function insertForceItem(position) {
        const forceItem = document.createElement('div');
        forceItem.className = 'word';
        forceItem.textContent = 'FORCE';
        wordList.insertBefore(forceItem, wordList.children[Math.round(position / 50)]); // Adjust as per actual item height
        console.log('FORCE inserted at position:', position);
    }

    function markStopPoint(position) {
        const itemIndex = Math.round(position / 50); // Assuming each item is approximately 50px tall
        const itemAtStop = wordList.children[itemIndex];
        if (itemAtStop) {
            itemAtStop.textContent = 'STOP';
            itemAtStop.style.color = 'red'; // Optional: change color for visibility
        }
    }
});
