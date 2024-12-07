import PathfindingAlgorithm from "./PathfindingAlgorithm";

class FringeSearch extends PathfindingAlgorithm {
    constructor() {
        super();
        this.openList = [];
        this.closedList = new Set();
        this.parentMap = new Map();
        this.bestPath = [];
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.openList = [startNode]; // Initially, we add the start node to the open list
        this.closedList.clear();
        this.parentMap.clear();
        this.bestPath = [];

        while (this.openList.length > 0) {
            // Select the node from the fringe with the highest priority
            const currentNode = this.getNextNode();

            if (currentNode === this.endNode) {
                this.reconstructPath(currentNode);
                break;
            }

            this.expandNode(currentNode);
        }

        return this.bestPath;
    }

    // Method to get the node from the open list with the highest priority
    getNextNode() {
        // Sort openList based on a heuristic or distance measure (fringe value)
        this.openList.sort((a, b) => a.heuristicValue - b.heuristicValue);
        return this.openList.shift(); // Remove and return the node with the highest priority
    }

    // Expand the current node by exploring its neighbors
    expandNode(currentNode) {
        this.closedList.add(currentNode);

        const neighbors = currentNode.neighbors;
        for (let neighbor of neighbors) {
            if (!this.closedList.has(neighbor.node)) {
                // Calculate heuristic or fringe value for this neighbor
                neighbor.node.heuristicValue = this.calculateHeuristic(neighbor.node);

                // If the neighbor is not in the open list, add it
                if (!this.openList.includes(neighbor.node)) {
                    this.openList.push(neighbor.node);
                    this.parentMap.set(neighbor.node, currentNode);
                }
            }
        }
    }

    // Reconstruct the best path from the end node to the start node
    reconstructPath(currentNode) {
        const path = [];
        while (currentNode !== this.startNode) {
            path.unshift(currentNode);
            currentNode = this.parentMap.get(currentNode);
        }
        path.unshift(this.startNode); // Add the start node at the beginning
        this.bestPath = path;
    }

    // Calculate the heuristic value (using an example Euclidean distance for simplicity)
    calculateHeuristic(node) {
        const dx = Math.abs(node.x - this.endNode.x);
        const dy = Math.abs(node.y - this.endNode.y);
        return dx + dy; // Manhattan distance (can be replaced with other heuristics)
    }

    nextStep() {
        return this.bestPath;
    }
}

export default FringeSearch;
