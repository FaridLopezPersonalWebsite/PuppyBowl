// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder

// Use the APIURL variable for fetch requests

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = 'YOUR COHORT NAME HERE';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2109-UNF-HY-WEB-PT/`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL + 'players');
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        throw err;
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`);
        const player = await response.json();
        return player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + 'players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const newPlayer = await response.json();
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(APIURL + `players/${playerId}`, {
            method: 'DELETE',
        });
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

const renderAllPlayers = (response) => {
    try {
        const playerList = response.data.players;
        let playerContainerHTML = '';

        playerList.forEach((player) => {
            playerContainerHTML += `
                <div class="player-card">
                    <h2>${player.name}</h2>
                    <p>Position: ${player.position}</p>
                    <button class="details-btn" data-id="${player.id}">See details</button>
                    <button class="remove-btn" data-id="${player.id}">Remove from roster</button>
                </div>
            `;
        });

        playerContainer.innerHTML = playerContainerHTML;

        const detailsButtons = document.querySelectorAll('.details-btn');
        const removeButtons = document.querySelectorAll('.remove-btn');

        detailsButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.id;
                const playerResponse = await fetchSinglePlayer(playerId);
                const player = playerResponse.data.player;

                console.log('Player details:');
                console.log('Name:', player.name);
                console.log('Position:', player.position);
            });
        });

        removeButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.id;
                await removePlayer(playerId);
                const updatedPlayers = await fetchAllPlayers();
                renderAllPlayers(updatedPlayers);
            });
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <form id="new-player-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>

                <label for="position">Position:</label>
                <input type="text" id="position" name="position" required>

                <button type="submit">Add Player</button>
            </form>
        `;

        newPlayerFormContainer.innerHTML = formHTML;

        const form = document.getElementById('new-player-form');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const position = document.getElementById('position').value;

            const newPlayerObj = {
                name,
                position,
            };

            await addNewPlayer(newPlayerObj);
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const displayPlayerDetails = (player) => {
    const detailsContainer = document.getElementById('player-details-container');

    const playerDetailsDiv = document.createElement('div');
    playerDetailsDiv.className = 'player-details';

    playerDetailsDiv.innerHTML = `
        <h2>${player.name}</h2>
        <p>Position: ${player.position}</p>
        <button id="close-details-btn">Close Details</button>
    `;

    detailsContainer.innerHTML = '';
    detailsContainer.appendChild(playerDetailsDiv);

    const closeDetailsBtn = document.getElementById('close-details-btn');
    closeDetailsBtn.addEventListener('click', () => {
        detailsContainer.innerHTML = '';
    });
};

const init = async () => {
    try {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);

        renderNewPlayerForm();
    } catch (err) {
        console.error('Uh oh, something went wrong during initialization!', err);
    }
};

init();
