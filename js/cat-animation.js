// Simple Cat Animation
(function() {
    'use strict';
    
    // Wait for page load
    function initCat() {
        // Create cat container
        const container = document.createElement('div');
        container.className = 'cat-container';
        document.body.appendChild(container);

        // Create cat
        const cat = document.createElement('div');
        cat.className = 'cat';
        cat.innerHTML = '<div class="eye left"></div><div class="eye right"></div><div class="nose"></div><div class="mouth"></div><div class="tail"></div>';
        container.appendChild(cat);

        // Set initial position
        function setRandomPosition() {
            const maxX = window.innerWidth - 40;
            const maxY = window.innerHeight - 40;
            cat.style.left = Math.random() * maxX + 'px';
            cat.style.top = Math.random() * maxY + 'px';
        }
        
        setRandomPosition();

        // Add click event
        cat.addEventListener('click', function() {
            cat.style.transform = 'scale(1.5) rotate(360deg)';
            cat.style.transition = 'transform 0.5s ease';
            setTimeout(function() {
                cat.style.transform = '';
            }, 500);
            console.log('Cat clicked!');
        });

        // Add hover effects
        cat.addEventListener('mouseenter', function() {
            cat.style.transform = 'scale(1.2)';
            cat.style.transition = 'transform 0.2s ease';
        });

        cat.addEventListener('mouseleave', function() {
            cat.style.transform = '';
        });

        // Start jumping animation
        let isMoving = false;
        setInterval(function() {
            if (isMoving) return;
            
            isMoving = true;
            const maxX = window.innerWidth - 40;
            const maxY = window.innerHeight - 40;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            
            // Jump animation
            cat.style.animation = 'jump 1s ease-in-out';
            
            setTimeout(function() {
                cat.style.left = newX + 'px';
                cat.style.top = newY + 'px';
                cat.style.animation = '';
                isMoving = false;
            }, 1000);
        }, 3000);

        console.log('Cat animation started!');
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCat);
    } else {
        initCat();
    }
})();