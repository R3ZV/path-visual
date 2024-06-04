const maze_width = 76;
const maze_height = 30;

// const maze_width = 5;
// const maze_height = 5;

const maze = Array.from({ length: maze_height }, (_) =>
    Array(maze_width).fill(0),
);

/// returns a random number between [min, max)
function random_in_range(min, max) {
    const min_ceiled = Math.ceil(min);
    const max_floored = Math.floor(max);
    return Math.floor(Math.random() * (max_floored - min_ceiled) + min_ceiled);
}

/// selectes the starting point and the point we want to reach
function pick_start_end_pos() {
    const start_cell_row = random_in_range(0, maze.length);
    const start_cell_col = random_in_range(0, maze[0].length);
    maze[start_cell_row][start_cell_col] = "S";

    let end_cell_row = random_in_range(0, maze.length);
    let end_cell_col = random_in_range(0, maze[0].length);

    while (end_cell_col === start_cell_col && end_cell_row === start_cell_row) {
        end_cell_row = random_in_range(0, maze.length);
        end_cell_col = random_in_range(0, maze[0].length);
    }
    maze[end_cell_row][end_cell_col] = "E";
}

function draw_update_cell(cell) {
    const cell_id = cell.id.split("-");
    const row = Number.parseInt(cell_id[0]);
    const col = Number.parseInt(cell_id[1]);
    if (cell.style.background === "red" || cell.style.background === "blue") {
        return;
    }
    if (cell.style.background === "black") {
        maze[row][col] = 0;
        cell.style.background = "white";
    } else if (cell.style.background === "white") {
        maze[row][col] = "#";
        cell.style.background = "black";
    }
}

function display_maze() {
    const grid = document.getElementById("grid");
    const grid_body = document.createElement("tbody");
    grid.appendChild(grid_body);

    for (let i = 0; i < maze.length; i++) {
        const grid_row = document.createElement("tr");
        for (let j = 0; j < maze[i].length; j++) {
            const grid_cell = document.createElement("td");
            grid_cell.classList.add("cell");
            grid_cell.id = `${i}-${j}`;
            if (maze[i][j] === "S") {
                grid_cell.style.background = "blue";
            } else if (maze[i][j] === "E") {
                grid_cell.style.background = "red";
            } else {
                grid_cell.style.background = "white";
            }
            grid_row.appendChild(grid_cell);
        }
        grid_body.appendChild(grid_row);
    }
}

function maze_drawing() {
    const grid = document.getElementById("grid");
    let is_mouse_down = false;
    const LEFT_CLICK = 0;

    grid.addEventListener("mousedown", (event) => {
        if (event.button === LEFT_CLICK && event.target.tagName === "TD") {
            is_mouse_down = true;
            draw_update_cell(event.target);
        }
    });

    document.addEventListener("mouseup", (event) => {
        if (event.button === LEFT_CLICK) {
            is_mouse_down = false;
        }
    });

    grid.addEventListener("mouseover", (event) => {
        if (
            event.button === LEFT_CLICK &&
            is_mouse_down &&
            event.target.tagName === "TD"
        ) {
            draw_update_cell(event.target);
        }
    });

    // avoid text selection while dragging
    grid.addEventListener("mousedown", (event) => event.preventDefault());
}

// TODO:
function random_maze() { }

class Queue {
    constructor() {
        this.items = {};
        this.front_index = 0;
        this.back_index = 0;
    }

    empty() {
        return this.front_index === this.back_index;
    }

    push(item) {
        this.items[this.back_index] = item;
        this.back_index++;
    }

    pop() {
        const item = this.items[this.front_index];
        delete this.items[this.front_index];
        this.front_index++;
        return item;
    }

    peek() {
        return this.items[this.front_index];
    }
}

function make_point(r, c) {
    return { row: r, col: c };
}

function get_start_cell() {
    for (let i = 0; i < maze.length; ++i) {
        for (let j = 0; j < maze[i].length; ++j) {
            if (maze[i][j] === "S") {
                return make_point(i, j);
            }
        }
    }
    return undefined;
}

function get_end_cell() {
    for (let i = 0; i < maze.length; ++i) {
        for (let j = 0; j < maze[i].length; ++j) {
            if (maze[i][j] === "E") {
                return make_point(i, j);
            }
        }
    }
    return undefined;
}

function inside(point) {
    return (
        0 <= point.row &&
        point.row < maze_height &&
        0 <= point.col &&
        point.col < maze_width
    );
}

class CellAnimation {
    constructor(cell, color) {
        this.cell = cell;
        this.color = color;
    }
}

// shoudl return an object
// with cells to animate
// and shortest path
//
function bfs() {
    const dist = Array.from({ length: maze_height }, (_) =>
        Array(maze_width).fill(100 * 100),
    );

    const cell_animation_order = [];
    const q = new Queue();
    const start_cell = get_start_cell();
    dist[start_cell.row][start_cell.col] = 0;
    q.push(start_cell);

    const di = [-1, 1, 0, 0];
    const dj = [0, 0, -1, 1];

    while (!q.empty()) {
        const pos = q.pop();
        if (pos.row === get_end_cell().row && pos.col === get_end_cell().col) {
            break;
        }
        for (let d = 0; d < 4; ++d) {
            const new_pos = make_point(pos.row + di[d], pos.col + dj[d]);
            if (
                inside(new_pos) &&
                maze[new_pos.row][new_pos.col] !== "#" &&
                dist[pos.row][pos.col] + 1 < dist[new_pos.row][new_pos.col]
            ) {
                dist[new_pos.row][new_pos.col] = dist[pos.row][pos.col] + 1;
                q.push(new_pos);
                cell_animation_order.push(new CellAnimation(new_pos, "purple"));
            }
        }
    }
    return cell_animation_order;
}

function bfs_update_cell(cell, color) {
    const start_cell = get_start_cell();
    const end_cell = get_end_cell();
    if (start_cell.row === cell.row && start_cell.col === cell.col) {
        return;
    }

    if (end_cell.row === cell.row && end_cell.col === cell.col) {
        return;
    }
    const cell_id = document.getElementById(`${cell.row}-${cell.col}`);
    cell_id.style.background = color;
}

function bfs_animation() {
    const cells_order = bfs();
    let i = 0;
    setInterval(() => {
        if (i < cells_order.length) {
            bfs_update_cell(cells_order[i].cell, cells_order[i].color);
            i++;
        } else {
            return;
        }
    }, 10);
}

window.onload = () => {
    pick_start_end_pos();
    display_maze();
    maze_drawing();

    const random_btn = document.getElementById("random-btn");
    random_btn.addEventListener("click", () => {
        generate_maze();
    });

    const solve_btn = document.getElementById("solve-btn");
    solve_btn.addEventListener("click", (event) => {
        event.preventDefault();
        const select_input = document.getElementById("algorithms");
        const selected_algorithm = select_input.value;
        if (selected_algorithm === "bfs") {
            bfs_animation();
        } else if (selected_algorithm === "dfs") {
            // TODO:
        } else {
            // TODO:
        }
    });
};
