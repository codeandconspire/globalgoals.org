const html = require('choo/html')
const Component = require('nanocomponent')
const { scrollIntoView } = require('../base/utils')

const CATEGORIES = [{
  key: 'Progress Award',
  color: 'red',
  description: 'The Global Goals Progress Award celebrates the achievement of an individual who is supporting progress for the Goals via a science, technology, digital or business led initiative.'
}, {
  key: 'Changemaker Award',
  color: 'blue',
  description: 'The Global Goals Changemaker Award celebrates the achievement of an individual who has inspired Goal related change using their personal experience or from a position of leadership.'
}, {
  key: 'Campaign Award',
  color: 'yellow',
  description: 'The Global Goals Campaign Award celebrates a youth-led (individual or group) campaign that has raised awareness or built a community in support of a youth-focused, Goal related cause, inspiring action and creating change.'
}]

const COUNTRIES = [
  'Afghanistan',
  'Åland Islands',
  'Albania',
  'Algeria',
  'American Samoa',
  'AndorrA',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo, The Democratic Republic of the',
  'Cook Islands',
  'Costa Rica',
  'Cote D\'Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Falkland Islands (Malvinas)',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and Mcdonald Islands',
  'Holy See (Vatican City State)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran, Islamic Republic Of',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, Democratic People\'s Republic of',
  'Korea, Republic of',
  'Kuwait',
  'Kyrgyzstan',
  'Lao People\'s Democratic Republic',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libyan Arab Jamahiriya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Macedonia, The Former Yugoslav Republic of',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia, Federated States of',
  'Moldova, Republic of',
  'Monaco',
  'Mongolia',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestinian Territory, Occupied',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russian Federation',
  'RWANDA',
  'Saint Helena',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia and Montenegro',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan, Province of China',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'United States Minor Outlying Islands',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Viet Nam',
  'Virgin Islands, British',
  'Virgin Islands, U.S.',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe'
]

