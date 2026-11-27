const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }
});

const searchInput = document.querySelector("#destination-search");
const destinationCards = [...document.querySelectorAll(".destination-card")];
const emptyState = document.querySelector("#empty-state");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  destinationCards.forEach((card) => {
    const matches = card.dataset.name.includes(searchTerm);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
});

const enquiryForm = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");
const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  destination: document.querySelector("#destination")
};

function showFieldError(field, message) {
  const errorMessage = document.querySelector(`#${field.id}-error`);
  field.closest(".form-field").classList.toggle("has-error", Boolean(message));
  errorMessage.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("error");

  let isValid = true;
  Object.values(fields).forEach((field) => {
    let message = "";

    if (!field.value.trim()) {
      message = "Please fill in this field.";
    } else if (field === fields.name && field.value.trim().length < 2) {
      message = "Please enter at least 2 characters.";
    } else if (field === fields.email && !field.validity.valid) {
      message = "Please enter a valid email address.";
    }

    showFieldError(field, message);
    if (message) isValid = false;
  });

  if (!isValid) {
    formStatus.textContent = "Please check the highlighted fields and try again.";
    formStatus.classList.add("error");
    enquiryForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  formStatus.textContent = `Thanks, ${fields.name.value.trim()}! Your enquiry is ready. This demo doesn't send or store your details.`;
  enquiryForm.reset();
  Object.values(fields).forEach((field) => showFieldError(field, ""));
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") showFieldError(field, "");
  });
  field.addEventListener("change", () => {
    if (field.getAttribute("aria-invalid") === "true") showFieldError(field, "");
  });
});
