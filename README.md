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
The Vercel serverless function in `api/contact.js` forwards contact messages to Discord.

Set this Vercel environment variable before using the contact form in production:

```sh
DISCORD_WEBHOOK_URL
```

Do not commit the actual Discord webhook URL to this repository.
