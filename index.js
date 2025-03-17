// initialization
const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")

const navToggle = document.querySelector("#nav-dropdown-toggle-0")
const navDropdown = document.querySelector("#nav-dropdown-list-0")

function onHeaderClickOutside(e) {

    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }

}


function toggleHeader() {
    if (isHeaderCollapsed) {
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "90vh"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        document.body.classList.add("modal-open")

        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)

    } else {
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "0vh"
        
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")  
        
        collapseBtn.classList.add("bi-list")
        document.body.classList.remove("modal-open")

        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)

    }
}

function responsive() {
    if (!isHeaderCollapsed){
        toggleHeader()
    }

    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.height = ""
        navToggle.addEventListener("mouseenter", openNavDropdown)
        navToggle.addEventListener("mouseleave", navMouseLeave)

    } else {
        isHeaderCollapsed = true
        navToggle.removeEventListener("mouseenter", openNavDropdown)
        navToggle.removeEventListener("mouseleave", navMouseLeave)
    }
}
responsive()
window.addEventListener("resize", responsive)

/** Dark and light theme */
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    //toggle between dark and light mode
    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
    
}

function updateToggleModeBtn(){

    const toggleIcon = document.querySelector("#toggle-mode-icon")
    
    if (document.documentElement.classList.contains("tw-dark")){
        // dark mode
        toggleIcon.classList.remove("bi-sun")
        toggleIcon.classList.add("bi-moon")
        localStorage.setItem("color-mode", "dark")
        
    }else{
        toggleIcon.classList.add("bi-sun")
        toggleIcon.classList.remove("bi-moon")
        localStorage.setItem("color-mode", "light")
    }

}


const promptWindow =  new Prompt("#pixa-playground")
const promptForm = document.querySelector("#prompt-form")
const promptInput = promptForm.querySelector("input[name='prompt']")

const MAX_PROMPTS = 3

promptForm.addEventListener("submit", (event) => {
    event.preventDefault()

    // window.open("https://github.com/PaulleDemon", "_blank")

    if (promptWindow.promptList.length >= MAX_PROMPTS)
        return false

    promptWindow.addPrompt(promptInput.value)
    promptInput.value = ""
    
    if (promptWindow.promptList.length >= MAX_PROMPTS){
        // prompt signup once the user makes 3 prompts, ideally must be throttled via backend API
        const signUpPrompt = document.querySelector("#signup-prompt")
        signUpPrompt.classList.add("tw-scale-100")
        signUpPrompt.classList.remove("tw-scale-0")

        promptForm.querySelectorAll("input").forEach(e => {e.disabled = true})
    }

    return false
})

const dropdowns = document.querySelectorAll('.dropdown')
dropdowns.forEach(dropdown => new Dropdown(`#${dropdown.id}`, promptWindow.setAIModel))


navToggle.addEventListener("click", toggleNavDropdown)
navDropdown.addEventListener("mouseleave", closeNavDropdown)

function toggleNavDropdown(){

    if (navDropdown.getAttribute("data-open") === "true"){
        closeNavDropdown()
    }else{
        openNavDropdown()
    }
}

function navMouseLeave(){
    setTimeout(closeNavDropdown, 100)
}

function openNavDropdown(event){

    navDropdown.classList.add("tw-opacity-100", "tw-scale-100", 
                            "max-lg:tw-min-h-[450px]", "max-lg:!tw-h-fit", "tw-min-w-[320px]")
    
    navDropdown.setAttribute("data-open", true)

}

function closeNavDropdown(event){

    // console.log("event target: ", event.target, event.target.contains(navDropdown))
    
    if (navDropdown.matches(":hover")){
        return
    }

    navDropdown.classList.remove("tw-opacity-100", "tw-scale-100", 
        "max-lg:tw-min-h-[450px]", "tw-min-w-[320px]", "max-lg:!tw-h-fit",)

    navDropdown.setAttribute("data-open", false)

}


const videoBg = document.querySelector("#video-container-bg")
const videoContainer = document.querySelector("#video-container")

function openVideo(){
    videoBg.classList.remove("tw-scale-0", "tw-opacity-0")
    videoBg.classList.add("tw-scale-100", "tw-opacity-100")
    videoContainer.classList.remove("tw-scale-0")
    videoContainer.classList.add("tw-scale-100")

    document.body.classList.add("modal-open")
}

