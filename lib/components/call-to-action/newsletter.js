const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function newlsetter(state, emit = () => {}) {
  let action = process.env.MAILCHIMP_ACTION;

  if (state.params.goal) {
    action += `&GOAL=${ state.params.goal }`;
  }

  if (state.geoip.country_code) {
    action += `&COUNTRY=${ state.geoip.country_code }`;
  } else if (!state.geoip.error) {
    emit('geoip:fetch');
  }

  return html`
    <form class="Form" action="${ action }" method="post" target="_blank">
      <div class="Text Text--growing">
        <p>${ __('Sign up below to get a high quality curated monthly newsletter about %s what’s happening around The Global Goals.', state.params.goal ? __('goal number %s and', state.params.goal) : '') }</p>
      </div>

      <div style="position: absolute; left: -2000px;" aria-hidden="true">
        <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <input type="text" name="b_7d6667fe63e208708b9f6ee8f_fece74a6ea" tabindex="-1" value="">
      </div>

      <div class="CallToAction-fields">
        <label class="CallToAction-field">
          <span class="Form-label">${ __('Your name') }</span>
          <input class="Form-input" type="text" name="NAME" placeholder="${ __('E.g. Fatima Olivia') }" />
        </label>

        <label class="CallToAction-field">
          <span class="Form-label">${ __('Your email') }</span>
          <input class="Form-input" type="email" name="EMAIL" required placeholder="${ __('E.g. name@example.com') }" />
        </label>

        <button type="submit" name="subscribe" class="Button">${ __('Sign up') }</button>
      </div>
    </form>
  `;
};
