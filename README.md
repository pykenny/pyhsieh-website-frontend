# pyhsieh-website-frontend

Repository for frontend server of personal website. Still under construction...

# Quick recipes

## Prerequisites

### Resource Management Backend

➡️ Right [here](https://github.com/pykenny/pyhsieh-website-backend).

### HTTPS Support

The Dev server's running on HTTPS so you'll need a locally certified SSL key.

There are tons of step-by-step recipes available online... but why not just trying out [mkcert](https://github.com/FiloSottile/mkcert) to save your day, or call it a day earlier?

### Environment Settings

Create a `.env` text file under repo root. Fill in all the fields listed in the template below!

```text
SITE_HOST="Your site host with HTTPS protocol. e.g., https://my-dev-site.com"
BACKEND_RESOURCE_HOST="Your backend resouce management host. e.g., http://localhost:8080"
IMAGE_DIR_PATH="Path for where you store images for blog posts."
SERVER_PORT="Port you'd like the dev server to run upon."
EXTERNAL_LINKS="External links you want to use in the website. e.g., {"githubURL": "https://github.com/pykenny"}"
SSL_KEY_PATH="Path of SSL key generated in previous step."
SSL_CERT_PATH="Path of SSL cert generated in previous step."
```

## Installation

Try get `node v12.19.0` setup on the machine, or higher.

## Stack Dev Server up for Run

1. Clone this repository.
2. Under repo root, run `yarn boot-dev` to install dependecies.
3. (Optional) `yarn sync-templates`.
4. (Required for now) `yarn build-static-pages`.
5. Make sure resource management server is running and its host:port is in line with `BACKEND_RESOURCE_HOST` in environment settings.
6. Run `yarn dev` to start development server. Check out `yarn dev --help` for possible options.
7. Open the browser and enter `SITE_HOST:SERVER_PORT`. You should see the main page now.
8. If you've build up some blog entries in the resource server, try accessing `SITE_HOST:SERVER_PORT/blog` as well!
