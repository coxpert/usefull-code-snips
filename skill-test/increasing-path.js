'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'paths' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts 2D_INTEGER_ARRAY grid as parameter.
 */

const savedPathCount = [];

function getAvailablePath(grid, x, y) {

    if (!savedPathCount[x]) {
        savedPathCount[x] = [];
    }

    if (savedPathCount[x][y]) {
        return savedPathCount[x][y]
    }

    savedPathCount[x][y] = 0

    const currentValue = grid[x][y];

    if (y > 0) {
        const topValue = grid[x][y - 1];
        if (topValue && topValue > currentValue) {
            savedPathCount[x][y]++;
            savedPathCount[x][y] += getAvailablePath(grid, x, y - 1)
        }
    }

    if (x > 0) {
        const leftValue = grid[x - 1][y];
        if (leftValue && leftValue > currentValue) {
            savedPathCount[x][y]++;
            savedPathCount[x][y] += getAvailablePath(grid, x - 1, y)
        }
    }

    if (grid[x]) {
        const rightValue = grid[x][y + 1];
        if (rightValue && rightValue > currentValue) {
            savedPathCount[x][y]++;
            savedPathCount[x][y] += getAvailablePath(grid, x, y + 1)
        }
    }

    if (grid[x + 1]) {
        const bottomValue = grid[x + 1][y];
        if (bottomValue && bottomValue > currentValue) {
            savedPathCount[x][y]++;
            savedPathCount[x][y] += getAvailablePath(grid, x + 1, y)
        }
    }

    return savedPathCount[x][y];
}

function paths(grid) {
    // Write your code here
    let pathCount = 0
    for (let x = 0; x < grid.length; x++) {

        for (let y = 0; y < grid[x].length; y++) {
            pathCount += getAvailablePath(grid, x, y);
        }
    }
    return pathCount;
}


function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const gridRows = parseInt(readLine().trim(), 10);

    const gridColumns = parseInt(readLine().trim(), 10);

    let grid = Array(gridRows);

    for (let i = 0; i < gridRows; i++) {
        grid[i] = readLine().replace(/\s+$/g, '').split(' ').map(gridTemp => parseInt(gridTemp, 10));
    }

    const result = paths(grid);

    ws.write(result + '\n');

    ws.end();
}