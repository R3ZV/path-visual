let maze = [];

function resize_maze() {
        console.log(window.innerWidth);
        console.log(window.innerHeight);
}

function display_maze() {
        const grid = document.getElementById("grid");
        for (let row in maze) {
                for (let cell in row) {
                        const grid_cell = document.createElement("div");
                        if (cell.color == "black") {
                        } else if (cell.color == "white") {
                        } else if (cell.color == "red") {
                        } else if (cell.color == "blue") {
                        }
                        grid.appendChild(grid_cell);
                }
        }
}

function init_maze(rows, cols) {
        for (let row = 0; row < rows; ++row) {
                for (let col = 0; col < cols; ++col) {
                        maze.append(cell);
                }
        }
        display_maze(rows, cols);
}

function generate_maze() {
        // TOOD:
}


window.onload = function() {
        window.onresize = resize_maze;
        maze = init_maze();

        const random_btn = document.getElementById("random-btn");
        random_btn.addEventListener("click", () => {
                generate_maze();
        });

        const solve_btn = document.getElementById("solve-btn");
        solve_btn.addEventListener("click", () => {
                const select_input = document.getElementById("algorithms");
                const selected_algorithm = select_input.value;
                if (selected_algorithm == "bfs") {
                        // TODO:
                } else if (selected_algorithm == "dfs") {
                        // TODO:
                } else {
                        // TODO:
                }
        });
}
