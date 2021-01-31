function buttonFunctions() {
    document.getElementById('addGame').addEventListener('click', addGame)
}

let gameCount = 1;
function addGame() {
	gameCount++;
	let gameField = document.getElementById('gameField');
	let gameSelect = document.createElement('div');
    let className = 'game' + gameCount;
    className += ' row'  // for Bootstrap formatting
    gameSelect.className = className
    let htmlContent = document.getElementById('gameSelect').innerHTML
    // add delete button
    htmlContent += '<div class="col-sm-2 mb-3"><button type="button" class="btn btn-danger" onclick="deleteGame(\'game' + gameCount + '\');">Delete</button></div>'
    gameSelect.innerHTML = htmlContent
    gameField.appendChild(gameSelect)
}

function deleteGame(game) {
    document.getElementsByClassName(game)[0].remove();
}

document.addEventListener("DOMContentLoaded", buttonFunctions)