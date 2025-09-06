// Enhanced Cat Animation with Continuous Movement
(function() {
    'use strict';
    
    // Wait for page load
    function initCat() {
        // Create cat container
        const container = document.createElement('div');
        container.className = 'cat-container';
        document.body.appendChild(container);

        // Create cat (罗小黑战记风格)
        const cat = document.createElement('div');
        cat.className = 'cat';
        cat.innerHTML = `
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="nose"></div>
            <div class="mouth"></div>
            <div class="tail"></div>
            <div class="spot spot1"></div>
            <div class="spot spot2"></div>
            <div class="spot spot3"></div>
        `;
        container.appendChild(cat);

        // Cat state
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let isMoving = false;
        let moveDirection = 1; // 1 for right, -1 for left

        // Set initial position
        function setRandomPosition() {
            const maxX = window.innerWidth - 40;
            const maxY = window.innerHeight - 40;
            currentX = Math.random() * maxX;
            currentY = Math.random() * maxY;
            cat.style.left = currentX + 'px';
            cat.style.top = currentY + 'px';
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

        // Continuous movement function
        function startContinuousMovement() {
            if (isMoving) return;
            
            isMoving = true;
            const maxX = window.innerWidth - 40;
            const maxY = window.innerHeight - 40;
            
            // Set new target position
            targetX = Math.random() * maxX;
            targetY = Math.random() * maxY;
            
            // Determine movement direction
            moveDirection = targetX > currentX ? 1 : -1;
            
            // Calculate distance and steps
            const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
            const steps = Math.max(20, Math.floor(distance / 10)); // More steps for smoother movement
            const stepX = (targetX - currentX) / steps;
            const stepY = (targetY - currentY) / steps;
            
            let currentStep = 0;
            
            // Continuous jumping animation
            cat.style.animation = 'continuousJump 0.6s ease-in-out infinite';
            
            // Move step by step
            const moveInterval = setInterval(function() {
                if (currentStep >= steps) {
                    // Movement complete
                    clearInterval(moveInterval);
                    cat.style.animation = '';
                    currentX = targetX;
                    currentY = targetY;
                    cat.style.left = currentX + 'px';
                    cat.style.top = currentY + 'px';
                    isMoving = false;
                    
                    // Start next movement after a short pause
                    setTimeout(startContinuousMovement, 1000 + Math.random() * 2000);
                    return;
                }
                
                // Update position
                currentX += stepX;
                currentY += stepY;
                cat.style.left = currentX + 'px';
                cat.style.top = currentY + 'px';
                
                // Flip cat direction based on movement
                if (moveDirection === 1) {
                    cat.style.transform = 'scaleX(1)';
                } else {
                    cat.style.transform = 'scaleX(-1)';
                }
                
                currentStep++;
            }, 50); // 50ms per step for smooth movement
        }

        // Start the continuous movement
        setTimeout(startContinuousMovement, 2000);

        console.log('Enhanced cat animation started with continuous movement!');
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCat);
    } else {
        initCat();
    }
})();