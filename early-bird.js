const earlyForm = document.querySelector("#early-form");
const earlyName = document.querySelector("#early-name");
const earlyEmail = document.querySelector("#early-email");
const earlyError = document.querySelector("#early-error");
const earlyRegister = document.querySelector(".early-register");
const heartTransition = document.querySelector(".heart-transition");

const SUPABASE_URL = "https://ljvagqbzzsjgjtzrilgr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_qmEaNgMayfBdHISNbv9NEQ_KPtPaPId";

earlyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = earlyName.value.trim();
  const email = earlyEmail.value.trim().toLowerCase();
  earlyEmail.value = email;

  if (!email || !earlyEmail.validity.valid) {
    earlyError.textContent = "올바른 이메일 주소를 입력해 주세요.";
    earlyEmail.focus();
    return;
  }

  earlyError.textContent = "";
  earlyRegister.disabled = true;
  earlyRegister.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/chugu_early_bird`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: name || null,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      if (response.status === 409 || error.code === "23505") {
        earlyError.textContent = "이미 사전예약된 이메일이에요.";
        earlyEmail.focus();
        return;
      }

      throw new Error(error.message || "Early-bird registration failed");
    }

    heartTransition.classList.add("is-active");

    window.setTimeout(() => {
      window.location.href = "early-bird2.html";
    }, 1150);
  } catch (error) {
    console.error(error);
    earlyError.textContent =
      "등록하지 못했어요. 잠시 후 다시 시도해 주세요.";
  } finally {
    if (!heartTransition.classList.contains("is-active")) {
      earlyRegister.disabled = false;
      earlyRegister.removeAttribute("aria-busy");
    }
  }
});
