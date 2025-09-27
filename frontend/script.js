// document.getElementById('activityForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const date = document.getElementById('activityDate').value
//     const type = document.getElementById('activityType').value
//     const amount = document.getElementById('activityAmount').value;
//     const notes = document.getElementById('activityNotes').value

//     fetch('http://localhost:8080/api/activity', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             date: date,
//             type: type,
//             amount: amount,
//             notes: notes,
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(typeof(data.message))
//         console.log(Object.values(data.message));
//         // Object.values
//         console.log(data.message["0"])
//         console.log(data.message["2"])
//         document.getElementById('responseBox').textContent = data.message["0"];
//     })
//     .catch(error => {
//         document.getElementById('responseBox').textContent = "Error: " + error.message;
//     });
// });

function loadActivitieLog() {
    fetch('http://localhost:8080/api/activities')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#activityTable tbody');
            tbody.innerHTML = ''; // Clear existing rows
            data.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${activity.date}</td>
                    <td>${activity.type}</td>
                    <td>$${activity.amount.toFixed(2)}</td>
                    <td>${activity.notes}</td>
                `;
                tbody.appendChild(row);
            });
        });
}
// On initialize
loadActivitieLog()



// Call this after successful form submission
document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const activity = {
        date: document.getElementById('activityDate').value,
        type: document.getElementById('activityType').value,
        amount: parseFloat(document.getElementById('activityAmount').value),
        notes: document.getElementById('activityNotes').value
    };

    fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
    })
    .then(response => response.json())
    .then(() => {
        loadActivitieLog(); // Refresh the table
    });
});
