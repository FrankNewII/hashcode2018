var textarea = document.querySelector('#textarea');
window.parsedDate = undefined;

document.querySelector('#b').addEventListener('click', function () {
    window.parsedDate = new ParserG(textarea.value);
    window.parsedDate.startDay();
});