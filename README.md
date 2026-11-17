# Kweki — Group Question Manager

Reusable shared classroom question manager with Topic View and Classmate View, editable topics/questions, Asked/Used tracking, and duplicate-question warnings.

## Starter dataset
The app is preloaded with the climate-change discussion questions supplied for this project. The classmate named for each part is set as that part's **assigned answerer**. Speakers with two parts are listed under both corresponding parts. Questions are copied as provided.

## Run locally
Requires Node.js 20+.
```bash
npm install
npm start
```
Open http://localhost:3000

## Deploy
This is a Node.js app, not a static GitHub Pages site.
For a Render Web Service use:
- Build command: `npm install`
- Start command: `npm start`
- Attach a persistent disk mounted at `/var/data`
- Set `DATA_DIR=/var/data`

SQLite is stored in `DATA_DIR/kweki.sqlite`. A persistent disk is required so records survive restarts and redeployments.

## Access warning
There is no login. Anyone with the public website URL can add, edit, or delete all topics and questions. Share the link only with people you trust. Add authentication before using it for sensitive records.

## Files
- `server.js` — Express API and SQLite database
- `public/` — frontend
- `seed-data.json` — editable starter content
