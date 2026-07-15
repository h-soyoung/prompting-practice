const SUPABASE_URL = "https://ljvagqbzzsjgjtzrilgr.supabase.co";
// Supabase publishable key: 브라우저 공개용이며, 실제 접근 범위는 RLS 보안 규칙이 제한합니다.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qmEaNgMayfBdHISNbv9NEQ_KPtPaPId";

const form = document.querySelector("#reservation-form");
const emailInput = document.querySelector("#reservation-email");
const submitButton = document.querySelector(".reservation__submit");
const message = document.querySelector("#reservation-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  if (!emailInput.validity.valid || !email) {
    message.textContent = "이메일 주소를 확인해 주세요.";
    emailInput.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Registering...";
  message.textContent = "";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      form.reset();
      message.textContent = "등록됐어요. OWN ROOM에서 만나요!";
      return;
    }

    const error = await response.json().catch(() => ({}));
    if (response.status === 409 || error.code === "23505") {
      message.textContent = "이미 등록된 이메일이에요.";
      return;
    }

    throw new Error("Registration failed");
  } catch {
    message.textContent = "등록하지 못했어요. 잠시 후 다시 시도해 주세요.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Get own space";
  }
});
