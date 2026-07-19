const earlyForm = document.querySelector("#early-form");
const earlyEmail = document.querySelector("#early-email");
const earlyError = document.querySelector("#early-error");
const heartTransition = document.querySelector(".heart-transition");

earlyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = earlyEmail.value.trim();
  if (!email || !earlyEmail.validity.valid) {
    earlyError.textContent = "올바른 이메일 주소를 입력해 주세요.";
    earlyEmail.focus();
    return;
  }

  earlyError.textContent = "";
  heartTransition.classList.add("is-active");

  window.setTimeout(() => {
    window.location.href = "early-bird2.html";
  }, 1150);
});
