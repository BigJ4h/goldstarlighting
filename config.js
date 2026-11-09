/*
 * Site configuration — edit before launch.
 *
 * formEndpoint: where quote requests are POSTed (multipart/form-data).
 *   Currently FormSubmit (JSON). Formspree/Basin/Getform URLs also work. Leave empty until a real endpoint exists:
 *   the form will then tell visitors it is not connected and offer
 *   phone / email instead. It never pretends a request was sent.
 */
window.SITE_CONFIG = {
  formEndpoint: "https://formsubmit.co/ajax/Goldenstarpropertycare@gmail.com",
  // Cloudflare Worker that sends quote alerts and creates AI previews
  // (e.g. "https://goldstar-quotes.<your-subdomain>.workers.dev"). Empty = feature off.
  workerUrl: "https://goldstar-quotes.jahcereawesome.workers.dev",
  businessEmail: "Goldenstarpropertycare@gmail.com",
  phoneDisplay: "(848) 403-7111",
  phoneHref: "+18484037111"
};
