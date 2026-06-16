/* ============================================================
   MCCSC Registration / Capture form handler
   ------------------------------------------------------------
   FOR THE BACKEND DEVELOPER (ISC / IPP Technologies):
   This is a STATIC front end only. To connect it to the portal
   backend, change the CONFIG block below — you should not need
   to touch the HTML field structure.

   1. Set ENDPOINT to your registration/visitor API URL.
   2. Set METHOD if not POST.
   3. If your backend needs a CSRF token, inject it server-side
      into the hidden input #csrf_token (or set CSRF_META to the
      <meta> name you render it under).
   4. FIELD_MAP lets you rename our field keys to yours without
      editing the HTML. Left = our name attribute, right = yours.
   5. Webcam photo auto-capture (used on your visitor form) is
      intentionally NOT implemented here — it should be handled
      server-side / in your authenticated portal, not on a public
      marketing page, for privacy/consent reasons.
   ============================================================ */

const MCCSC_FORM_CONFIG = {
  ENDPOINT: "",                 // e.g. "https://portal.indiansupportcenter.org.au/api/visitor-registration"
  METHOD: "POST",
  CSRF_META: "csrf-token",      // <meta name="csrf-token" content="..."> if used; else leave as-is
  REDIRECT_ON_SUCCESS: "",      // optional thank-you URL
  FIELD_MAP: {
    // our_name : their_name   (edit right-hand side to match backend)
    first_name: "first_name",
    last_name:  "last_name",
    email:      "email",
    mobile:     "mobile",
    display_name:"display_name",
    gender:     "gender",
    purpose:    "purpose",
    purpose_other:"purpose_other",
    address:    "address",
    city:       "city",
    state:      "state",
    postcode:   "postcode",
    notes:      "notes"
  }
};

(function () {
  const form = document.getElementById("mccsc-register");
  if (!form) return;
  const msg = form.querySelector("[data-reg-message]");

  // Show/hide the "please specify" field when purpose = Other
  const purpose = form.querySelector('[name="purpose"]');
  const otherWrap = form.querySelector("[data-purpose-other]");
  if (purpose && otherWrap) {
    const sync = () => { otherWrap.style.display = (purpose.value === "Other") ? "" : "none"; };
    purpose.addEventListener("change", sync); sync();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (msg) { msg.textContent = ""; msg.classList.remove("error"); }

    // Collect + remap fields
    const raw = Object.fromEntries(new FormData(form).entries());
    const payload = {};
    for (const [ours, theirs] of Object.entries(MCCSC_FORM_CONFIG.FIELD_MAP)) {
      if (raw[ours] !== undefined) payload[theirs] = raw[ours];
    }
    // CSRF token if backend provides one
    const meta = document.querySelector('meta[name="' + MCCSC_FORM_CONFIG.CSRF_META + '"]');
    if (meta) payload._token = meta.getAttribute("content");

    // No endpoint configured yet -> friendly placeholder behaviour
    if (!MCCSC_FORM_CONFIG.ENDPOINT) {
      if (msg) msg.textContent =
        "Thank you. Your details are ready to be submitted — this form is awaiting connection to the portal backend.";
      form.reset(); if (purpose && otherWrap) otherWrap.style.display = "none";
      return;
    }

    // Live submission
    fetch(MCCSC_FORM_CONFIG.ENDPOINT, {
      method: MCCSC_FORM_CONFIG.METHOD,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => { if (!r.ok) throw new Error("Submission failed (" + r.status + ")"); return r; })
      .then(() => {
        if (MCCSC_FORM_CONFIG.REDIRECT_ON_SUCCESS) { window.location.href = MCCSC_FORM_CONFIG.REDIRECT_ON_SUCCESS; return; }
        if (msg) msg.textContent = "Thank you — your registration has been received. We'll be in touch.";
        form.reset(); if (purpose && otherWrap) otherWrap.style.display = "none";
      })
      .catch(err => {
        if (msg) { msg.classList.add("error");
          msg.textContent = "Sorry, something went wrong submitting the form. Please try again or contact us directly."; }
        console.error(err);
      });
  });
})();
