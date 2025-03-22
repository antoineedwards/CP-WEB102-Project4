let spaceImage = '';
let error = null;
let loading = false;
let apiKey = 'cRwLT8zFn2DhuYaj5b165SzGtIsf0Dy4wve9hQoh';
let newResponse = {};

const fetchSpaceImage = async () => {
    try {
        if (!apiKey) {
            throw new Error('API Key is missing. Please check your .env file.');
        }

        loading = true; // Set loading to true when starting the fetch request
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=1`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        spaceImage = data[0].url;
        error = null;
    } catch (err) {
        error = err.message;
        console.error('Error fetching space image:', err);
    } finally {
        loading = false; // Set loading to false after the fetch finishes
        newResponse = response; // Store the response for later use
        console.log(newResponse); // Log the response object after it's fetched
    }
};

fetchSpaceImage();