module.exports = class Form extends Component {
  constructor (id, state, emit) {
    super(id)
    this.error = null
    this.emit = emit
    this.props = {}
  }

  static identity () {
    return 'awards-form'
  }

  update () {
    return false
  }

  createElement () {
    const self = this

    let length = 0
    if (this.props['entry.1822369347']) {
      length = this.props['entry.1822369347'].trim().split(' ').length
    }

    return html`
      <form action="https://docs.google.com/forms/u/1/d/e/1FAIpQLSeLJ0hpC7L48x64m7iyBIrcbtJ4Iu78hIa8poiKn5mLpBjZvg/formResponse" method="POST" onsubmit=${onsubmit}>
        <input type="hidden" name="fbzx" value="-7722054774688598407">
        <div class="Text u-color5">
          ${this.error ? html`
            <div>
              <div class="Space Space--end">
                <h2 class="Text-h3">Opps! Something went wrong.</h2>
                <p>${this.error.message}</p>
              </div>
            </div>
          ` : null}
        </div>
        <div class="Text">
          <h2 class="Text-h3">Select the category</h2>
          <p>For which award should your nominee (aged 16-30) be considered?</p>
        </div>
        <div class="Form-choices ${this.props['entry.145002520'] ? 'has-selected' : ''}">
          <div class="Grid">
            ${CATEGORIES.map(({key, color, description}) => html`
              <div class="Grid-cell Grid-cell--md1of3">
                <label class="Form-choice Form-choice--${color} ${this.props['entry.145002520'] === key ? 'is-selected' : ''}">
                  <div class="Form-banner">
                    <input onchange=${setProp} class="Form-check" type="radio" name="entry.145002520" value="${key}" checked=${this.props['entry.145002520'] === key}/> ${key}
                  </div>
                  <div class="Form-description">
                    <div class="Text Text--full">
                      <p>${description}</p>
                    </div>
                  </div>
                </label>
              </div>
            `)}
          </div>
        </div>
        <div class="Space Space--start Space--endShort">
          <div class="Text">
            <h2 class="Text-h3">Tell us about yourself</h2>
          </div>
        </div>
        <div class="Grid">
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Name of nominating person</span>
              <input type="text" autocomplete="name" name="entry.577983567" value="${this.props['entry.577983567'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Organisation/company</span>
              <input type="text" autocomplete="organization" name="entry.1174912357" value="${this.props['entry.1174912357'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Email</span>
              <input type="email" autocomplete="email" name="entry.1732288032" value="${this.props['entry.1732288032'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Telephone</span>
              <input type="tel" autocomplete="tel" name="entry.1029329224" value="${this.props['entry.1029329224'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
        </div>
        <div class="Space Space--start Space--endShort">
          <div class="Text">
            <h2 class="Text-h3">Who would you like to nominate?</h2>
          </div>
        </div>
        <div class="Grid">
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Name of nominee</span>
              <input type="text" autocomplete="off" name="entry.1475500814" value="${this.props['entry.1475500814'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Organisation/company <small class="Form-meta">(if applicable)</small></span>
              <input type="text" autocomplete="off" name="entry.1386450870" value="${this.props['entry.1386450870'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Age of nominee <br><small class="Form-meta">On September 24th 2019</small></span>
              <input type="number" name="entry.1897922680" value="${this.props['entry.1897922680'] || ''}" oninput=${setProp} class="Form-control" required />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <div class="Form-field">
              <span class="Form-label">Has sought parental/guardian permission <br><small class="Form-meta">Applicable for nominees aged under 18</small></span>
              <label class="Form-pair">
                <input class="Form-toggle" type="radio" onchange=${setProp} name="entry.111434727" value="Yes" required checked=${!this.props['entry.111434727'] || this.props['entry.111434727'] === 'Yes'} /> <span class="Form-label">Yes</span>
              </label>
              <label class="Form-pair">
                <input class="Form-toggle" type="radio" onchange=${setProp} name="entry.111434727" value="No" required checked=${this.props['entry.111434727'] === 'No'} /> <span class="Form-label">No</span>
              </label>
            </div>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Country</span>
              <select name="entry.9046416" autocomplete="country-name" required onchange=${setProp} class="Form-control">
                <option disabled selected=${!this.props['entry.9046416']} label="Please select"></option>
                ${COUNTRIES.map((name) => html`
                  <option value="${name}" selected=${this.props['entry.9046416'] === name}>${name}</option>
                `)}
              </select>
            </label>
          </div>
          <div class="Grid-cell Grid-cell--md1of2">
            <label class="Form-field">
              <span class="Form-label">Languages spoken <small class="u-hiddenVisually">(please indicate first language)</small></span>
              <input type="text" autocomplete="off" name="entry.1364261202" value="${this.props['entry.1364261202'] || ''}" oninput=${setProp} class="Form-control" placeholder="please indicate first language" required />
            </label>
          </div>
          <div class="Grid-cell">
            <div class="Form-field">
              <span class="Form-label">
                Is the individual available to travel to New York for the Awards Ceremony, September 24th 2019?
                <br>
                <small class="Form-meta">(If under 18 they must also have an accompanying parent/guardian.)</small>
              </span>
              <label class="Form-pair">
                <input class="Form-toggle" type="radio" onchange=${setProp} name="entry.380787076" value="Yes" required checked=${!this.props['entry.380787076'] || this.props['entry.380787076'] === 'Yes'} /> <span class="Form-label">Yes</span>
              </label>
              <label class="Form-pair">
                <input class="Form-toggle" type="radio" onchange=${setProp} name="entry.380787076" value="No" required checked=${this.props['entry.380787076'] === 'No'} /> <span class="Form-label">No</span>
              </label>
            </div>
          </div>
          <div class="Grid-cell">
            <div class="Form-field">
              <label for="reason" class="Form-label">
                Reason for nomination <small class="Form-meta">(Max. 300 words):</small>
                <br>
                <small class="Form-meta">Please answer referring to <span class="Text"><a href="https://globalgoals.cdn.prismic.io/globalgoals/cea603df-0bd1-49a4-9749-995cc106ddd5_goalkeepersglobalgoalsawardscriteria.pdf" target="_blank">general criteria for Goalkeeper awards</a></span> and specific required evidence for this category.</small>
              </label>
              <textarea class="Form-control" rows="8" id="reason" name="entry.1822369347" oninput=${setProp} required>${this.props['entry.1822369347']}</textarea>
              <span class="Form-label">
                <small class="Form-meta ${length > 300 ? 'u-color5' : ''}">Using ${length} words</small>
              </span>
            </div>
          </div>
        </div>
        <div class="Space Space--start Space--endShort">
          <div class="Text">
            <h2 class="Text-h3">Relevant social media handles for project/campaign</h2>
          </div>
        </div>
        <div class="Grid">
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Facebook</span>
              <input type="text" autocomplete="off" name="entry.277484791" value="${this.props['entry.277484791'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Twitter</span>
              <input type="text" autocomplete="off" name="entry.611432332" value="${this.props['entry.611432332'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Google+</span>
              <input type="text" autocomplete="off" name="entry.1311642787" value="${this.props['entry.1311642787'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Instagram</span>
              <input type="text" autocomplete="off" name="entry.1652770541" value="${this.props['entry.1652770541'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Snapchat</span>
              <input type="text" autocomplete="off" name="entry.1039775438" value="${this.props['entry.1039775438'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell Grid-cell--sm1of2">
            <label class="Form-field">
              <span class="Form-label">Youtube</span>
              <input type="text" autocomplete="off" name="entry.409674468" value="${this.props['entry.409674468'] || ''}" oninput=${setProp} class="Form-control" />
            </label>
          </div>
          <div class="Grid-cell">
            <div class="Form-field">
              <label for="social_other" class="Form-label">Does the nominee have any existing press coverage? If so, please share relevant links</label>
              <textarea class="Form-control" rows="5" id="social_other" name="entry.1118201815" oninput=${setProp}>${this.props['entry.1118201815']}</textarea>
            </div>
          </div>
          <div class="Grid-cell">
            <div class="Form-field">
              <label class="Form-pair">
                <input class="Form-toggle" type="checkbox" name="entry.1143045509" value="Yes" onchange=${setProp} required checked=${this.props['entry.1143045509'] === 'Yes'} /> <span class="Form-label">I have read and agree to the <span class="Text"><a href="https://prismic-io.s3.amazonaws.com/globalgoals%2Face572f5-cb91-459d-a0be-17656bdb9bec_terms+conditions+final+05042018.pdf" target="_blank">terms and conditions</a></span></span>
              </label>
            </div>
          </div>
          <div class="Grid-cell">
            <button type="submit" class="Button js-submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    `

    function setProp (event) {
      if (event.target.type === 'checkbox') {
        if (!event.target.checked) delete self.props[event.target.name]
        else self.props[event.target.name] = event.target.value
      } else {
        self.props[event.target.name] = event.target.value
      }
      self.rerender()
    }

    function onsubmit (event) {
      if (typeof event.target.checkValidity !== 'function') return
      if (!event.target.checkValidity()) {
        event.target.reportValidity()
      } else {
        self.error = null

        if (self.props['entry.1143045509'] !== 'Yes') {
          self.error = new Error('You have to accept the terms and conditions to submit a nomination.')
        }

        if (length > 300) {
          self.error = new Error('Your reason for motivation can be no more than 300 words long.')
        }

        if (self.error) {
          self.rerender()
          scrollIntoView(self.element, {behavior: 'smooth', block: 'start'})
        } else {
          self.element.querySelector('.js-submit').disabled = true
          window.fetch('/api/nominate', {
            method: 'POST',
            credentials: 'include',
            body: new window.FormData(event.target)
          }).then(function (response) {
            if (!response.ok) throw new Error('Could not submit form')
            self.emit('pushState', '/thanks')
          }).catch(function (err) {
            self.error = err
            self.rerender()
            scrollIntoView(self.element, {behavior: 'smooth', block: 'start'})
          })
        }
      }
      event.preventDefault()
    }
  }
}
