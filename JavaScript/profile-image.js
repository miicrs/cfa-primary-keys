// query selectors
const savePhotoBtn = document.querySelector('#save-personalpic-btn');
const picUpload = document.querySelector('#profile-pic-upload');

// note: deleted showPhoto() function as it was connected to localStorage
 
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
 
// save the user's photo to database then hide the button again
async function savePhoto() {
    if (!token || !userId) return;

    try {
        const res = await fetch(`${API_URL}/users/${userId}/photo`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                profileImage: userImage.src
            })
        });

        if (res.ok) {
            // where hiding save button after update goes well part
            savePhotoBtn.style.display = 'none';
        } else {
            console.error("Error where cannot save profile photo.");
        }
    } catch (err) {
        console.error("Could not reach the server. Please try again.");
    }
}
 
if (picUpload) {
    picUpload.addEventListener('change', previewPhoto);
}
 
if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', savePhoto);
}