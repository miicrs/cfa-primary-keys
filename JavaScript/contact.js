// For educational purposes only,
// these are the examples that are very bad and not clean!
const swears = ["gross", "jerk", "stupid", "dumb", "sucks", "hate"];
const badNames = ["Poopypants", "Bobbyheads", "Bloomers"];


// Returns a bad word which is detected
// Otherwise, return false
function dirtyWords(words) {
    let badWords = swears.some((word) => words.includes(word));
    if(badWords) {
        return true;
    } else {
        return false;
    }
}

// Return a bad name as true if found
// Otherwise, return false
function dirtyNames(names) {
    let badName = badNames.some((name) => names.includes(name));
    return badName;
}

// IDs needed:
// - name
// - email-address
// - comments

// Removes a bad word or name as long as the comments have been changed
// by a user
let userComment = document.getElementById("comments");
console.log(userComment);
userComment.addEventListener('focus', function () {
    this.classList.remove('is-danger');
    warning.classList.remove('is-danger');
    warning.innerHTML = '';
});


// Remvoes a bad name as well as the name itself has been changed
// by a user
let userName = document.getElementById("name");
console.log(userName);
userName.addEventListener('focus', function() {
    this.classList.remove('is-danger');
    warning.classList.remove('is-danger');
    warning.innerHTML = '';
});


// Detects if a bad word/name is found and gives a user a warning.
// If no bad words/names are found, then the process proceeds to the
// "thank you" message
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
        document.getElementById("thank-you").style.display = "block";
    }
}

document.querySelector('#comment-form').addEventListener("submit", submitComment);
