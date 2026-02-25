/**
 * ============================================================
 *  INTERVAL TREE — Augmented BST for O(log N) Overlap Detection
 * ============================================================
 *
 *  Each node stores a booking interval [low, high) and records
 *  the maximum `high` value anywhere in its subtree. This lets
 *  the search prune entire subtrees in logarithmic time.
 *
 *  Convention: intervals are HALF-OPEN  →  [low, high)
 *  Two intervals [a,b) and [c,d) overlap  iff  a < d  AND  c < b
 *  This means "touching" (checkout == checkin) is NOT a conflict.
 *
 *  Time complexity (average-case balanced tree):
 *    insert        — O(log N)
 *    findOverlap   — O(log N)
 *    findAllOverlaps — O(K · log N)  where K = number of overlaps
 */

class IntervalTreeNode {
    /**
     * @param {{ low: number, high: number }} interval  Epoch-ms timestamps
     * @param {string} bookingId  MongoDB ObjectId string
     */
    constructor(interval, bookingId) {
        this.interval = interval;   // { low, high }
        this.bookingId = bookingId;
        this.max = interval.high;  // max high in this subtree
        this.left = null;
        this.right = null;
    }
}

class IntervalTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    // ─── Public API ─────────────────────────────────────────────

    /**
     * Insert a new booking interval into the tree.
     * @param {{ low: number, high: number }} interval
     * @param {string} bookingId
     */
    insert(interval, bookingId) {
        this.root = this._insert(this.root, interval, bookingId);
        this.size++;
    }

    /**
     * Return the FIRST overlapping node, or null if the slot is free.
     * Uses strict overlap: a < d && c < b  (touching is OK).
     * @param {{ low: number, high: number }} interval
     * @returns {IntervalTreeNode|null}
     */
    findOverlap(interval) {
        return this._findOverlap(this.root, interval);
    }

    /**
     * Collect ALL overlapping nodes (useful for UI feedback).
     * @param {{ low: number, high: number }} interval
     * @returns {IntervalTreeNode[]}
     */
    findAllOverlaps(interval) {
        const results = [];
        this._findAllOverlaps(this.root, interval, results);
        return results;
    }

    /**
     * Build a tree from an array of booking documents.
     * @param {Array<{ _id: string, startDate: Date, endDate: Date }>} bookings
     * @returns {IntervalTree}
     */
    static fromBookings(bookings) {
        const tree = new IntervalTree();
        for (const b of bookings) {
            tree.insert(
                { low: new Date(b.startDate).getTime(), high: new Date(b.endDate).getTime() },
                b._id.toString()
            );
        }
        return tree;
    }

    // ─── Private helpers ────────────────────────────────────────

    /**
     * BST insert keyed on interval.low; propagate max upward.
     */
    _insert(node, interval, bookingId) {
        if (node === null) {
            return new IntervalTreeNode(interval, bookingId);
        }

        if (interval.low < node.interval.low) {
            node.left = this._insert(node.left, interval, bookingId);
        } else {
            node.right = this._insert(node.right, interval, bookingId);
        }

        // Update the max value for this subtree
        if (node.max < interval.high) {
            node.max = interval.high;
        }

        return node;
    }

    /**
     * Two half-open intervals [a, b) and [c, d) overlap iff a < d AND c < b.
     * Touching (b === c) is NOT an overlap — allows same-day checkout / checkin.
     */
    _doOverlap(i1, i2) {
        return i1.low < i2.high && i2.low < i1.high;
    }

    /**
     * Search for the first overlapping interval.
     *
     * Algorithm:
     *   - If current node overlaps → return it.
     *   - If left subtree exists AND left.max > interval.low →
     *       an overlap MIGHT exist in the left subtree → go left.
     *   - Otherwise → go right.
     */
    _findOverlap(node, interval) {
        if (node === null) return null;

        // Check current node
        if (this._doOverlap(node.interval, interval)) {
            return node;
        }

        // If left child's max is strictly greater than interval.low,
        // there could be an overlap in the left subtree.
        if (node.left !== null && node.left.max > interval.low) {
            return this._findOverlap(node.left, interval);
        }

        // Otherwise search the right subtree
        return this._findOverlap(node.right, interval);
    }

    /**
     * Collect every overlapping interval (searches both subtrees).
     */
    _findAllOverlaps(node, interval, results) {
        if (node === null) return;

        if (this._doOverlap(node.interval, interval)) {
            results.push(node);
        }

        // Prune left subtree only if max <= interval.low
        if (node.left !== null && node.left.max > interval.low) {
            this._findAllOverlaps(node.left, interval, results);
        }

        // Prune right subtree only if the node's low >= interval.high
        // (all nodes in the right subtree have low >= node.interval.low)
        if (node.right !== null && node.interval.low < interval.high) {
            this._findAllOverlaps(node.right, interval, results);
        }
    }
}

module.exports = IntervalTree;
