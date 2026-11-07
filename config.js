/*
 * Site configuration — edit before launch.
 *
 * formEndpoint: where quote requests are POSTed (multipart/form-data).
 *   Works with Formspree (https://formspree.io/f/XXXX), Basin, Getform,
 *   or your own endpoint. Leave empty until a real endpoint exists:
 *   the form will then tell visitors it is not connected and offer
 *   phone / email instead. It never pretends a request was sent.
 */
window.SITE_CONFIG = {
  formEndpoint: "",
  businessEmail: "Goldenstarpropertycare@gmail.com",
  phoneDisplay: "(848) 403-7111",
  phoneHref: "+18484037111"
};
