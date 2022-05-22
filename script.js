const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextVal = 0;
let rightGuess = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
// console.log(rightGuess)
let numInBox = 0;
let currentVal = 0;
let hard = false;

class RightGuess {
    static guess = [0, 0, 0]

    static resetGuess() {
        RightGuess.guess = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    }
}

function initBoard() {
    let board = document.getElementById("game-board");

    var elem = document.createElement("hr");
    elem.className = "color-line";

    RightGuess.resetGuess()
    elem.style.backgroundColor = 'rgb(' + RightGuess.guess[0] + ', ' + RightGuess.guess[1] + ', ' + RightGuess.guess[2] + ')';
    board.appendChild(elem);

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "val-row"

        for (let j = 0; j < 3; j++) {
            let box = document.createElement("div")
            box.className = "val-box"
            row.appendChild(box)
        }

        board.appendChild(row)

        let elem = document.createElement("hr");
        elem.className = "color-line"
        board.appendChild(elem);
    }

    var message = document.createElement("div")
    message.className = "alert-message"
    message.textContent = "."
    message.style.color = "rgb(24, 24, 24)"
    board.appendChild(message)
    let normalButton = document.getElementsByClassName("mode")[1]
    normalButton.style.backgroundColor = "rgb(64, 64, 64)"
}

// initBoard()

// document.addEventListener("keyup", (e) => {

//     if (guessesRemaining === 0) {
//         return
//     }

//     let pressedKey = String(e.key)
//     if (pressedKey === "Backspace") {
//         deleteVal()
//         return
//     }

//     if (pressedKey === "Enter") {
//         checkGuess()
//         return
//     }

//     // make sure pressedKey is a digit
//     if (isFinite(parseInt(pressedKey)))
//         insertVal(parseInt(pressedKey))
//     else
//         return
// })

function insertVal(pressedKey) {
    resetAlert()
    if (nextVal === 3)
        return

    let row = document.getElementsByClassName("val-row")[6 - guessesRemaining]
    let box = row.children[nextVal]
    currentVal *= 10
    currentVal += pressedKey
    animateCSS(box, "pulse")

    if (box.textContent[0] == 0 && box.textContent[1] == 0)
        box.textContent = '00' + currentVal
    else if (box.textContent[0] == 0)
        box.textContent = '0' + currentVal
    else
        box.textContent = currentVal

    numInBox++
    if (numInBox === 3) {
        //box.classList.remove("current-box")
        box.classList.add("filled-box")
        currentGuess.push(currentVal)
        nextVal += 1
        let box2 = row.children[nextVal]
        //box2.classList.add("current-box")
        numInBox = 0
        currentVal = 0
    }
}

function deleteVal() {
    resetAlert()
    let row = document.getElementsByClassName("val-row")[6 - guessesRemaining]
    let box = row.children[nextVal - 1]
    if (numInBox != 0) {
        row.children[nextVal].textContent = ""
        currentVal = 0
        numInBox = 0
        //box.classList.remove("current-box")
    }
    else {
        box.textContent = ""
        box.classList.remove("filled-box")
        //box.classList.add("current-box")
        currentGuess.pop()
        nextVal -= 1
        currentVal = 0
    }
}

