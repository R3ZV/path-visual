# Pathfinding Visualizer

## Usage
```console
git clone git@github.com:R3ZV/path-visual.git

cd path-visual

npm install

npm run dev
```

## Informations
If you don't see the favicon go to
http://localhost:8080/favicon.ico
and it should be fixed.

To try the pathfinding visualizer you have to create an account
and login.

Or you could use my favorite user 'Json' here are his credentials:

Username: Json

Password: Derulo1

You can hold click to draw walls on the grid.

Clicking a wall will result in removing it.

In the visulizer, based on the cell color the cell has the following meanings:
- Blue cell = The cell we start from
- Red cell = The cell we want to reach
- Black cell = A blocked cell
- Yellow cell = Processed cell by the algorithm
- Teal cell = Cell that is part of the shortest path between the red and blue cells