function closeVideo(){
    videoContainer.classList.add("tw-scale-0")
    videoContainer.classList.remove("tw-scale-100")

    setTimeout(() => {
        videoBg.classList.remove("tw-scale-100", "tw-opacity-100")
        videoBg.classList.add("tw-scale-0", "tw-opacity-0")
    }, 400)
   

    document.body.classList.remove("modal-open")

}

/**
 * Animations
 */

const typed = new Typed('#prompts-sample', {
    strings: ["How can I use AI to improve my workflow?", 
                "What's NexusAI playground?", 
                "How to build an AI-powered application?", 
                "How to integrate NexusAI API?"],
    typeSpeed: 80,
    smartBackspace: true, 
    loop: true,
    backDelay: 2000,
})

gsap.registerPlugin(ScrollTrigger)

// straightens the slanting image
gsap.to("#dashboard", {
    scale: 1,
    translateY: 0,
    // translateY: "0%",
    rotateX: "0deg",
    scrollTrigger: {
        trigger: "#hero-section",
        start: window.innerWidth > RESPONSIVE_WIDTH ? "top 95%" : "top 70%",
        end: "bottom bottom",
        scrub: 1,
        markers: false,
    }
})

const faqAccordion = document.querySelectorAll('.faq-accordion')

faqAccordion.forEach(function (btn) {
    btn.addEventListener('click', function () {
        this.classList.toggle('active')

        // Toggle 'rotate' class to rotate the arrow
        let content = this.nextElementSibling
        let icon = this.querySelector(".bi-plus")

        // content.classList.toggle('!tw-hidden')
        if (content.style.maxHeight === '240px') {
            content.style.maxHeight = '0px'
            content.style.padding = '0px 18px'
            icon.style.transform = "rotate(0deg)"
            
        } else {
            content.style.maxHeight = '240px'
            content.style.padding = '20px 18px'
            icon.style.transform = "rotate(45deg)"
        }
    })
})



// ------------- reveal section animations ---------------

// const sectionsReveal = gsap.utils.toArray("section")
// 
// sectionsReveal.forEach((sec) => {
// 
//     const revealUptimeline = gsap.timeline({paused: true, 
//                                         scrollTrigger: {
//                                                         trigger: sec,
//                                                         start: "top 95%",
//                                                         end: "20% 95%",
//                                                         // markers: true,
//                                                         // scrub: 1,
//                                                     }})
// 
//     revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
//         opacity: 1,
//         duration: 0.8,
//         y: "0%",
//         stagger: 0.2,
//     })
// 
// 
// })

