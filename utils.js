/**
 * Update the input color
 */
function updateCSS() {
    const inputs = document.getElementsByTagName("input");
    for (let i = inputs.length; i-- > 0;) {
        const value = Number(inputs[i].value);
        inputs[i].style.background = value === 1 ? 'darkcyan' : 'beige';
        inputs[i].style.color = value === 1 ? 'white' : 'black';
    }
}

/**
 * Padding `0` if the length of the number < specific length.
 * @param num
 * @param length
 * @returns {string}
 */
function padding0(num, length) {
    return (Array(length).join("0") + num).slice(-length);
}
