// Google Apps Script backend for Sejong Survival Korean.
// Setup (5 minutes): see README.md, section "Collect data".
// It appends every app event as a row in the sheet "events" and serves them back to stats.html.

const HEADERS = ["time", "user", "nickname", "event", "place", "detail", "country", "level", "months"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("events");
  if (!sh) {
    sh = ss.insertSheet("events");
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const rows = (body.rows || []).slice(0, 100).map(r => [
      r.t, r.uid, r.nick, r.event, r.place, r.detail, r.country, r.level, r.months
    ].map(v => String(v == null ? "" : v).slice(0, 200)));
    if (rows.length) {
      const sh = sheet_();
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, added: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

const TEAM_KEY = "CHANGE-ME"; // set your own team password here

function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== TEAM_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ error: "key" })).setMimeType(ContentService.MimeType.JSON);
  }
  const values = sheet_().getDataRange().getValues();
  const rows = values.slice(1).map(v => {
    const o = {};
    HEADERS.forEach((h, i) => o[h] = v[i] instanceof Date ? v[i].toISOString() : v[i]);
    return o;
  });
  return ContentService.createTextOutput(JSON.stringify({ rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
