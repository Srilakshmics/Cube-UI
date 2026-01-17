document.addEventListener('DOMContentLoaded', function () {
    initHamburgerMenu();
    initImageGallery();
    initRadioButtons();
    initAccordion();
    initCounterAnimation();
    initLazyLoading();
    initScrollReveal();
});

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');

    if (hamburger && navMobile) {
        hamburger.addEventListener('click', function () {
            const isActive = this.classList.toggle('active');
            navMobile.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive);

            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        const navLinks = navMobile.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMobile.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

function initImageGallery() {
    const mainImage = document.querySelector('.gallery-main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');


    const images = [
        'assets/images/product1.png',
        'assets/images/product2.png',
        'assets/images/product3.png',
        'assets/images/product4.png'
    ];

    let currentIndex = 0;

    function updateGallery(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentIndex = index;

        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = images[currentIndex];
            mainImage.setAttribute('data-index', currentIndex);
            mainImage.style.opacity = '1';
        }, 200);

        thumbnails.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function () {
            updateGallery(index);
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            updateGallery(index);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            updateGallery(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            updateGallery(currentIndex + 1);
        });
    }


    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            updateGallery(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            updateGallery(currentIndex + 1);
        }
    });


    let touchStartX = 0;
    let touchEndX = 0;

    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
        galleryMain.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        galleryMain.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                updateGallery(currentIndex + 1);
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                updateGallery(currentIndex - 1);
            }
        }
    }
}




function initRadioButtons() {
    const purchaseTypeRadios = document.querySelectorAll('input[name="purchase-type"]');
    const fragrance1Radios = document.querySelectorAll('input[name="fragrance-1"]');
    const fragrance2Radios = document.querySelectorAll('input[name="fragrance-2"]');
    const addToCartBtn = document.getElementById('addToCartBtn');




    function updateSubscriptionDetails() {
        const selectedPurchaseType = document.querySelector('input[name="purchase-type"]:checked');
        const allSubscriptionDetails = document.querySelectorAll('.subscription-details');

        allSubscriptionDetails.forEach(detail => {
            detail.classList.remove('active');
        });

        if (selectedPurchaseType) {
            const subscriptionOption = selectedPurchaseType.closest('.subscription-option');
            const subscriptionDetail = subscriptionOption.querySelector('.subscription-details');

            if (subscriptionDetail) {
                subscriptionDetail.classList.add('active');
            }
        }
    }


    function getCurrentSelections() {
        const purchaseType = document.querySelector('input[name="purchase-type"]:checked')?.value || 'double';
        const fragrance1 = document.querySelector('input[name="fragrance-1"]:checked')?.value || 'original';
        const fragrance2 = document.querySelector('input[name="fragrance-2"]:checked')?.value || 'original';

        return { purchaseType, fragrance1, fragrance2 };
    }


    function updateAddToCartUrl() {
        const { purchaseType, fragrance1, fragrance2 } = getCurrentSelections();



        let cartUrl = `${baseCartUrl}?type=${purchaseType}`;

        if (purchaseType === 'single') {

            cartUrl += `&fragrance=${fragrance1}`;
        } else if (purchaseType === 'double') {

            cartUrl += `&fragrance1=${fragrance1}&fragrance2=${fragrance2}`;
        }


        if (addToCartBtn) {
            addToCartBtn.href = cartUrl;


            addToCartBtn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 100);
        }


        console.log('Cart URL Updated:', cartUrl);
    }


    purchaseTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            updateSubscriptionDetails();
            updateAddToCartUrl();
        });
    });


    fragrance1Radios.forEach(radio => {
        radio.addEventListener('change', updateAddToCartUrl);
    });

    fragrance2Radios.forEach(radio => {
        radio.addEventListener('change', updateAddToCartUrl);
    });


    updateSubscriptionDetails();
    updateAddToCartUrl();
}




function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', function () {
            const isActive = item.classList.contains('active');


            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });


            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}




function initCounterAnimation() {
    const statsSection = document.getElementById('statsSection');
    const statElements = document.querySelectorAll('.stat-percentage');
    let hasAnimated = false;

    function animateCounter(element, target, duration = 2000) {
        let startValue = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            startValue += increment;

            if (startValue < target) {
                element.textContent = Math.floor(startValue);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;

                statElements.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, {
        threshold: 0.5
    });

    if (statsSection) {
        observer.observe(statsSection);
    }
}




function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');


    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;


                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }


                img.addEventListener('load', function () {
                    img.classList.add('loaded');
                });


                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}




function initScrollReveal() {
    const revealElements = document.querySelectorAll('.product-section, .collection-section, .comparison-section');

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');


        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});




let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop;
});




const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('.newsletter-input');
        const email = emailInput.value;


        if (email && validateEmail(email)) {

            alert('Thank you for subscribing! 🎉');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}






function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


window.addEventListener('resize', debounce(function () {

    console.log('Window resized');
}, 250));






document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
});


const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-green) !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);




document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {

        this.style.background = '#f3f4f6';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.alt = 'Image not available';
    });
});




console.log('%c Welcome to GTG Perfumes! ', 'background: #047857; color: white; font-size: 16px; padding: 10px;');
console.log('%c Live your best life with our signature scents ', 'color: #047857; font-size: 12px;');




if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHamburgerMenu,
        initImageGallery,
        initRadioButtons,
        initAccordion,
        initCounterAnimation,
        initLazyLoading,
        validateEmail
    };
}
