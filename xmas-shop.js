const url = 'http://localhost:3000/';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedOutput');


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
    let nameInput = document.getElementById('name');
    let giftScoreInput = document.getElementById('GiftScore');

    let newKid = {
        name: nameInput.value,
        giftScore: parseInt(giftScoreInput.value)
    };

    fetch(url + 'kids', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newKid)
    })
    .then(res => res.json())
    .then(() => {
        fetchData();
        nameInput.value = '';
        giftScoreInput.value = '';
    })
    .catch(e => console.error('Error adding kid: ' + e));
});