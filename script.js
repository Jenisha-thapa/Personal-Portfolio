// Mobile menu toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const navMenu = document.querySelector(".nav-menu")

mobileMenuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  const icon = mobileMenuToggle.querySelector(".menu-icon")
  icon.textContent = icon.textContent === "☰" ? "✕" : "☰"
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    const icon = mobileMenuToggle.querySelector(".menu-icon")
    icon.textContent = "☰"
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 80
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated")
    }
  })
}, observerOptions)

// Observe all elements with animate-on-scroll class
document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el)
})

// Form validation and submission
const contactForm = document.querySelector(".contact-form")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")
const successMessage = document.getElementById("success-message")

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation functions
function validateName() {
  const name = nameInput.value.trim()
  const errorElement = document.getElementById("name-error")

  if (name.length < 2) {
    nameInput.classList.add("error")
    errorElement.textContent = "Name must be at least 2 characters long"
    return false
  }

  nameInput.classList.remove("error")
  errorElement.textContent = ""
  return true
}

function validateEmail() {
  const email = emailInput.value.trim()
  const errorElement = document.getElementById("email-error")

  if (!emailRegex.test(email)) {
    emailInput.classList.add("error")
    errorElement.textContent = "Please enter a valid email address"
    return false
  }

  emailInput.classList.remove("error")
  errorElement.textContent = ""
  return true
}

function validateMessage() {
  const message = messageInput.value.trim()
  const errorElement = document.getElementById("message-error")

  if (message.length < 10) {
    messageInput.classList.add("error")
    errorElement.textContent = "Message must be at least 10 characters long"
    return false
  }

  messageInput.classList.remove("error")
  errorElement.textContent = ""
  return true
}

// Real-time validation
nameInput.addEventListener("blur", validateName)
emailInput.addEventListener("blur", validateEmail)
messageInput.addEventListener("blur", validateMessage)

// --- Updated Form submission (replaces simulated setTimeout logic) ---
const API_URL = "https://wild-hall-b45c.jenishathapa89.workers.dev/"

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Clear previous server-side field errors
  document.getElementById("name-error").textContent = ""
  document.getElementById("email-error").textContent = ""
  document.getElementById("message-error").textContent = ""

  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isMessageValid = validateMessage()

  if (!(isNameValid && isEmailValid && isMessageValid)) {
    return
  }

  // Prepare UI
  const submitButton = contactForm.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = "Sending..."
  submitButton.disabled = true

  // Build payload the backend expects
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  }

  // Timeout using AbortController (10s)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    let resJson = null
    try {
      resJson = await res.json()
    } catch (err) {
      // ignore JSON parse errors for non-JSON responses
      resJson = null
    }

    if (res.ok) {
      // Success
      successMessage.style.display = "block"
      // Reset any inline field errors and form
      document.getElementById("name-error").textContent = ""
      document.getElementById("email-error").textContent = ""
      document.getElementById("message-error").textContent = ""
      contactForm.reset()

      // Hide success message after 5s
      setTimeout(() => {
        successMessage.style.display = "none"
      }, 5000)
    } else {
      // Server returned an error status
      // If server provided structured errors, display them
      if (resJson && typeof resJson === "object") {
        if (resJson.errors && typeof resJson.errors === "object") {
          if (resJson.errors.name) {
            document.getElementById("name-error").textContent = resJson.errors.name
            nameInput.classList.add("error")
          }
          if (resJson.errors.email) {
            document.getElementById("email-error").textContent = resJson.errors.email
            emailInput.classList.add("error")
          }
          if (resJson.errors.message) {
            document.getElementById("message-error").textContent = resJson.errors.message
            messageInput.classList.add("error")
          }
        } else if (resJson.message) {
          // Generic message field from backend
          alert("Error: " + resJson.message)
        } else {
          alert("Server error occurred. Please try again later.")
        }
      } else {
        alert(`Server returned ${res.status} ${res.statusText}`)
      }
    }
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === "AbortError") {
      alert("Request timed out. Please try again.")
    } else {
      console.error("Form submission error:", err)
      alert("Network error. Please check your connection and try again.")
    }
  } finally {
    submitButton.disabled = false
    submitButton.innerHTML = originalText
  }
})
// --- End updated submission logic ---

// Typing animation for hero section
const heroTitle = document.querySelector(".hero-content h1")
const originalText = heroTitle.textContent
let index = 0

function typeWriter() {
  if (index < originalText.length) {
    heroTitle.textContent = originalText.slice(0, index + 1)
    index++
    setTimeout(typeWriter, 100)
  }
}

// Start typing animation when page loads
window.addEventListener("load", () => {
  heroTitle.textContent = ""
  setTimeout(typeWriter, 1000)
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const rate = scrolled * -0.5

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`
  }
})

// Add hover effects to project cards
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(-5px) scale(1)"
  })
})

// Add click effects to skill tags
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("click", function () {
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
    }, 150)
  })
})

// Progress bar animation for skills (if you want to add progress bars later)
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar")
  progressBars.forEach((bar) => {
    const progress = bar.getAttribute("data-progress")
    bar.style.width = progress + "%"
  })
}

// Scroll to top functionality
const scrollToTopBtn = document.createElement("button")
scrollToTopBtn.innerHTML = "↑"
scrollToTopBtn.className = "scroll-to-top"
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--accent);
    color: var(--accent-foreground);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-medium);
    font-size: 1.5rem;
    font-weight: bold;
`

document.body.appendChild(scrollToTopBtn)

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.opacity = "1"
    scrollToTopBtn.style.visibility = "visible"
  } else {
    scrollToTopBtn.style.opacity = "0"
    scrollToTopBtn.style.visibility = "hidden"
  }
})

// Scroll to top functionality
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Console log for debugging
console.log("Portfolio loaded")
