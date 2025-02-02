const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20; // Tamaño de cada celda
let rows = 5; // Filas del laberinto
let cols = 5; // Columnas del laberinto
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let stack = [];
let current;
let player = { row: 0, col: 0 };

let level = 1; // Nivel actual

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = { top: true, right: true, bottom: true, left: true };
  }

  draw() {
    const x = this.col * cellSize;
    const y = this.row * cellSize;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Dibujar las paredes
    if (this.walls.top) ctx.strokeRect(x, y, cellSize, 1);
    if (this.walls.right) ctx.strokeRect(x + cellSize - 1, y, 1, cellSize);
    if (this.walls.bottom) ctx.strokeRect(x, y + cellSize - 1, cellSize, 1);
    if (this.walls.left) ctx.strokeRect(x, y, 1, cellSize);
  }

  checkNeighbors() {
    const neighbors = [];
    const top = grid[this.row - 1]?.[this.col];
    const right = grid[this.row]?.[this.col + 1];
    const bottom = grid[this.row + 1]?.[this.col];
    const left = grid[this.row]?.[this.col - 1];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    return neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
  }
}

function setupGrid() {
  grid = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(new Cell(row, col));
    }
    grid.push(rowArray);
  }
  current = grid[0][0];
  current.visited = true;
}

function removeWalls(a, b) {
  const x = a.col - b.col;
  const y = a.row - b.row;

  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }

  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

function generateMaze() {
  const next = current.checkNeighbors();
  if (next) {
    stack.push(current);
    removeWalls(current, next);
    current = next;
    current.visited = true;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar celdas
  for (const row of grid) {
    for (const cell of row) {
      cell.draw();
    }
  }

  // Dibujar al jugador
  const playerX = player.col * cellSize;
  const playerY = player.row * cellSize;
  const radius = 10;
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(playerX + cellSize / 2, playerY + cellSize / 2, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Dibujar salida con esquinas redondeadas
  const exitX = (cols - 1) * cellSize;
  const exitY = (rows - 1) * cellSize;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(exitX + cellSize / 2, exitY + cellSize / 2, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function movePlayer(e) {
  const currentCell = grid[player.row][player.col];
  if (e.key === 'ArrowUp' && !currentCell.walls.top && player.row > 0) player.row--;
  else if (e.key === 'ArrowRight' && !currentCell.walls.right && player.col < cols - 1) player.col++;
  else if (e.key === 'ArrowDown' && !currentCell.walls.bottom && player.row < rows - 1) player.row++;
  else if (e.key === 'ArrowLeft' && !currentCell.walls.left && player.col > 0) player.col--;

  // Verificar si el jugador llegó al final
  if (player.row === rows - 1 && player.col === cols - 1) levelUp();

  drawMaze(); // Redibujar
}

function levelUp() {
  level++;
  rows++;
  cols++;
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  setupGrid();
  player = { row: 0, col: 0 }; // Colocar jugador en la esquina superior izquierda
  generateCompleteMaze(); // Generar nuevo laberinto
}

function generateCompleteMaze() {
  let stepsPerFrame = 30;

  function step() {
    for (let i = 0; i < stepsPerFrame; i++) {
      generateMaze();
      if (stack.length === 0) break;
    }

    drawMaze();

    if (stack.length > 0) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Soporte para gestos táctiles
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener('touchend', function (e) {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) movePlayer({ key: 'ArrowRight' });
    else movePlayer({ key: 'ArrowLeft' });
  } else {
    if (dy > 0) movePlayer({ key: 'ArrowDown' });
    else movePlayer({ key: 'ArrowUp' });
  }
});

canvas.addEventListener('touchmove', function (e) {
  const touch = e.touches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
  e.preventDefault(); // Evitar el desplazamiento de la página
}, { passive: false });

// Inicializar
setupGrid();
generateCompleteMaze();

// Control de movimiento
window.addEventListener('keydown', movePlayer);

// Bloquear desplazamiento con teclas de flecha
window.addEventListener('keydown', function (e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});
