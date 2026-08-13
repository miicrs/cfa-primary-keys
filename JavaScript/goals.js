const API_URL = "http://localhost:3000";

const cards = document.querySelectorAll('.goals-card');
const nextBtn = document.querySelector('.next-btn');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
});

if (nextBtn) {
    nextBtn.addEventListener('click', async (event) => {
        // consider so data can be saved first
        event.preventDefault();

        let token = localStorage.getItem('token');
        let userId = localStorage.getItem('userId');

        if (!userId) {
            console.error("Cannot find user's id");
            window.location.href = 'login.html';
            return;
        }

        // collect goals from all cards that have been selected from user
        let selectedCards = document.querySelectorAll('.goals-card.selected');
        let selectedGoals = [];

        selectedCards.forEach(card => {
            let goalsChosen = card.querySelector('.goal-type');

            if (goalsChosen) {
                selectedGoals.push(goalsChosen.textContent);
            }
        });

        // combine selected goals into a formatted string sentence
        let userFocusGoals = "";
        
        if (selectedGoals.length > 0) {
            userFocusGoals = selectedGoals.join(', ');
        } else {
            userFocusGoals = "No financial focus goal(s) set up yet";
        }

        try {
            // save to database
            let res = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ financialFocus: userFocusGoals })
            });

            // clear so nothing shows on the profile until user actually login
            localStorage.clear();

            // redirect user to login page
            window.location.href = '/HTML/login.html';

        } catch (err) {
            console.error("Could not reach server to save financial focus:", err);
            localStorage.clear();
            window.location.href = '/HTML/login.html';
        }
    });
}