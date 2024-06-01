const maze_width = 76;
const maze_height = 30;
const maze = Array(maze_height).fill(Array(maze_width).fill(0));

function update_cell(cell) {
	const cell_id = cell.id.split("-");
	const row = Number.parseInt(cell_id[0]);
	const col = Number.parseInt(cell_id[1]);
	if (cell.style.background === "black") {
		maze[row][col] = -1;
		cell.style.background = "white";
	} else if (cell.style.background === "white") {
		maze[row][col] = 0;
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
			grid_cell.style.background = "white";
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
			update_cell(event.target);
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
			update_cell(event.target);
		}
	});

	// avoid text selection while dragging
	grid.addEventListener("mousedown", (event) => event.preventDefault());
}

// TODO:
function random_maze() {}

window.onload = () => {
	display_maze();
	maze_drawing();

	const random_btn = document.getElementById("random-btn");
	random_btn.addEventListener("click", () => {
		generate_maze();
	});

	const solve_btn = document.getElementById("solve-btn");
	solve_btn.addEventListener("click", () => {
		const select_input = document.getElementById("algorithms");
		const selected_algorithm = select_input.value;
		if (selected_algorithm === "bfs") {
			// TODO:
		} else if (selected_algorithm === "dfs") {
			// TODO:
		} else {
			// TODO:
		}
	});
};
