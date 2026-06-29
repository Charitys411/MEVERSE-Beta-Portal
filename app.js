document.getElementById('beta-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    if (!email) return;

    try {
        // 1. Fetch the CSV file containing the 10,000 codes
        const response = await fetch('FIRST_TEST_access_codes (1).csv');
        const csvText = await response.text();
        
        // 2. Parse the CSV rows into an array
        const lines = csvText.split('\n')
            .map(line => line.replace('\r', '').trim())
            .filter(line => line.length > 0 && !line.includes('Access code'));

        if (lines.length === 0) {
            alert('Error loading code base. Please try again.');
            return;
        }

        // 3. Generate a consistent hash index based on the user's email
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Ensure index is positive and wraps around the total number of codes
        const codeIndex = Math.abs(hash) % lines.length;
        const assignedCode = lines[codeIndex];

        // 4. Display the secure code to the tester
        document.getElementById('beta-form').classList.add('hidden');
        const displayArea = document.getElementById('code-display');
        displayArea.classList.remove('hidden');
        
        document.getElementById('unique-code').textContent = assignedCode;

        // Set up the official Google Play redemption link
        // Replace 'YOUR_APP_PACKAGE_NAME' with your actual Android package name later
        const playRedeemUrl = `https://play.google.com/store/apps/details?id=com.meverse.game&code=${assignedCode}`;
        document.getElementById('redeem-link').href = playRedeemUrl;

    } catch (error) {
        console.error('Error handling registration:', error);
        alert('An error occurred. Please refresh and try again.');
    }
});
