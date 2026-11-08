# Justice Unheard

A responsive, dark editorial-style static site for a Cambridge O Level Global Perspectives project. Open `index.html` directly or publish this folder as a static website. No build step or backend is required.

## Files

```text
index.html, issue.html, perspectives.html, evidence.html
impact.html, voices.html, survey.html, article.html, help.html
sources.html, about.html
survey-results.html
css/style.css
js/main.js, js/charts.js, js/phase1-results.js
data/survey-data.js, data/phase1-survey.js
assets/logo.png, assets/favicon.svg, assets/og-image-note.txt
```

## Finish the placeholders

Search all files for `todo`, `[REPLACE`, and `FEEDBACK FORM URL`. Each visible `todo` badge marks information that needs review before publication. Replace only with sourced, consented and verified material. Source URLs and research still need checking.

The browser console lists visible placeholder badges on each page:

```js
document.querySelectorAll(".todo").forEach(item => console.log(item.textContent.trim()));
```

Do not publish interview text without consent; do not include identifying details, exact addresses, or unverified statistics.

## Branding and forms

- Replace `assets/logo.png` with the team's logo, keeping that filename and a transparent background if possible. Update its alt text if the branding changes.
- The survey and Instagram links are connected. The feedback form in `about.html` remains a placeholder until its URL is available.
- The survey is embedded in `survey.html`; its new-tab fallback opens the same form.
- Create a separate feedback form and paste its share URL into the button in `about.html`.
- `assets/og-image-note.txt` describes the optional social-sharing image. Update the Open Graph image metadata if an image is created.

## Survey data

`data/phase1-survey.js` contains the Phase 1 counts for 54 respondents. `js/phase1-results.js` computes displayed percentages from those counts and renders the charts and accessible data tables on `survey-results.html`. `data/survey-data.js` is retained for the earlier demonstration data but is no longer loaded on the survey or impact pages.

## Preview and publish

Open `index.html` in a browser to preview. Google Fonts and Chart.js load from their CDNs; without an internet connection the site remains readable, but the custom fonts and charts may not load.

**GitHub Pages:** upload this folder to a repository (or its `docs` folder), then select the correct branch and folder in **Settings → Pages**. Keep the relative asset paths unchanged.

**Netlify:** drag and drop this folder into Netlify, or connect its repository and publish the folder as the site root. No build command is needed.

Finally, paste the live site link into the team's Explanation of Research and Planning.
