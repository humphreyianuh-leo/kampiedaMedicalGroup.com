/**
 * KampieDa website "Join Our Mailing List" handler.
 * Deployed as a Google Apps Script Web App under the KampieDa Google
 * Workspace account. Adds each submitted email as a member of the
 * newsletter@kampiedaMedicalGroup.com Google Group, so sending one email
 * to the group address reaches every subscriber.
 *
 * Requires the "Admin SDK API" advanced service enabled for this project,
 * and the deploying account must be a Google Workspace admin (or have
 * delegated "Groups" admin privileges).
 */
var GROUP_EMAIL = 'newsletter@kampiedaMedicalGroup.com';

function doPost(e) {
  var email = (e.parameter.email || '').trim();

  if (!email || email.indexOf('@') === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: 'Invalid email address' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    AdminDirectory.Members.insert({ email: email, role: 'MEMBER' }, GROUP_EMAIL);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var msg = err.toString();
    // Already on the list — treat as a successful (idempotent) signup.
    if (msg.indexOf('Member already exists') !== -1 || msg.indexOf('duplicate') !== -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success', note: 'already subscribed' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: msg }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
