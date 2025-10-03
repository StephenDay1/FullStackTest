function loadActivities() {
    fetch('http://localhost:8080/api/activities')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#activityTable tbody');
            tbody.innerHTML = `
                <tr id="formRow">
                <td><input type="date" id="activityDate" name="activityDate" required></td>
                <td><select id="activityType" name="activityType" required>
                    <option value="Income">Income</option>
                    <option value="Tithing">Tithing</option>
                    <option value="Gas">Gas</option>
                    <option value="Living">Living</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Social">Social</option>
                    <option value="Fun">Fun</option>
                </select></th>
                <td><input type="text" step=".01" id="activityAmount" name="activityAmount" placeholder="Amount" required /></td>
                <td><input type="text" id="activityNotes" name="activityNotes" placeholder="Add notes" required></td>
                <td><button type="submit" id="submitActivity"><i class="material-icons">check</i></button></td>
                </tr>`; // Clear existing rows
            data.forEach(activity => {
                const row = document.createElement('tr');

                const [year, month, day] = activity.date.split("-").map(Number);
                const localDate = new Date(year, month - 1, day); // month is 0-indexed
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = localDate.toLocaleDateString('en-US', options); // Example for US English
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${activity.type}</td>
                    <td>$${activity.amount.toFixed(2)}</td>
                    <td>${activity.notes}</td>
                    <td><div class="button_div"><button><i class="material-icons" onclick="deleteActivity(${activity.id})">delete</i></button></div></td>
                `;
                tbody.appendChild(row);
                // parentNode.insertBefore(newChild, referenceChild);
            });

            // TODO should this code be run multiple times?
            const currencyInput = document.getElementById('activityAmount');
            currencyInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric except decimal
                let parts = value.split('.');
                let integerPart = parts[0];
                let decimalPart = parts[1];

                // Format integer part with commas
                integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                // Reconstruct the value
                if (decimalPart !== undefined) {
                    value = integerPart + '.' + decimalPart.substring(0, 2); // Limit to 2 decimal places
                } else {
                    value = integerPart;
                }

                e.target.value = '$' + value; // Add currency symbol
                // console.log(value)
                // e.target.value = value
            });
            currencyInput.addEventListener('focusout', function(e) {
                // let value = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric except decimal
                let value = e.target.value;
                let parts = value.split('.');
                let integerPart = parts[0];
                let decimalPart = parts[1];
                
                if (integerPart == "" || integerPart == "$") {
                    value = ""
                } else if (decimalPart == undefined) {
                    value = integerPart + ".00";
                } else if (decimalPart.length == 1) {
                    value = integerPart + '.' + decimalPart + "0"
                } else {
                    value = integerPart + '.' + decimalPart.substring(0, 2); // Limit to 2 decimal places
                }

                e.target.value = value;
            });
        });
}
// On initialize
loadActivities()

function deleteActivity(id) {
  fetch(`http://localhost:8080/api/activities/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      loadActivities(); // Refresh table
    } else {
      console.error("Delete failed:", response.status);
    }
  });
}


// Runs after successful form submission
document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    activityDateElement = document.getElementById('activityDate');
    activityTypeElement = document.getElementById('activityType');
    activityAmountElement = document.getElementById('activityAmount');
    activityNotesElement = document.getElementById('activityNotes');
    const activity = {
        date: activityDateElement.value,
        type: activityTypeElement.value,
        amount: parseFloat(activityAmountElement.value.substring(1)), // Remove the $ first
        notes: activityNotesElement.value
    };

    // Clear the amount and notes
    activityAmountElement.value = ""
    activityNotesElement.value = ""

    fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
    })
    .then(response => response.json())
    .then(() => {
        loadActivities(); // Refresh the table
    });
});
