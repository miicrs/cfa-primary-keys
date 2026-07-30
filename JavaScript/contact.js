const swears = ["gross", "jerk", "stupid", "dumb", "sucks", "hate"];
const badNames = ["poopypants", "bobbyheads", "bloomers"];

function dirtyWords(words) {
    let badWords = swears.some((word) => words.includes(word));
    if(badWords) {
        return true;
    } else {
        return false;
    }
}

function dirtyNames(names) {
    let badName = badNames.some((name) => names.include(name));
}

// IDs needed:
// - name
// - email-address
// - comments

comment.addEventListener('focus', function () {
    this.classList.remove('is-danger');
    warning.classList.remove('is-danger');
    warning.innerHTML = '';
});

function submitComment(event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email-address").value;
    let comment = document.getElementById("comments").value;

    if(dirtyNames(name) && dirtyWords(comment)) {
        warning.textContent = "Please keep your name and your comment constructive and professional.";
        warning.classList.add('is-danger');
        return;
    } else if(dirtyNames(name)) {
        warning.textContent = "Please keep your name constructive and professional.";
        warning.classList.add('is-danger');
        return;
    } else if(dirtyWords(comment)) {
        warning.textContent = "Please keep your comment constructive and professional.";
        warning.classList.add('is-danger');
        return;
    } else {
        this.style.display = "none";
        document.getElementById("form-success").style.display = "block";
    }
}

document.querySelector('#comment-form').addEventListener("submit", submitComment);
