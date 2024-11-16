const url = 'http://localhost:3000/';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedOutput');


// Refresh data from database
function fetchData() {
    output.innerHTML = '';
    fetch(url + 'kids')
    .then(res => res.json())
    .then(data => {
        for (kid of data) {
            output.innerHTML += `
                <div class="data-item" id="kid-${kid.id}">
                    <span class="item-content">${kid.name} (${kid.giftScore})</span>
                    <div class="edit-form" style="display: none;">
                        <input type="text" class="edit-name" value="${kid.name}">
                        <input type="number" class="edit-giftscore" value="${kid.giftScore}">
                        <button class="smallbutton" onclick="saveEdit('${kid.id}')">S</button>
                        <button class="smallbutton" onclick="cancelEdit('${kid.id}')">X</button>
                    </div>
                    <div class="button-group">
                        <button onclick="editKid('${kid.id}')">Edit</button>
                        <button onclick="saveToLocal('${kid.id}', '${kid.name}', ${kid.giftScore})">Save</button>
                        <button onclick="deleteKid('${kid.id}')">Delete</button>
                    </div>
                </div>
            `;
        }
    })
    .catch(e => console.error("Error fetching data: " + e));
}

fetchData();

document.getElementById('refresh').addEventListener('click', fetchData);

document.getElementById('addChildButton').addEventListener('click', () => {
    // Get data from input form
    let nameInput = document.getElementById('name');
    let giftScoreInput = document.getElementById('GiftScore');

    // New kid object using input data
    let newKid = {
        name: nameInput.value,
        giftScore: parseInt(giftScoreInput.value)
    };

    // Add new data to database
    fetch(url + 'kids', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newKid)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh list of data and clear input form
        fetchData();
        nameInput.value = '';
        giftScoreInput.value = '';
    })
    .catch(e => console.error('Error adding kid: ' + e));
});

function deleteKid(id) {
    fetch(url + 'kids/' + id, {
        method: 'DELETE'
    })
    .then(() => fetchData())
    .catch(e => console.error('Error deleting kid: ' + e));
}

function editKid(id) {
    // Show edit form and hide item content and buttons
    let item = document.getElementById('kid-' + id);
    item.querySelector('.button-group').style.display = 'none';
    item.querySelector('.item-content').style.display = 'none';
    item.querySelector('.edit-form').style.display = 'block';
}

function cancelEdit(id) {
    // Hide edit form and show item content and buttons
    let item = document.getElementById('kid-' + id);
    item.querySelector('.button-group').style.display = 'block';
    item.querySelector('.item-content').style.display = 'block';
    item.querySelector('.edit-form').style.display = 'none';
}

function saveEdit(id) {
    // Get new data from edit form
    let editForm = document.getElementById('kid-' + id).querySelector('.edit-form');
    let newName = editForm.querySelector('.edit-name').value;
    let newGiftScore = parseInt(editForm.querySelector('.edit-giftscore').value);

    // New object with updated data
    let updatedKid = {
        name: newName,
        giftScore: newGiftScore
    };

     // Send PUT request to update
     fetch(url + 'kids/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedKid)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh list of data, this also hides the edit form again
        fetchData();
    })
    .catch(e => console.error('Error updating kid:', e));
}