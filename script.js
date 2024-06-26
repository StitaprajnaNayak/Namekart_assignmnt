
const clientId = '89fbb62fd8d94237909f5954fabe2d62';
const clientSecret = '2439db9a213046d381677de20da81c35';

// Get Spotify Access Token
async function getSpotifyToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

// Fetch data from Spotify
async function fetchSpotifyData(token) {
    const result = await fetch('https://api.spotify.com/v1/search?q=year:2023&type=track&market=IN&limit=50', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.tracks.items;
}

// Main function to get data
async function getData() {
    const token = await getSpotifyToken();
    const tracks = await fetchSpotifyData(token);
    return tracks;
}


async function initializeCharts() {
    const data = await getData();
    
    const trackNames = data.map(track => track.name);
    const popularity = data.map(track => track.popularity);
    const releaseDates = data.map(track => new Date(track.album.release_date).toLocaleDateString());

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: trackNames,
            datasets: [{
                label: 'Popularity',
                data: popularity,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
    }});

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: releaseDates,
            datasets: [{
                label: 'Popularity Over Time',
                data: popularity,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
    }});

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: trackNames,
            datasets: [{
                label: 'Popularity',
                data: popularity,
                backgroundColor: trackNames.map(() => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`),
                borderColor: trackNames.map(() => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)`),
                borderWidth: 1
            }]
    }});
}

document.getElementById('filterButton').addEventListener('click', () => {
    // Implement filtering logic here
});

initializeCharts();

document.getElementById('filterButton').addEventListener('click', () => {
    const filteredTracks = data.filter(track => track.popularity > 50); // Example filter
    updateCharts(filteredTracks);
});

function updateCharts(filteredData) {
    const trackNames = filteredData.map(track => track.name);
    const popularity = filteredData.map(track => track.popularity);
    const releaseDates = filteredData.map(track => new Date(track.album.release_date).toLocaleDateString());

    // Update Bar Chart
    barChart.data.labels = trackNames;
    barChart.data.datasets[0].data = popularity;
    barChart.update();

    // Update Line Chart
    lineChart.data.labels = releaseDates;
    lineChart.data.datasets[0].data = popularity;
    lineChart.update();

    // Update Pie Chart
    pieChart.data.labels = trackNames;
    pieChart.data.datasets[0].data = popularity;
    pieChart.update();
}
