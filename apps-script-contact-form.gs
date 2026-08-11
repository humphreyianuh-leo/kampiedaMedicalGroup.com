/**
 * KampieDa website contact form handler.
 * Deploy this as a Google Apps Script Web App under your Google Workspace
 * account, then paste the deployment URL back so the site can submit to it.
 */
function doPost(e) {
  try {
    var params = e.parameter;
    var firstName = params.firstName || '';
    var lastName = params.lastName || '';
    var email = params.email || '';
    var message = params.message || '';

    var subject = 'Website Contact Form — ' + firstName + ' ' + lastName;
    var body =
      'Name: ' + firstName + ' ' + lastName + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + message;

    MailApp.sendEmail({
      to: 'info@kampiedaMedicalGroup.com',
      replyTo: email,
      subject: subject,
      body: body
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
