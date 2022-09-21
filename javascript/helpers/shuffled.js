const shuffled = array.sort(() => 0.5 - Math.random());

export const weightedShuffle = (items, weights) => {
    const n = items.length;
    const nodes = new Array(n).fill(null);

    function choose(i = 0) {
        const currentWeight = nodes[i][0];
        const leftWeight = nodes[i][1];
        const rightWeight = nodes[i][2];
        const total = currentWeight + leftWeight + rightWeight;
        const r = total * Math.random();
        if (r < currentWeight) {
            nodes[i][0] = 0;
            return i;
        } else if (r < currentWeight + leftWeight) {
            const chosen = choose(2 * i + 1);
            nodes[i][1] -= weights[chosen];
            return chosen;
        } else {
            const chosen = choose(2 * i + 2);
            nodes[i][2] -= weights[chosen];
            return chosen;
        }
    }

    (function totalWeight(i = 0) {
        if (i >= n) {
            return 0;
        }
        const currentWeight = weights[i];
        const leftWeight = totalWeight(2 * i + 1);
        const rightWeight = totalWeight(2 * i + 2);
        nodes[i] = [currentWeight, leftWeight, rightWeight];

        return currentWeight + leftWeight + rightWeight;
    })();

    return items.map(() => {
        return items[choose()];
    });
};
