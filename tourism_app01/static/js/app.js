document.addEventListener('DOMContentLoaded', () => {
    // Initialize all event listeners and functionality
    initializeForms();
    initializeNavbar();
    initializeCards();
    initializeMap();
    initializeAutocomplete();
    initializeTrendingHashtags();
    initializeARPreview();
    initializeCountdownTimers();
    initializePaymentForm();
    initializeSpinGlobe();
    initializeTravelQuiz();
    initializeNewsSection();
    initializeQuickMessageForm();
    initializeTripPlanner();
});

// Form Handling
function initializeForms() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Disable submit buttons during form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
                }, 2000); // Simulate async delay
            }
        });
    });
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('validated');
        return;
    }

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (data.success) {
            document.getElementById('newsletterSuccess').classList.remove('d-none');
            form.reset();
            form.classList.remove('needs-validation');
            setTimeout(() => document.getElementById('newsletterSuccess').classList.add('d-none'), 3000);
        } else {
            alert(data.message || 'Oops! Try again.');
        }
    } catch (error) {
        alert('Something went wrong!');
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("{{ url_for('routes.contact') }}", {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        alert(data.message); // Show success message
        form.reset(); // Clear the form
        $('#contactModal').modal('hide'); // Close the modal
    } catch (error) {
        console.error('Error:', error);
        alert('Message submission failed. Please try again.');
    }
}

// Navbar Handling
function initializeNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }
}

// Card Hover Effects
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
    });
}

// Map Initialization
function initializeMap() {
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: [0, 20], // Default center (longitude, latitude)
        zoom: 2, // Default zoom level
        apiKey: '{{ config.MAPTILER_API_KEY }}' // Use your MapTiler API key
    });

    const destinations = [
        { name: "Paris", coordinates: [2.3522, 48.8566] },
        { name: "New York", coordinates: [-74.006, 40.7128] },
        { name: "Tokyo", coordinates: [139.6917, 35.6895] },
        { name: "Sydney", coordinates: [151.2093, -33.8688] },
        { name: "Cape Town", coordinates: [18.4241, -33.9249] }
    ];

    destinations.forEach(dest => {
        new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat(dest.coordinates)
            .setPopup(new maptilersdk.Popup().setHTML(`<b>${dest.name}</b>`))
            .addTo(map);
    });
}

// Autocomplete Handling
function initializeAutocomplete() {
    const searchInput = document.getElementById('search-input');
    const autocompleteResults = document.getElementById('autocomplete-results');

    if (searchInput && autocompleteResults) {
        searchInput.addEventListener('input', async function () {
            const query = this.value.trim();
            if (query.length < 2) {
                autocompleteResults.style.display = 'none';
                return;
            }

            try {
                const data = await fetchJSON(`/api/search?q=${encodeURIComponent(query)}`);
                if (data.length > 0) {
                    autocompleteResults.innerHTML = data.map(dest => `
                        <a href="/destinations/${dest.id}" class="list-group-item list-group-item-action">
                            ${dest.name}
                        </a>
                    `).join('');
                    autocompleteResults.style.display = 'block';
                } else {
                    autocompleteResults.style.display = 'none';
                }
            } catch (error) {
                console.error('Error fetching autocomplete results:', error);
            }
        });

        // Hide autocomplete results when clicking outside
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
                autocompleteResults.style.display = 'none';
            }
        });
    }
}

// Trending Hashtags Handling
function initializeTrendingHashtags() {
    const hashtagsContainer = document.getElementById('trending-hashtags');
    if (hashtagsContainer) {
        fetch('/api/trending-hashtags')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    hashtagsContainer.innerHTML = data.map(tag => `
                        <a href="/social/feed?search=%23${tag.hashtag.replace('#', '')}" class="btn btn-outline-primary btn-sm">
                            ${tag.hashtag} <span class="badge bg-secondary">${tag.count}</span>
                        </a>
                    `).join('');
                } else {
                    hashtagsContainer.innerHTML = '<p>No trending hashtags yet.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching trending hashtags:', error);
                hashtagsContainer.innerHTML = '<p>Failed to load trending hashtags.</p>';
            });
    }
}

// AR Preview Handling// ... Previous code (unchanged) ...

function initializeARPreview() {
    document.querySelectorAll('.ar-preview-btn').forEach(button => {
        button.addEventListener('click', () => {
            const destinationId = button.dataset.destinationId;
            const arModel = button.dataset.arModel;
            if (arModel) {
                window.location.href = `/ar_experience/${destinationId}`;
            } else {
                alert('No AR model available for this destination yet! 🚧');
            }
        });
    });
}

