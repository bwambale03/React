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

// AR Preview Handling
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
    // handle grab deal button
    document.querySelectorAll('.grab-deal-btn').forEach(button => {
        button.addEventListener('click', () => {
            concole.log('button clicked!')
            const eventId = button.dataset.eventId;
            window.location.href = `/grab-deal/${eventId}` // redirecting to comfirm submission
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

// Utility function to fetch JSON safely
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
