/* Contact page. The form does not submit anywhere: it assembles the message
   and hands it to the visitor's own email app through a mailto: link, so the
   note is sent from their address to mine. A form that POSTs to mailto: is
   unreliable in modern browsers, which is why this is built in script.
   The address is also printed on the page for anyone whose device has no
   email app registered. */

(function () {
  const form = document.getElementById("contact-form");
  const addressEl = document.getElementById("address");
  if (!form || !addressEl) return;

  const address = addressEl.textContent.trim();
  const status = document.getElementById("form-status");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const fromName = document.getElementById("from-name");

  /* Long mailto: URLs are silently truncated by some mail clients. Keep well
     under the range where that starts to happen and offer the copy route. */
  const MAX_URL = 1900;

  function setError(field, text) {
    const error = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", text ? "true" : "false");
    if (!error) return;
    error.textContent = text || "";
    error.hidden = !text;
  }

  function say(text) {
    if (!status) return;
    status.textContent = text || "";
    status.hidden = !text;
  }

  [subject, message].forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") setError(field, "");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    say("");

    const subjectText = subject.value.trim();
    const messageText = message.value.trim();
    const nameText = fromName.value.trim();

    setError(subject, subjectText ? "" : "Add a subject so I know what the note is about.");
    setError(message, messageText ? "" : "Write your message here.");

    const firstInvalid = [subject, message]
      .find((field) => field.getAttribute("aria-invalid") === "true");
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const body = nameText ? messageText + "\n\n" + nameText : messageText;
    const url = "mailto:" + address +
      "?subject=" + encodeURIComponent(subjectText) +
      "&body=" + encodeURIComponent(body);

    if (url.length > MAX_URL) {
      say("That message is long enough that some email apps would cut it off. " +
          "Copy my address below, then paste the message into your email app.");
      return;
    }

    say("Your email app should be opening now. If nothing happens, use the address below.");
    window.location.href = url;
  });

  const copyBtn = document.getElementById("copy-address");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(address).then(
        () => {
          copyBtn.textContent = "Copied";
          window.setTimeout(() => { copyBtn.textContent = "Copy address"; }, 2000);
        },
        () => {
          copyBtn.textContent = "Copy it by hand";
          window.setTimeout(() => { copyBtn.textContent = "Copy address"; }, 2500);
        }
      );
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }
})();
