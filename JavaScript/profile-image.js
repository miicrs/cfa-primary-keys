// query selectors
const userImage = document.querySelector('#user-image');
const savePhotoBtn = document.querySelector('#save-personalpic-btn');
const picUpload = document.querySelector('#profile-pic-upload');

// show previously saved photo
function showPhoto() {
    let savedPhoto = localStorage.getItem('profileImage');

    if (savedPhoto) {
        userImage.src = savedPhoto;
    }
}
 
// does file selection by previous and show the save button once selected
function previewPhoto() {
    let file = picUpload.files[0];
    if (!file) return;

    // reads the file
    let reader = new FileReader();
    reader.onload = function (event) {
        userImage.src = event.target.result;
        savePhotoBtn.style.display = 'inline-block';
    };

    // read and load data as url
    reader.readAsDataURL(file);
}
 
// save the currently showing photo to storage then hide the button again
function savePhoto() {
    localStorage.setItem('profileImage', userImage.src);

    savePhotoBtn.style.display = 'none';
}
 
showPhoto();
 
if (picUpload) {
    picUpload.addEventListener('change', previewPhoto);
}
 
if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', savePhoto);
}