// Initialize advanced cursor with follower
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    // Add cursor follower element
    const follower = document.createElement('div');
    follower.classList.add('cursor-follower');
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', (e) => {
        // Main cursor follows mouse exactly
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power1.out"
        });
        
        // Follower follows with delay
        gsap.to(follower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power3.out"
        });
    });
    
    // Enhanced hover effects
    const interactiveElements = document.querySelectorAll('a, .btn, button, input, textarea, [role="button"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
            
            // Scale effect for buttons
            if (el.classList.contains('btn')) {
                gsap.to(el, {
                    scale: 1.03,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
            
            // Reset scale for buttons
            if (el.classList.contains('btn')) {
                gsap.to(el, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Handle cursor visibility
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
}

// Premium animations with GSAP
function initPremiumAnimations() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Text splitting for premium animations
    const headings = document.querySelectorAll('h2, h3, .premium-text');
    headings.forEach(heading => {
        heading.classList.add('premium-heading');
    });
    
    // Hero section animations with premium feel
    const heroTL = gsap.timeline();
    
    heroTL.from(".hero-section h2", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "expo.out",
        delay: 0.2
    })
    .from(".hero-section .btn", {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.1,
    }, "-=0.8");
    
    // Make images visible immediately
    const images = document.querySelectorAll('img:not(.skip-animation)');
    images.forEach(img => {
        img.classList.add('reveal-image');
        
        // Instead of adding 'revealed' immediately, use ScrollTrigger with earlier trigger
        ScrollTrigger.create({
            trigger: img,
            start: "top 95%", // Show images earlier but still with a reveal effect
            once: true,
            onEnter: () => {
                img.classList.add('revealed');
                
                // Add subtle rotation on hover
                img.addEventListener('mouseenter', () => {
                    gsap.to(img, {
                        scale: 1.03,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
                
                img.addEventListener('mouseleave', () => {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            }
        });
    });
    
    // Parallax mouse movement effect
    document.addEventListener('mousemove', (e) => {
        const parallaxItems = document.querySelectorAll('.purple-bg-grad, #dashboard');
        
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
        
        parallaxItems.forEach(item => {
            // Different parallax intensities for different elements
            const speedFactor = item.classList.contains('purple-bg-grad') ? 0.5 : 0.2;
            
            gsap.to(item, {
                x: xPos * speedFactor,
                y: yPos * speedFactor,
                duration: 1,
                ease: "power2.out",
            });
        });
    });
    
    // Add class for premium card effects
    document.querySelectorAll('.reveal-up').forEach(card => {
        if (card.classList.contains('tw-rounded-lg') || 
            card.classList.contains('tw-border-[1px]') || 
            card.classList.contains('tw-bg-[#f6f7fb]')) {
            card.classList.add('card-premium');
        }
    });
    
    // Enhanced reveal-up animations - keep only this one animation for reveal-up elements
    gsap.utils.toArray(".reveal-up").forEach((elem, index) => {
        // Set initial state
        gsap.set(elem, { 
            y: 80, 
            opacity: 0,
            scale: 0.95
        });
        
        // Create animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 95%", // Adjusted from 99% to 90% - earlier but not immediate
                once: true
            }
        });
        
        tl.to(elem, {
            duration: 0.7,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            delay: index * 0.01, // Slightly reduced delay between elements
            clearProps: "scale" // Clear scale to avoid performance issues
        });
    });
    
    // Purple gradient parallax enhanced
    gsap.utils.toArray(".purple-bg-grad").forEach(elem => {
        gsap.to(elem, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: elem,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.1
            }
        });
        
        // Add glow effect on scroll
        ScrollTrigger.create({
            trigger: elem,
            start: "top center",
            end: "bottom center",
            scrub: true,
            onUpdate: (self) => {
                // Adjust glow based on scroll progress
                const progress = self.progress;
                elem.style.filter = `blur(20px) opacity(${0.3 + progress * 0.4})`;
                elem.style.transform = `scale(${1 + progress * 0.1})`;
            }
        });
    });
    
    // Smooth header animation
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                gsap.to(header, {
                    yPercent: -100,
                    duration: 0.4,
                    ease: "power3.inOut"
                });
            } else {
                gsap.to(header, {
                    yPercent: 0,
                    duration: 0.4,
                    ease: "power3.inOut"
                });
            }
        }
        
        lastScroll = currentScroll;
    });
    
    // Add scroll-based color transitions
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index % 2 === 1) { // Every other section
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    gsap.to(section, {
                        backgroundColor: "rgba(99, 102, 241, 0.03)",
                        duration: 0.3
                    });
                },
                onLeave: () => {
                    gsap.to(section, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        duration: 0.3
                    });
                },
                onEnterBack: () => {
                    gsap.to(section, {
                        backgroundColor: "rgba(99, 102, 241, 0.03)",
                        duration: 0.3
                    });
                },
                onLeaveBack: () => {
                    gsap.to(section, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        duration: 0.3
                    });
                }
            });
        }
    });
}

// Update preloader to be more premium
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentage = document.getElementById('preloader-percentage');
    const bar = document.getElementById('preloader-bar');
    
    // Ensure the preloader completes in exactly 2 seconds
    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    // Start counter animation
    function updateLoader() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsedTime / duration) * 100), 100);
        
        // Update the percentage text
        percentage.textContent = progress;
        
        // Update the loading bar directly
        const barFill = bar.querySelector('.preloader-bar-fill');
        if (barFill) {
            barFill.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            // Premium exit animation for preloader
            const tl = gsap.timeline();
            
            tl.to(percentage, {
                scale: 1.1,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            })
            .to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading');
                    initPremiumAnimations();
                }
            }, "-=0.3");
        } else {
            requestAnimationFrame(updateLoader);
        }
    }
    
    updateLoader();
}

// Initialize preloader on page load
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loading');
    initPreloader();
});
