document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get bot ID from URL (e.g., ?bot=bellabot-pro)
    const urlParams = new URLSearchParams(window.location.search);
    const botId = urlParams.get('bot');

    if (!botId) {
        document.getElementById('loading').innerHTML = '<h2>No robot specified. <a href="index.html" style="color:var(--accent)">Go back</a></h2>';
        return;
    }

    try {
        // 2. Fetch products database
        const response = await fetch('products_db.json');
        const db = await response.json();

        // 3. Find the robot
        let botData = null;
        for (const key in db) {
            if (db[key].id === botId) {
                botData = db[key];
                break;
            }
        }

        if (!botData) {
            document.getElementById('loading').innerHTML = `<h2>Robot "${botId}" not found or coming soon. <a href="index.html" style="color:var(--accent)">Go back</a></h2>`;
            return;
        }

        // 4. Populate DOM
        document.title = `${botData.name} | Alma Kinetics`;
        
        document.getElementById('prod-name').innerText = botData.name;
        document.getElementById('prod-subtitle').innerText = botData.subtitle;
        document.getElementById('prod-hero-desc').innerText = botData.hero_description;
        document.getElementById('prod-hero-img').src = botData.hero_image;
        document.getElementById('prod-alma-value-text').innerText = botData.alma_value;

        // Populate Features
        const featuresGrid = document.getElementById('prod-features-grid');
        botData.features.forEach(f => {
            const featureCard = document.createElement('div');
            featureCard.className = 'prod-feature-card';
            featureCard.innerHTML = `
                <ion-icon name="${f.icon}" class="prod-feature-icon"></ion-icon>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
            `;
            featuresGrid.appendChild(featureCard);
        });

        // Populate Specs
        const specsTable = document.getElementById('specs-table');
        for (const [key, value] of Object.entries(botData.specs)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${key}</td>
                <td>${value}</td>
            `;
            specsTable.appendChild(row);
        }

        // Hide loading, show content
        document.getElementById('loading').style.display = 'none';
        const content = document.getElementById('product-content');
        content.style.display = 'block';
        
        // Trigger reflow for fade in effect if we wanted to add it
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.transition = 'opacity 0.8s ease';
            content.style.opacity = '1';
        }, 50);

    } catch (err) {
        console.error('Error loading product data:', err);
        document.getElementById('loading').innerHTML = '<h2>Error loading data. <a href="index.html" style="color:var(--accent)">Go back</a></h2>';
    }
});
