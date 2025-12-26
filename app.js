const checkBtn = document.getElementById('checkBtn');
const resultCard = document.getElementById('result');
const statusText = document.getElementById('statusText');
const resId = document.getElementById('resId');
const resDate = document.getElementById('resDate');

checkBtn.addEventListener('click', async () => {
    const jobId = document.getElementById('jobId').value;
    const token = document.getElementById('token').value;

    if (!jobId || !token) {
        alert("Please enter both Job ID and Token");
        return;
    }

    // Reset UI
    checkBtn.textContent = "Checking...";
    checkBtn.disabled = true;
    resultCard.className = "result-card hidden";

    try {
        
        const url = `https://corsproxy.io/?` + encodeURIComponent(`https://uat-barcreports.barcindia.in/api/data-processing/jobs/${jobId}`);
        // const url = `https://uat-barcreports.barcindia.in/api/data-processing/jobs/${jobId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${token}`
                // Note: 'Origin' and 'Referer' cannot be set manually in browser fetch
                // due to security policies.
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // Data is an array [ { ... } ]
        if (Array.isArray(data) && data.length > 0) {
            const jobData = data[0]; // Get the first object
            updateUI(jobData);
        } else {
            throw new Error("Empty response or invalid format");
        }

    } catch (error) {
        showError(error.message);
    } finally {
        checkBtn.textContent = "Check Status";
        checkBtn.disabled = false;
    }
});

function updateUI(data) {
    resultCard.classList.remove('hidden', 'error', 'success', 'running');
    
    // Set Status Text
    statusText.textContent = data.status;
    resId.textContent = data.id;
    resDate.textContent = new Date(data.createdAt).toLocaleString();

    // Color coding based on status
    if (data.status === 'COMPLETED') {
        resultCard.classList.add('success');
    } else if (data.status === 'RUNNING') {
        resultCard.classList.add('running');
    } else {
        resultCard.classList.add('error'); // Default for failed/cancelled
    }
}

function showError(msg) {
    resultCard.classList.remove('hidden');
    resultCard.classList.add('error');
    statusText.textContent = "ERROR";
    resId.textContent = "-";
    resDate.textContent = msg; // Display error message in date field
}
