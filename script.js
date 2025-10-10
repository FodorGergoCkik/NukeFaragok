const rows = 12;
const cols = 12;
const board = document.getElementById("board");

const shapes = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]]
};

const grid = Array.from({length: rows}, () => Array(cols).fill(0));

// Tábla létrehozása
for(let r=0; r<rows; r++){
  for(let c=0; c<cols; c++){
    const div = document.createElement("div");
    div.classList.add("cell");
    div.id = `${r}-${c}`;
    div.addEventListener("click", () => sendProbe(r, c));
    board.appendChild(div);
  }
}

// Forgatás
function rotate(shape){
  const rows = shape.length;
  const cols = shape[0].length;
  let newShape = [];
  for(let c=0; c<cols; c++){
    let newRow = [];
    for(let r=rows-1; r>=0; r--){
      newRow.push(shape[r][c]);
    }
    newShape.push(newRow);
  }
  return newShape;
}

// Elhelyezés ellenőrzése
function canPlace(shape, startRow, startCol) {
  for(let r=0; r<shape.length; r++){
    for(let c=0; c<shape[r].length; c++){
      if(shape[r][c] === 1){
        const rr = startRow + r;
        const cc = startCol + c;
        if(rr < 0 || rr >= rows || cc < 0 || cc >= cols) return false;
        if(grid[rr][cc] !== 0) return false;

        for(let dr=-1; dr<=1; dr++){
          for(let dc=-1; dc<=1; dc++){
            const nr = rr + dr;
            const nc = cc + dc;
            if(nr >= 0 && nr < rows && nc >= 0 && nc < cols){
              if(grid[nr][nc] !== 0) return false;
            }
          }
        }
      }
    }
  }
  return true;
}

// Alakzat elhelyezése (de nem mutatjuk meg)
function placeShape(shape, startRow, startCol, id) {
  for(let r=0; r<shape.length; r++){
    for(let c=0; c<shape[r].length; c++){
      if(shape[r][c] === 1){
        const rr = startRow + r;
        const cc = startCol + c;
        grid[rr][cc] = id;
        spaceshipCells.push(`${rr}-${cc}`);
        // Nem színezünk előre semmit, titkos marad.
      }
    }
  }
}

let spaceshipCells = [];

const shapeKeys = Object.keys(shapes);
for(let i=0; i<shapeKeys.length; i++){
  let shape = JSON.parse(JSON.stringify(shapes[shapeKeys[i]]));
  const rotations = Math.floor(Math.random() * 4);
  for(let r=0; r<rotations; r++) shape = rotate(shape);

  let placed = false;
  let attempts = 0;
  while(!placed && attempts < 2000){
    const startRow = Math.floor(Math.random() * (rows - shape.length));
    const startCol = Math.floor(Math.random() * (cols - shape[0].length));
    if(canPlace(shape, startRow, startCol)){
      placeShape(shape, startRow, startCol, i+1);
      placed = true;
    }
    attempts++;
  }
  if(!placed) console.warn(`Nem sikerült elhelyezni a(z) ${shapeKeys[i]} alakzatot.`);
}

// Klikkelésre derül ki, mi van a mező alatt
function sendProbe(r, c){
  const id = `${r}-${c}`;
  const cell = document.getElementById(id);
  if(spaceshipCells.includes(id)){
    cell.style.background = "red"; // Találat
    alert("Találat! 🚀");
  } else {
    cell.style.background = "#888"; // Üres
    alert("Üres mező.");
  }
}
