// Optional JavaScript to switch background image based on viewport width
window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        document.body.classList.add('desktop-background');
    } else {
        document.body.classList.remove('desktop-background');
    }
});

// Trigger background change on load
window.dispatchEvent(new Event('resize'));

// Get the button by its ID
const button = document.getElementById("submitBtn");
var tries = 0;
var todayRGB = generateRandomColor();  // Define todayRGB outside the function so it's accessible

// Function to generate pseudo-random number using a seed
function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Function to generate random RGB color based on the current date
function generateRandomColor() {
    const currentDate = new Date();
    const seed = currentDate.getFullYear() * 1000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate();
    const r = Math.floor(seededRandom(seed) * 256);
    const g = Math.floor(seededRandom(seed + 1) * 256);
    const b = Math.floor(seededRandom(seed + 2) * 256);
    return { r, g, b };
}

// Function to determine the comparison result
function getComparisonResult(inputValue, generatedValue) {
    if (inputValue === generatedValue) {
        return "✅"; // Exact match, return immediately
    } else if ((generatedValue - inputValue) > 50) {
        return "⏫"; // Input is much smaller
    } else if ((generatedValue - inputValue) > 0) {
        return "🔼"; // Input is smaller, but within 50
    } else if ((generatedValue - inputValue) < -50) {
        return "⏬"; // Input is much larger
    } else if ((generatedValue - inputValue) < 0) {
        return "🔽"; // Input is larger, but within 50
    } else {
        return "Error";
    }    
}

// Function to add a new guess to the hint list
function addGuessToHint(hintId, value, comparisonResult) {
    const hintDiv = document.getElementById(hintId);
    const guessElement = document.createElement('div');
    guessElement.className = 'guess';
    guessElement.textContent = `${value} (${comparisonResult})`;
    hintDiv.insertBefore(guessElement, hintDiv.firstChild);
}

function showAnswer() {
    rgbInput.disabled = true;
    rgbInput.value = `${todayRGB.r},${todayRGB.g},${todayRGB.b}`;
}

// Function to format and check the input, update squareTwo's color, and update hints
function updateSquareColor() {
    const inputValue = document.getElementById("rgbInput").value.trim();
    const rgbArray = inputValue.split(",");

    // Check if the input is valid (contains exactly 3 parts and each is a valid number between 0-255)
    if (rgbArray.length === 3 &&
        rgbArray.every(value => !isNaN(value) && Number(value) >= 0 && Number(value) <= 255)) {
        
        if (tries < 6) {
            tries += 1;

            const r = parseInt(rgbArray[0], 10);
            const g = parseInt(rgbArray[1], 10);
            const b = parseInt(rgbArray[2], 10);
            const inputRGB = { r, g, b };

            // Update the background color of squareTwo
            const squareTwo = document.getElementById("squareTwo");
            squareTwo.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            // Update hints for each RGB component
            const rComparison = getComparisonResult(inputRGB.r, todayRGB.r);
            const gComparison = getComparisonResult(inputRGB.g, todayRGB.g);
            const bComparison = getComparisonResult(inputRGB.b, todayRGB.b);

            addGuessToHint('hintR', inputRGB.r, rComparison);
            addGuessToHint('hintG', inputRGB.g, gComparison);
            addGuessToHint('hintB', inputRGB.b, bComparison);

            // Check if all values are correct
            if (rComparison === '✅' && gComparison === '✅' && bComparison === '✅') {
                document.getElementById("successMessage").textContent = "You win!";
            } else {
                document.getElementById("successMessage").textContent = `Submit your guess as three numbers from 0 to 255. You have ${6 - tries} tries left!`;
                if (tries >= 6) {
                    
                    alert(`You are out of tries! The colour was rgb(${todayRGB.r}, ${todayRGB.g}, ${todayRGB.b}).`);
                    showAnswer();
                    return;

                }
            }

            // Clear the input field for the next guess
            document.getElementById("rgbInput").value = "";
            
        } else {
            // Show alert with today's RGB value when out of tries
            alert(`You are out of tries! The colour was rgb(${todayRGB.r}, ${todayRGB.g}, ${todayRGB.b}).`);
            // Lock the input field and display the correct answer
            showAnswer()
            return;
        }
    } else {
        alert("Please enter a valid RGB value in the format ###,###,### with each number between 0 and 255.");
    }
}

// Apply the generated color to squareOne on page load
window.onload = function() {
    const squareOne = document.getElementById("squareOne");
    squareOne.style.backgroundColor = `rgb(${todayRGB.r}, ${todayRGB.g}, ${todayRGB.b})`;
};

// Add event listener to button to check the input and update the second square and hints
button.addEventListener("click", updateSquareColor);

// Add an event listener for keypress events on the document
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        // Directly call the updateSquareColor function to simulate form submission
        updateSquareColor();
    }
});