// Countdown Timer Handling
function initializeCountdownTimers() {
    document.querySelectorAll('.countdown-timer').forEach(timer => {
        const expiresAt = new Date(timer.dataset.expires).getTime();
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = expiresAt - now;

            if (distance < 0) {
                timer.innerHTML = "Deal Expired! 🔥";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timer.querySelector('.days').textContent = days;
            timer.querySelector('.hours').textContent = hours;
            timer.querySelector('.minutes').textContent = minutes;
            timer.querySelector('.seconds').textContent = seconds;
        };

        updateTimer(); // Initial call
        setInterval(updateTimer, 1000); // Update every second

    });
    
    // handle grab-deal-btn
    document.querySelectorAll('.grab-deal-btn').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Button Clicked!')
            const eventId = button.dataset.eventId
            window.location.href = `/grab-deal/${eventId}`
        })
    })
}

// Payment Form Handling
function initializePaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;

            // Basic Validation
            const cardRegex = /^\d{16}$/;
            const expiryRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
            const cvvRegex = /^\d{3,4}$/;

            if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
                alert('Invalid card number! Use 16 digits.');
                return;
            }
            if (!expiryRegex.test(expiry)) {
                alert('Invalid expiry date! Use MM/YY format.');
                return;
            }
            if (!cvvRegex.test(cvv)) {
                alert('Invalid CVV! Use 3-4 digits.');
                return;
            }

            // Submit if valid
            paymentForm.submit();
        });
    }
}


// Spin the Globe Handling
function initializeSpinGlobe() {
    const spinButton = document.getElementById('spin-globe-btn');
    const resultDiv = document.getElementById('globe-result');
    const resultImage = document.getElementById('result-image');
    const resultName = document.getElementById('result-name');
    const resultDescription = document.getElementById('result-description');
    const resultBestTime = document.getElementById('result-best-time');
    const resultRating = document.getElementById('result-rating');
    const resultCategory = document.getElementById('result-category');
    const resultLink = document.getElementById('result-link');

    if (spinButton) {
        spinButton.addEventListener('click', async () => {
            spinButton.disabled = true;
            spinButton.textContent = 'Spinning...';
            resultDiv.style.display = 'none';

            // Simulate spinning animation
            spinButton.classList.add('animate__rotateOut');
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s spin effect

            try {
                const response = await fetch('/spin-globe');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch destination');
                }
                const data = await response.json();

                resultImage.src = data.image_url;
                resultName.textContent = data.name;
                resultDescription.textContent = data.description;
                resultBestTime.textContent = `Best Time: ${data.best_time}`;
                resultRating.textContent = `Rating: ${data.rating}`;
                resultCategory.textContent = `Category: ${data.category}`;
                resultLink.href = `/destination_detail_dynamic/${data.id}`;
                resultLink.textContent = `Explore ${data.name}`;
                resultDiv.style.display = 'block';
            } catch (error) {
                console.error('Spin Globe error:', error);
                alert(error.message || 'Failed to spin the globe!');
            }

            spinButton.classList.remove('animate__rotateOut');
            spinButton.textContent = 'Spin Again!';
            spinButton.disabled = false;
        });
    }
}


// Travel Quiz Handling
function initializeTravelQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizSubmit = document.getElementById('quiz-submit');
    const quizResult = document.getElementById('quiz-result');
    const quizNext = document.getElementById('quiz-next');
    let currentQuestion = null;

    if (quizContainer) {
        loadQuizQuestion();

        quizSubmit.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
            if (selectedOption) {
                checkAnswer(selectedOption.value);
            } else {
                alert('Please select an answer!');
            }
        });

        quizNext.addEventListener('click', () => {
            quizResult.textContent = '';
            quizNext.style.display = 'none';
            quizSubmit.disabled = false;
            loadQuizQuestion();
        });
    }

    async function loadQuizQuestion() {
        try {
            const response = await fetch('/travel-quiz');
            const data = await response.json();
            currentQuestion = data.question;
            quizQuestion.textContent = data.question;
            quizOptions.innerHTML = data.options.map((option, index) => `
                <div class="form-check">
                    <input type="radio" class="form-check-input" name="quiz-option" id="option${index}" value="${option}">
                    <label class="form-check-label" for="option${index}">${option}</label>
                </div>
            `).join('');
            quizSubmit.disabled = false;
        } catch (error) {
            console.error('Quiz load error:', error);
            alert('Failed to load quiz!');
        }
    }

    async function checkAnswer(answer) {
        try {
            const response = await fetch('/travel-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuestion, answer: answer })
            });
            const data = await response.json();
            quizResult.textContent = data.message;
            quizSubmit.disabled = true;
            quizNext.style.display = 'block';
            if (data.correct) {
                quizResult.classList.add('text-success');
            } else {
                quizResult.classList.add('text-danger');
            }
        } catch (error) {
            console.error('Quiz check error:', error);
            alert('Failed to check answer!');
        }
    }
}


