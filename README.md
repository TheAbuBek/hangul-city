# 세종 생존 한국어 · Sejong Survival Korean

A web app for exchange and international students at Sejong University. Students role-play the conversations they actually have on campus (cafeteria, GS25, department office, bus, emailing a professor), then complete the same task in real life.

Built for **영어와컴퓨터 (Autumn 2026)**: PBL Module 1 (app) and Module 2 (evaluation).

## Files

| File | What it is |
|---|---|
| `index.html`, `app.js`, `style.css` | The app |
| `data.js` | **All Korean lines.** Edit dialogue here, no other file needs changing |
| `track.js` | Records usage events |
| `config.js` | Where you paste the data-collection URL |
| `stats.html` | Team dashboard (open `/stats.html`) |
| `apps-script.gs` | Backend code you paste into a Google Sheet |

## Collect data (5 minutes, do this before sharing the link)

1. Create a new Google Sheet, for example "SSK data".
2. **Extensions → Apps Script**. Delete what's there, paste all of `apps-script.gs`, and save.
3. **Deploy → New deployment → type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click Deploy, allow the permissions, and copy the **Web app URL** (ends in `/exec`).
5. Paste it into `config.js`: `window.SSK_ENDPOINT = "https://script.google.com/macros/s/.../exec";`
6. Commit. Within about a minute every event appears as a new row in the sheet's `events` tab.

## What gets recorded

One row per event: time, random user id, nickname, event, place, detail, country, Korean level, months in Korea.

| Event | Detail | Use in Module 2 |
|---|---|---|
| `signup` | country | sample description |
| `session_start` | | daily usage, return rate |
| `place_start` / `place_quit` / `practice_done` | slips count | completion funnel |
| `answer_wrong` | `formal`, `casual`, `rude`, `meaning`, `word_order`, `wrong_word` | which mistakes learners make |
| `translate`, `listen` | Korean line | which lines are hardest |
| `mission_done` | `yes` / `partly` / `no` | real-world transfer (self-report) |
| `mission_later` | | how many skip the real mission |

No real names or emails are collected. Students are told this on the sign-up screen.

## Editing dialogue

Open `data.js`. Each place has a `script`: lines with `who:"them"` are what the Korean person says. `type:"pick"` turns list `options`; the `answer` index is the correct one, and `notes`/`kinds` explain each wrong option.
