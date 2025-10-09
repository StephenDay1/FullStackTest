function openTab(event, tabId) {
  // Declare all variables
  var i, tabWindow, tablinks;

  // Get all elements with class="tabWindow" and hide them
  tabWindow = document.getElementsByClassName("tabWindow");
  for (i = 0; i < tabWindow.length; i++) {
    tabWindow[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabId).style.display = "block";
  event.currentTarget.className += " active";
}
document.getElementById("default").click();

function loadSummary() {
  fetch('http://localhost:8080/api/activities/types')
    .then(response => response.json())
    .then(data => {
      innerHTML = "";
      data.forEach(type => {
        console.log(type);
        const params = new URLSearchParams();
        params.append("type", type);
        // if (startDate) params.append("start", startDate);
        // if (endDate) params.append("end", endDate);
        innerHTML += `<div id="summary-${type}"></div>`;

        fetch(`http://localhost:8080/api/activities/type_total?${params.toString()}`)
          .then(response => response.json())
          .then(total => {
            console.log(`Total for ${type}: $${total.toFixed(2)}`);
            document.getElementById(`summary-${type}`).textContent = `${type}: $${total.toFixed(2)}`;
          })
          .catch(error => {
            console.error("Error fetching income total:", error);
            // document.getElementById('incomeTotal').textContent = "Error";
          });
      });
      console.log(innerHTML);
      document.getElementById('summaryTotals').innerHTML = innerHTML;
    });
}

loadSummary();

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
          <option value="Other Income">Other Income</option>
          <option value="Tithing">Tithing</option>
          <option value="Gas">Gas</option>
          <option value="Living">Living</option>
          <option value="Groceries">Groceries</option>
          <option value="Social">Social</option>
          <option value="Dates">Dates</option>
          <option value="Fun">Fun</option>
        </select></th>
        <td><input type="text" step=".01" id="activityAmount" name="activityAmount" placeholder="Amount" required /></td>
        <td><input type="text" id="activityNotes" name="activityNotes" placeholder="Add notes" required></td>
        <td><div class="button_div"><button type="submit" id="submitActivity"><i class="material-icons">check</i></button></div></td>
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

// Summary
document.getElementById('filterForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  const checkboxes = document.querySelectorAll('#filterForm input[type="checkbox"]:checked');
  const types = Array.from(checkboxes).map(cb => cb.value);

  if (types.length === 0) {
    alert("Please select at least one type.");
    return;
  }

  const params = new URLSearchParams();
  if (start) {
    params.append("start", start);
  }
  if (end) {
    params.append("end", end);
  }
  types.forEach(type => params.append("types", type));

  fetch(`http://localhost:8080/api/activities/filter?${params.toString()}`)
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#filteredTable tbody');
      tbody.innerHTML = '';
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
        `;
        tbody.appendChild(row);
        // parentNode.insertBefore(newChild, referenceChild);
      });
    })
    .catch(error => {
      console.error("Error fetching filtered activities:", error);
    });
});