// News Section Handling
function initializeNewsSection() {
    const newsCarousel = document.getElementById('news-carousel');

    if (newsCarousel) {
        fetchNews();

        // Auto-scroll every 5 seconds
        setInterval(() => {
            const firstItem = newsCarousel.firstElementChild;
            newsCarousel.appendChild(firstItem.cloneNode(true));
            firstItem.remove();
        }, 5000);
    }

    async function fetchNews() {
        try {
            const response = await fetch('/news');
            const newsItems = await response.json();
            renderNews(newsItems);
        } catch (error) {
            console.error('News fetch error:', error);
            newsCarousel.innerHTML = '<p>Failed to load news!</p>';
        }
    }

    function renderNews(newsItems) {
        newsCarousel.innerHTML = newsItems.map(item => `
            <div class="news-card card shadow-sm mx-3" style="min-width: 300px;">
                <img src="${item.image_url}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.snippet}</p>
                    <a href="/news/${item.id}" class="btn btn-primary read-more-btn">Read More</a>
                </div>
            </div>
        `).join('');

        // No need for individual button listeners since it's now a link
    }
}

// Quick Message Form Handling
function initializeQuickMessageForm() {
    const messageForm = document.getElementById('quick-message-form');
    const messageResult = document.getElementById('message-result');

    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(messageForm);

            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                messageResult.textContent = data.message;
                if (data.success) {
                    messageResult.classList.add('text-success');
                    messageForm.reset();
                } else {
                    messageResult.classList.add('text-danger');
                }
            } catch (error) {
                console.error('Message submission error:', error);
                messageResult.textContent = 'Failed to send message!';
                messageResult.classList.add('text-danger');
            }
        });
    }
}

// Trip Planner Handling
function initializeTripPlanner() {
    const tripForm = document.getElementById('trip-planner-form');
    const itineraryDisplay = document.getElementById('itinerary-display');
    const itineraryCost = document.getElementById('itinerary-cost');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const tabs = document.querySelectorAll('.tab-pane');
    const navLinks = document.querySelectorAll('#wizard-steps .nav-link');

    // Wizard Navigation
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTab = document.querySelector('.tab-pane.show');
            const nextTab = currentTab.nextElementSibling;
            if (nextTab) {
                currentTab.classList.remove('show', 'active');
                nextTab.classList.add('show', 'active');
                updateNav(nextTab.id);
                updatePreview();
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTab = document.querySelector('.tab-pane.show');
            const prevTab = currentTab.previousElementSibling;
            if (prevTab) {
                currentTab.classList.remove('show', 'active');
                prevTab.classList.add('show', 'active');
                updateNav(prevTab.id);
            }
        });
    });

    function updateNav(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    function updatePreview() {
        document.getElementById('preview-name').textContent = document.getElementById('trip_name').value || 'N/A';
        document.getElementById('preview-dates').textContent = `${document.getElementById('start_date').value || 'N/A'} to ${document.getElementById('end_date').value || 'N/A'}`;
        const selectedDests = Array.from(document.getElementById('destinations').selectedOptions).map(opt => opt.value).join(', ') || 'None';
        document.getElementById('preview-destinations').textContent = selectedDests;
        const prefs = Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value).join(', ') || 'None';
        document.getElementById('preview-preferences').textContent = prefs;
    }

    // Form Submission for Itinerary
    if (tripForm) {
        tripForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(tripForm);

            try {
                const response = await fetch('/trip-planner', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                // Mock trip and itinerary data for display
                const trip = {
                    name: document.getElementById('trip_name').value,
                    start_date: document.getElementById('start_date').value,
                    end_date: document.getElementById('end_date').value,
                    destinations: Array.from(document.getElementById('destinations').selectedOptions).map(opt => opt.value),
                    preferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value)
                };
                const itinerary = data.days.map((day, index) => ({
                    date: new Date(document.getElementById('start_date').value).addDays(index).toISOString().split('T')[0],
                    destination: day.split(': ')[1].split(' - ')[0],
                    activity: day.split(' - ')[1].split(' (Cost: ')[0],
                    weather_forecast: "Sunny" // Mock weather
                }));

                // Update display
                document.querySelector('#itinerary-display h2').textContent = trip.name;
                document.querySelector('.timeline').innerHTML = itinerary.map(day => `
                    <div class="timeline-item mb-4">
                        <div class="timeline-marker"></div>
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Day ${itinerary.indexOf(day) + 1}: ${day.date}</h5>
                                <p class="card-text"><strong>${day.destination}</strong> - ${day.activity}</p>
                                <small class="text-muted">Weather: ${day.weather_forecast}</small>
                            </div>
                        </div>
                    </div>
                `).join('');
                itineraryCost.textContent = `Estimated Cost: $${data.total_cost.toFixed(2)}`;
                itineraryDisplay.style.display = 'block';
                itineraryDisplay.classList.add('animate__fadeIn');
                setTimeout(() => itineraryDisplay.classList.remove('animate__fadeIn'), 1000);
            } catch (error) {
                console.error('Trip planner error:', error);
                alert('Failed to plan trip!');
            }
        });
    }

    // Polyfill for Date.addDays
    Date.prototype.addDays = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
}


async function fetchJSON(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
