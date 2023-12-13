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
                if (scrollObservations.length < 2) {
                    scrollObservations.push({ start: scrollStart, end: scrollEnd });
                    markStopPoint(scrollEnd, 'STOP ' + (scrollObservations.length));
                } else if (scrollObservations.length === 2) {
                    const predictedStop = predictStopPoint(scrollObservations);
                    insertForceItem(predictedStop);
                }
            }, 500); // Increased delay for better accuracy
        }
    }, false);

    function predictStopPoint(observations) {
        const totalDistance = observations.reduce((acc, observation) => acc + (observation.end - observation.start), 0);
        return totalDistance / observations.length + scrollStart;
    }

    function insertForceItem(position) {
        const itemIndex = Math.round(position / 50); // Assuming each item is approximately 50px tall
        const forceItem = wordList.children[itemIndex];
        if (forceItem) {
            forceItem.textContent = 'FORCE';
            forceItem.style.color = 'blue'; // Optional: change color for visibility
        }
    }

    function markStopPoint(position, text) {
        const itemIndex = Math.round(position / 50); // Assuming each item is approximately 50px tall
        const itemAtStop = wordList.children[itemIndex];
        if (itemAtStop) {
            itemAtStop.textContent = text;
            itemAtStop.style.color = 'red'; // Optional: change color for visibility
        }
    }
});
