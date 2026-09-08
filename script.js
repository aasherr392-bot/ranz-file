// Tab Switching System
function switchTab(tabId) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected content and activate button
    document.getElementById(tabId).classList.add('active');
    
    // Hanapin kung aling tab button ang pinindot
    if (tabId === 'genTab') {
        document.getElementById('tabGenBtn').classList.add('active');
    } else {
        document.getElementById('tabCheckBtn').classList.add('active');
    }
}

// Reset functions para sa header buttons
function resetGenArea() {
    document.getElementById('genOutput').value = '';
    // Optional: Switch to generator tab
    switchTab('genTab');
}

function resetCheckArea() {
    document.getElementById('checkInput').value = '';
    document.getElementById('checkResults').innerHTML = '';
    // Optional: Switch to checker tab
    switchTab('checkTab');
}

// Helper: Random string functions
function getRandomHex(length) {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getRandomAlphaNum(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ML DevID Generator Logic
function generateSingleDevID() {
    // pattern: _<32hex><16alphanum>-<8hex>-<4hex>-<4hex>-<4hex>-<12hex>
    const p1 = getRandomHex(32);       
    const p2 = getRandomAlphaNum(16);  
    const p3 = getRandomHex(8);        
    const p4 = getRandomHex(4);        
    const p5 = getRandomHex(4);        
    const p6 = getRandomHex(4);        
    const p7 = getRandomHex(12);       

    return `_${p1}${p2}-${p3}-${p4}-${p5}-${p6}-${p7}`;
}

function generateBatchDevID() {
    let list = [];
    for (let i = 0; i < 50; i++) {
        list.push(generateSingleDevID());
    }
    document.getElementById('genOutput').value = list.join('\n');
}

// ML DevID Checker Logic na may simulated Statuses
function checkBatchDevID() {
    const rawInput = document.getElementById('checkInput').value.trim();
    const resultsDiv = document.getElementById('checkResults');
    resultsDiv.innerHTML = ''; // Clear old results

    if (!rawInput) {
        resultsDiv.innerHTML = '<span class="st-invalid">Maglagay ng DevIDs na ita-test!</span>';
        return;
    }

    const lines = rawInput.split('\n').slice(0, 50); // Kunin ang unang 50 lines
    const statuses = ['Active (ginagamit)', 'Inactive (di na ginagamit)', 'Not-Active (offline)'];
    
    lines.forEach((line, index) => {
        const item = line.trim();
        if(!item) return;

        // DevID Regex Pattern Match
        const pattern = /^_[a-f0-9]{32}[a-z0-9]{16}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        const isValid = pattern.test(item);

        if (isValid) {
            // Simulated random status
            const randomStatusIndex = Math.floor(Math.random() * statuses.length);
            const statusText = statuses[randomStatusIndex];
            
            let statusClass = '';
            if (randomStatusIndex === 0) statusClass = 'st-active';
            else if (randomStatusIndex === 1) statusClass = 'st-inactive';
            else statusClass = 'st-offline';

            resultsDiv.innerHTML += `
                <div class="res-item">
                    #${index + 1}: ${item.substring(0, 16)}... -> <span class="${statusClass}"><strong>${statusText}</strong></span>
                </div>
            `;
        } else {
            resultsDiv.innerHTML += `
                <div class="res-item">
                    #${index + 1}: ${item.substring(0, 16)}... -> <span class="st-invalid"><strong>Invalid Format</strong></span>
                </div>
            `;
        }
    });
}
