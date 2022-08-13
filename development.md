# Development

## Environment

- Linux/WSL (will probably work on Windows but not tested, you would have to manually install Node.js 16)
- Docker
- Visual Studio Code with the Remote Containers plugin

## Modifying Code

1. Open the Command Palette (`Ctrl-Shift-P`), `Remote-Containers: Rebuild and Reopen in Container`
2. `cd app` (all steps here and below assume you're in the `app` folder)
3. `npm install`
4. `npm run dev`

A local server should be hosted, modifications made to the source will be updated live. Note that this live-reloading might not play well with the hardware interaction and you might have to reload the page

## Building for deployment

1. `npm run build`
2. Upload `app/build/` to the site host

## Libraries/Frameworks used

- SvelteKit
- [Carbon Components Svelte](https://carbon-components-svelte.onrender.com/)
