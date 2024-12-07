import PathfindingAlgorithm from "./PathfindingAlgorithm";

class DStarLite extends PathfindingAlgorithm {
    constructor() {
        super();
        this.openList = new Set();
        this.closedList = new Set();
        this.km = 0; // Key modifier, part of D* Lite
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.openList.clear();
        this.closedList.clear();
        this.km = 0;

        // Set up start and end node information
        this.startNode = startNode;
        this.endNode = endNode;

        this.startNode.g = 0; // g-value is the cost-to-come
        this.startNode.rhs = 0; // rhs value, part of D* Lite
        this.startNode.key = this.calculateKey(this.startNode);

        this.openList.add(this.startNode);

        // Initialize end node's rhs and g-values
        this.endNode.g = Infinity;
        this.endNode.rhs = Infinity;
        this.endNode.key = this.calculateKey(this.endNode);
    }

    nextStep() {
        if (this.openList.size === 0) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];
        let currentNode = this.getBestNodeFromOpenList();
        if (!currentNode) return updatedNodes;

        // Update the node status
        currentNode.visited = true;
        const refEdge = currentNode.edges.find(e => e.getOtherNode(currentNode) === currentNode.referer);
        if (refEdge) refEdge.visited = true;

        if (currentNode.id === this.endNode.id) {
            this.finished = true;
            return [currentNode]; // Path found
        }

        // Update neighbors based on the current node
        updatedNodes.push(...this.updateNeighbors(currentNode));

        return updatedNodes;
    }

    // Update the neighbors, modify their rhs and g values
    updateNeighbors(node) {
        const updatedNodes = [];

        for (const n of node.neighbors) {
            const neighbor = n.node;
            const edge = n.edge;

            const newRHS = Math.min(neighbor.g + edge.weight, neighbor.rhs);
            if (newRHS < neighbor.rhs) {
                neighbor.rhs = newRHS;
                neighbor.parent = node;
                neighbor.key = this.calculateKey(neighbor);
                if (!this.closedList.has(neighbor)) {
                    this.openList.add(neighbor);
                }
            }

            updatedNodes.push(neighbor);
        }

        return updatedNodes;
    }

    // Compute the key for a node, part of D* Lite
    calculateKey(node) {
        const gValue = node.g === Infinity ? node.rhs : node.g;
        const hValue = gValue + node.distanceToEnd; // Estimate of cost from node to goal
        return [Math.min(gValue, hValue + this.km), Math.min(gValue, hValue)];
    }

    // Get the best node from the open list based on its key
    getBestNodeFromOpenList() {
        let bestNode = null;
        let bestKey = [Infinity, Infinity];

        this.openList.forEach(node => {
            const key = node.key;
            if (key[0] < bestKey[0] || (key[0] === bestKey[0] && key[1] < bestKey[1])) {
                bestNode = node;
                bestKey = key;
            }
        });

        if (bestNode) {
            this.openList.delete(bestNode);
        }

        return bestNode;
    }

    // Replan in case of changes in the environment
    replan() {
        this.km += 1;
        this.openList.clear();
        this.startNode.key = this.calculateKey(this.startNode);
        this.openList.add(this.startNode);
    }
}

export default DStarLite;
