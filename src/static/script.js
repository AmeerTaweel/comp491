// Increment Button Helper (GPU Menu)
function previousOption() {
    var dropdown = document.getElementById("gpu_dropdown");
    var currentIndex = dropdown.selectedIndex;
    var lastIndex = dropdown.options.length - 1;
    if (currentIndex === 0) {
        dropdown.selectedIndex = lastIndex;
    } else {
        dropdown.selectedIndex = currentIndex - 1;
    }
}

// Decrement Button Helper (GPU Menu)
function nextOption() {
    var dropdown = document.getElementById("gpu_dropdown");
    var currentIndex = dropdown.selectedIndex;
    var lastIndex = dropdown.options.length - 1;
    if (currentIndex === lastIndex) {
        dropdown.selectedIndex = 0;
    } else {
        dropdown.selectedIndex = currentIndex + 1;
    }
}
