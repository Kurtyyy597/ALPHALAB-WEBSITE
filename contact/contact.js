document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const formKey = "alphaGymContactForm";

  const nameInput = form.querySelector('input[name="Name"]');
  const emailInput = form.querySelector('input[name="Email"]');
  const phoneInput = form.querySelector('input[name="Phone"]');
  const messageInput = form.querySelector('textarea[name="Message"]');
  const paymentSelect = form.querySelector('select[name="Payment Method"]');
  const clearBtn = document.querySelector(".clear-btn");
  const submitBtn = form.querySelector(".form-btn");

  const MAX_MESSAGE_LENGTH = 300;

  /* ==========================
     PROGRESS BAR
  ========================== */
  const progressWrap = document.createElement("div");
  progressWrap.style.marginBottom = "15px";

  const progressText = document.createElement("div");
  progressText.style.fontSize = "12px";
  progressText.style.marginBottom = "5px";
  progressText.textContent = "Form Completion: 0%";

  const progressBar = document.createElement("div");
  progressBar.style.height = "8px";
  progressBar.style.background = "#ddd";
  progressBar.style.borderRadius = "5px";
  progressBar.style.overflow = "hidden";

  const progressFill = document.createElement("div");
  progressFill.style.height = "100%";
  progressFill.style.width = "0%";
  progressFill.style.background = "#2ecc71";
  progressFill.style.transition = "0.3s ease";

  progressBar.appendChild(progressFill);
  progressWrap.appendChild(progressText);
  progressWrap.appendChild(progressBar);

  form.prepend(progressWrap);

  function updateProgress() {
    const requiredFields = [...form.querySelectorAll("[required]")];
    const filled = requiredFields.filter(f => f.value.trim()).length;
    const percent = Math.round((filled / requiredFields.length) * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = `Form Completion: ${percent}%`;
  }

  /* ==========================
     PAYMENT INFO BOX
  ========================== */
  const paymentInfo = document.createElement("div");
  paymentInfo.style.marginTop = "10px";
  paymentInfo.style.padding = "10px";
  paymentInfo.style.borderRadius = "8px";
  paymentInfo.style.background = "#f4f4f4";
  paymentInfo.style.display = "none";
  paymentInfo.style.fontSize = "14px";

  paymentSelect.parentElement.appendChild(paymentInfo);

  function updatePaymentInfo() {
    const method = paymentSelect.value;
    paymentInfo.style.display = "block";

    if (method === "GCash") {
      paymentInfo.innerHTML = "📱 <strong>GCash:</strong> You will receive payment instructions via email after submitting this form.";
    } else if (method === "Online Bank") {
      paymentInfo.innerHTML = "🏦 <strong>Online Bank:</strong> Bank details will be sent to your email after form submission.";
    } else if (method === "Cash") {
      paymentInfo.innerHTML = "💵 <strong>Cash:</strong> Please pay at the front desk when you visit Alpha Gym.";
    } else {
      paymentInfo.style.display = "none";
    }
  }

  paymentSelect.addEventListener("change", updatePaymentInfo);

  /* ==========================
     DRAFT POPUP
  ========================== */
  const popup = document.createElement("div");
  popup.className = "draft-popup";
  popup.textContent = "Draft Saved ✅";
  document.body.appendChild(popup);

  function showPopup() {
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 1500);
  }

  /* ==========================
     CHARACTER COUNTER
  ========================== */
  const counter = document.createElement("div");
  counter.style.fontSize = "12px";
  counter.style.textAlign = "right";
  counter.style.marginTop = "5px";
  counter.textContent = `0 / ${MAX_MESSAGE_LENGTH}`;
  messageInput.parentElement.appendChild(counter);

  function updateCounter() {
    const length = messageInput.value.length;
    counter.textContent = `${length} / ${MAX_MESSAGE_LENGTH}`;

    if (length > MAX_MESSAGE_LENGTH) {
      counter.style.color = "red";
      messageInput.value = messageInput.value.slice(0, MAX_MESSAGE_LENGTH);
    } else {
      counter.style.color = "#888";
    }
  }

  /* ==========================
     VALIDATION HELPERS
  ========================== */
  function setValid(input) {
    input.style.borderColor = "#2ecc71";
  }

  function setInvalid(input) {
    input.style.borderColor = "#e74c3c";
  }

  function validateEmail() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    pattern.test(emailInput.value) ? setValid(emailInput) : setInvalid(emailInput);
  }

  function validatePhone() {
    const digits = phoneInput.value.replace(/\D/g, "");
    digits.length === 11 ? setValid(phoneInput) : setInvalid(phoneInput);
  }

  function validateRequired(input) {
    input.value.trim() ? setValid(input) : setInvalid(input);
  }

  /* ==========================
     PHONE AUTO FORMAT
  ========================== */
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
    validatePhone();
    updateProgress();
  });

  /* ==========================
     LIVE VALIDATION
  ========================== */
  nameInput.addEventListener("input", () => {
    validateRequired(nameInput);
    updateProgress();
  });

  emailInput.addEventListener("input", () => {
    validateEmail();
    updateProgress();
  });

  messageInput.addEventListener("input", () => {
    validateRequired(messageInput);
    updateCounter();
    updateProgress();
  });

  /* ==========================
     LOAD SAVED DATA
  ========================== */
  const savedData = JSON.parse(localStorage.getItem(formKey)) || {};

  [...form.elements].forEach(field => {
    if (field.name && savedData[field.name]) {
      field.value = savedData[field.name];
    }
  });

  updateCounter();
  updateProgress();
  updatePaymentInfo();

  /* ==========================
     SAVE DRAFT
  ========================== */
  form.addEventListener("input", () => {
    const data = {};

    [...form.elements].forEach(field => {
      if (field.name) {
        data[field.name] = field.value;
      }
    });

    localStorage.setItem(formKey, JSON.stringify(data));
    showPopup();
  });

  /* ==========================
     CLEAR FORM
  ========================== */
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the form?")) {
      form.reset();
      localStorage.removeItem(formKey);
      updateCounter();
      updateProgress();
      paymentInfo.style.display = "none";
    }
  });

  /* ==========================
     SUBMIT LOADING + SUCCESS
  ========================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    submitBtn.textContent = "Sending... ⏳";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = "Send Message";
      submitBtn.disabled = false;

      localStorage.removeItem(formKey);
      form.reset();
      updateCounter();
      updateProgress();
      paymentInfo.style.display = "none";

      showSuccessMessage();
    }, 1500);
  });

  /* ==========================
     SUCCESS MESSAGE MODAL
  ========================== */
  function showSuccessMessage() {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "30px";
    box.style.borderRadius = "12px";
    box.style.textAlign = "center";
    box.style.maxWidth = "350px";
    box.innerHTML = `
      <h2>✅ Message Sent!</h2>
      <p>Thank you for contacting Alpha Gym. We'll get back to you soon.</p>
      <button style="margin-top:15px;padding:10px 20px;border:none;border-radius:8px;background:#2ecc71;color:white;cursor:pointer;">
        Close
      </button>
    `;

    box.querySelector("button").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.appendChild(box);
    document.body.appendChild(modal);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const phoneLink = document.getElementById("phoneLink");
  if (!phoneLink) return;

  const PHONE_NUMBER = "0954 302 9792";
  const PHONE_TEL = "+639543029792";

  // Create modal
  const modal = document.createElement("div");
  modal.id = "phoneModal";
  modal.innerHTML = `
    <div class="phone-modal-backdrop"></div>
    <div class="phone-modal">
      <h3>📞 Call Us</h3>
      <p class="phone-number">${PHONE_NUMBER}</p>
      <div class="phone-actions">
        <button id="copyNumber">📋 Copy Number</button>
        <button id="closeModal">❌ Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    #phoneModal {
      position: fixed;
      inset: 0;
      display: none;
      z-index: 9999;
      font-family: Arial, sans-serif;
    }

    .phone-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    .phone-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: #111;
      color: white;
      padding: 25px;
      border-radius: 12px;
      min-width: 280px;
      text-align: center;
      animation: modalPop 0.2s ease forwards;
    }

    .phone-number {
      font-size: 1.2rem;
      margin: 15px 0;
      letter-spacing: 1px;
    }

    .phone-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .phone-actions button {
      border: none;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      background: #ff3c3c;
      color: white;
      transition: transform 0.1s ease, opacity 0.1s ease;
    }

    .phone-actions button:hover {
      opacity: 0.85;
      transform: scale(1.05);
    }

    @keyframes modalPop {
      to {
        transform: translate(-50%, -50%) scale(1);
      }
    }

    .call-animate {
      animation: pulse 0.4s ease;
    }

    @keyframes pulse {
      50% {
        transform: scale(0.95);
      }
    }
  `;
  document.head.appendChild(style);

  // Helpers
  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function showModal() {
    modal.style.display = "block";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  // Click behavior
  phoneLink.addEventListener("click", (e) => {
    if (isMobile()) {
      // Mobile tap animation
      phoneLink.classList.add("call-animate");
      setTimeout(() => {
        phoneLink.classList.remove("call-animate");
        window.location.href = `tel:${PHONE_TEL}`;
      }, 150);
    } else {
      e.preventDefault();
      showModal();
    }
  });

  // Modal actions
  document.getElementById("closeModal").addEventListener("click", hideModal);
  document
    .getElementById("copyNumber")
    .addEventListener("click", () => {
      navigator.clipboard.writeText(PHONE_NUMBER).then(() => {
        const btn = document.getElementById("copyNumber");
        btn.textContent = "✅ Copied!";
        setTimeout(() => (btn.textContent = "📋 Copy Number"), 1500);
      });
    });

  modal
    .querySelector(".phone-modal-backdrop")
    .addEventListener("click", hideModal);
});

// ============================
// SCROLL PROGRESS BAR (TOP)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Create bar
  const progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  document.body.appendChild(progressBar);

  // Update on scroll
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  });
});