function checkGuess() {
    let row = document.getElementsByClassName("val-row")[6 - guessesRemaining]
    if (currentGuess.length != 3) {
        makeAlert("enter more values")
        return
    }

    for (const val of currentGuess) {
        if (val < 0 || val > 255) {
            makeAlert("all values must be between 0 and 255")
            return
        }
    }

    let elem = document.getElementsByClassName("color-line")[6 - guessesRemaining + 1]
    elem.style.backgroundColor = 'rgb(' + currentGuess[0] + ', ' + currentGuess[1] + ', ' + currentGuess[2] + ')';

    let correct = true
    for (let i = 0; i < 3; i++) {
        let valColor = '';
        let box = row.children[i]
        let val = currentGuess[i]
        //let valPosition = rightGuess.indexOf(currentGuess[i])

        let diff = Math.abs(currentGuess[i] - rightGuess[i])


        if (diff <= 5)
            box.classList.add("correct-box")

        if (!hard) {
            if (currentGuess[i] < rightGuess[i]) {
                box.classList.add("blue-box")
                box.textContent += '↑'
            }
            else if (currentGuess[i] > rightGuess[i]) {
                box.classList.add("red-box")
                box.textContent += '↓'
            }
        }


        if (diff > 5)
            correct = false

        //rightGuess[valPosition] = "#"
        // }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = valColor
            shadeKeyboard(val, valColor)
        }, delay)
    }

    if (correct) {
        // alert("You guessed right! Game over!")
        // alert(`The right color was: "${rightGuess}"`)
        makeAlert(`correct! the right color was: "${rightGuess}"`)
        guessesRemaining = 0
        return
    }
    else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextVal = 0;

        if (guessesRemaining === 0) {
            // alert("You've run out of guesses! Game over!")
            // alert(`The right color was: "${rightGuess}"`)
            makeAlert(`you lost! the right color was: "${rightGuess}"`)
        }
    }
}

function shadeKeyboard(val, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === val) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }

            // figure out checks
            // if (oldColor !== 'grey' && color !== 'green') {
            //     return
            // }

            elem.style.backgroundColor = color
            break
        }
    }
}

function makeAlert(text) {
    let message = document.getElementsByClassName("alert-message")[0]
    message.textContent = text
    message.style.color = "white"
}

function resetAlert() {
    let message = document.getElementsByClassName("alert-message")[0]
    message.textContent = "."
    message.style.color = "rgb(24, 24, 24)"
}

function setHard() {
    if (hard == true)
        return;

    hard = true;
    let normalButton = document.getElementsByClassName("mode")[1]
    let hardButton = document.getElementsByClassName("mode")[0]
    hardButton.style.backgroundColor = "rgb(64, 64, 64)"
    normalButton.style.backgroundColor = "rgb(36, 36, 36)"
    //resetBoard();
}

function setNormal() {
    if (hard == false)
        return;

    hard = false;
    let normalButton = document.getElementsByClassName("mode")[1]
    let hardButton = document.getElementsByClassName("mode")[0]
    normalButton.style.backgroundColor = "rgb(64, 64, 64)"
    hardButton.style.backgroundColor = "rgb(36, 36, 36)"
    //resetBoard();
}

function resetBoard() {
    resetAlert()
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextVal = 0;
    numInBox = 0;
    currentVal = 0;
    // rightGuess = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];

    // let elem = document.getElementsByClassName("color-line")[0];
    // elem.style.backgroundColor = 'rgb(' + rightGuess[0] + ', ' + rightGuess[1] + ', ' + rightGuess[2] + ')';

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.getElementsByClassName("val-row")[i]

        for (let j = 0; j < 3; j++) {
            let box = row.children[j]
            box.textContent = ""
            //if(box.classList.contains("filled-box"))
            box.classList.remove("filled-box", "red-box", "blue-box", "correct-box")
        }

        let line = document.getElementsByClassName("color-line")[i + 1]
        line.style.backgroundColor = "rgb(36, 36, 36)"
    }
}

// checks if one day has passed. 
function hasOneDayPassed() {
    // get today's date. eg: "7/37/2007"
    var d = new Date().toLocaleDateString();

    // if there's a date in localstorage and it's equal to the above: 
    // inferring a day has yet to pass since both dates are equal.
    if (localStorage.getItem("date") == d)
        return false;

    // this portion of logic occurs when a day has passed
    localStorage.setItem("date", d);
    return true;
}


// some function which should run once a day
function runOncePerDay() {
    if (!hasOneDayPassed())
        return false;

    rightGuess = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    let elem = document.getElementsByClassName("color-line")[0];
    elem.style.backgroundColor = 'rgb(' + rightGuess[0] + ', ' + rightGuess[1] + ', ' + rightGuess[2] + ')';
}

// document.getElementById("keyboard-cont").addEventListener("click", (e) => {
//     const target = e.target

//     if (!target.classList.contains("keyboard-button")) {
//         return
//     }
//     let key = target.textContent

//     if (key === "Del") {
//         key = "Backspace"
//     }

//     document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
// })

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });