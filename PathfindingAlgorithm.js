class PathfindingAlgorithm {
    constructor() {
        this.finished = false;
        this.startTime = null;
        this.totalTime = null;
    }

    start(startNode, endNode) {
        this.finished = false;
        this.startNode = startNode;
        this.endNode = endNode;
        this.startTime = performance.now(); // Start the timer
        this.totalTime = null;

        // Trigger the timer to start on the frontend
        this.updateTimer("start");
    }

    nextStep() {
        if (this.finished) {
            if (this.totalTime === null) {
                this.totalTime = performance.now() - this.startTime; // Calculate total time
                console.log(`Algorithm finished in ${this.totalTime.toFixed(2)} ms`);
                
                // Trigger the timer to stop on the frontend and pass the time
                this.updateTimer("stop", this.totalTime);
            }
        }
        return [];
    }

    // Dispatch custom events for timer start/stop
    updateTimer(action, time = 0) {
        if (action === "start") {
            // Trigger the timer start event
            window.dispatchEvent(new CustomEvent('timerStart'));
        } else if (action === "stop") {
            // Trigger the timer stop event and pass total time
            window.dispatchEvent(new CustomEvent('timerStop', { detail: time }));
        }
    }
}

export default PathfindingAlgorithm;
