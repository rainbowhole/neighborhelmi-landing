# todough

Static landing page for todough, built from the provided Figma design.

## Local Preview

Open `index.html` directly in a browser, or run:

```sh
python3 -m http.server 4174
```

Then visit `http://127.0.0.1:4174/`.

## GitHub Pages

This site can be published from the repository root using GitHub Pages.

## Contact Form

The public site should call a private contact endpoint, not the Discord webhook directly.
Set `window.TODOUGH_CONTACT_ENDPOINT` in `script.js` after deploying the Cloudflare Worker
from the main ToDough app's `contact-endpoint` folder.
