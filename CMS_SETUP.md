# Content manager setup

The public site is a set of pages in `index.html`. Text, lessons, explainers, apologetics, and prices are stored in `content.json` and `content/pricing.json`. The content manager at `/admin/` edits those files. There is no build step. Netlify publishes the repository as it is.

## One-time Netlify settings

1. In the Netlify site **catechism-for-africa**, open **Identity** and keep Identity enabled.
2. Set registration to **Invite only**.
3. Under Identity **Services**, enable **Git Gateway**. Without it, the content manager cannot save.
4. Invite yourself from Identity **Users**, open the email, and set a password.
5. The invite link opens the main site address. The site then forwards it to `/admin/` so the password can be set there.
6. After this change is published, open **Forms** and confirm two forms appear: `licensing` and `subscription-interest`.

Editorial workflow is on. Saving in the content manager opens a pull request on GitHub. Merging that request publishes the change. The live site updates from the `main` branch.

## What you can edit

- **Lessons:** the six original whiteboard lessons. Change a YouTube code in the lesson’s “YouTube video code” field. The code is the part after `watch?v=` in the YouTube link. Leave it blank to show “Coming soon”. These cards are marked **Original lesson**.
- **Explainers:** a separate page for short AI-assisted videos, free to watch. Leave the list empty and the page shows an empty state. Each video is marked **AI-assisted explainer, reviewed by Tebogo Mokwena**.
- **Apologetics:** a separate page. Edit the introduction yourself. Add videos or articles when you have them. Tick **AI-assisted** on a piece to show the same label. An empty list shows an empty state.
- **Prices:** Free, Individual Pro (R49 a month or R499 a year), and Parish / Coordinator (R299 a month or R2,499 a year per parish). The sign-up form does not take payment. PayFast is not connected yet.
- **About text, tagline, disclaimer, and the YouTube channel link.**

## Payments

Do not describe the sign-up form as checkout. It only registers interest until PayFast is added later.
