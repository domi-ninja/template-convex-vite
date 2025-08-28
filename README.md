# template for [convex.dev](https://convex.dev/) + vite

This is how I set up my explorative side projects. Since this is a small vite react project, it is pretty modular, though many modules are covered by convex because that's just very nice. It is not the most fleshed out because I want these to be easy to set up.

## Features

- Convex auth set up with some oauth and email link login options.
  - [Scaleway](https://scaleway.com) transactional email offer for sending the emails in this template.
  - Some functions in `/convex` for getting all the user account+auth data, which is split up between two tables in convex auth in a slightly cursed way.
  - Some oauth options that I can be bothered to click through on the website
- Some minimal SEO/Opengraph hack
- Basic stuff that actually works without further fiddling around
  - Tailwind v3
  - Shadcdn
  - vercel.json

## Missing features

- Infa as code for self-hosting the convex backend
- Better auth (convex team is working on this, will check their results later)
- Discord oauth

## Usage

1. `pnpm i`
2. `pnpm dev`, follow prompts
3. Conves will have create a `.env.local` file for you. Set the rest of the env vars in there, then everything should work.
