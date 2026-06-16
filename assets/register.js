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
    notes:      "notes",
    photo:      "photo"
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

/* ============================================================
   Optional, consent-gated webcam photo capture
   - Camera only starts on explicit user click ("Enable camera")
   - User can capture / retake / remove / turn off
   - Never blocks form submission; photo is optional
   - Stores a base64 JPEG in the hidden #photo input on capture
   ============================================================ */
(function () {
  const root = document.querySelector("[data-photo-capture]");
  if (!root || !("mediaDevices" in navigator)) {
    // Camera unsupported -> hide the whole optional block gracefully
    if (root && !("mediaDevices" in navigator)) root.style.display = "none";
    return;
  }
  const enableBtn = root.querySelector("[data-pc-enable]");
  const stage     = root.querySelector("[data-pc-stage]");
  const video     = root.querySelector("[data-pc-video]");
  const shot      = root.querySelector("[data-pc-shot]");
  const captureBtn= root.querySelector("[data-pc-capture]");
  const retakeBtn = root.querySelector("[data-pc-retake]");
  const removeBtn = root.querySelector("[data-pc-remove]");
  const cancelBtn = root.querySelector("[data-pc-cancel]");
  const statusEl  = root.querySelector("[data-pc-status]");
  const dataInput = root.querySelector("[data-pc-data]");
  let stream = null;

  function setStatus(t, err) { statusEl.textContent = t || ""; statusEl.classList.toggle("err", !!err); }

  function stopStream() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  }

  async function enableCamera() {
    setStatus("Requesting camera…");
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      video.srcObject = stream;
      stage.classList.add("on");
      video.style.display = ""; shot.style.display = "none";
      captureBtn.style.display = ""; retakeBtn.style.display = "none"; removeBtn.style.display = "none";
      enableBtn.style.display = "none";
      setStatus("Camera on. Position yourself and tap Capture photo.");
    } catch (err) {
      setStatus("Couldn't access the camera. You can continue without a photo.", true);
      console.warn(err);
    }
  }

  function capture() {
    if (!stream) return;
    const w = video.videoWidth || 640, h = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    dataInput.value = dataUrl;
    shot.src = dataUrl;
    video.style.display = "none"; shot.style.display = "";
    captureBtn.style.display = "none"; retakeBtn.style.display = ""; removeBtn.style.display = "";
    setStatus("Photo captured. It will be sent when you submit. You can retake or remove it.");
  }

  function retake() {
    dataInput.value = "";
    video.style.display = ""; shot.style.display = "none";
    captureBtn.style.display = ""; retakeBtn.style.display = "none"; removeBtn.style.display = "none";
    setStatus("Camera on. Tap Capture photo.");
  }

  function removePhoto() {
    dataInput.value = "";
    shot.src = "";
    cancelCamera();
    setStatus("Photo removed.");
  }

  function cancelCamera() {
    stopStream();
    stage.classList.remove("on");
    enableBtn.style.display = "";
    setStatus("");
  }

  enableBtn.addEventListener("click", enableCamera);
  captureBtn.addEventListener("click", capture);
  retakeBtn.addEventListener("click", retake);
  removeBtn.addEventListener("click", removePhoto);
  cancelBtn.addEventListener("click", function () {
    cancelCamera();
    if (dataInput.value) setStatus("Camera off. Your captured photo is kept and will be sent on submit.");
  });

  // Clean up the camera if the user leaves the page
  window.addEventListener("pagehide", stopStream);
})();
