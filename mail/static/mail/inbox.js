document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Set up event listener for the submit button only once
  document.querySelector('#compose-submit').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    send_email();
  });

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#one-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      load_mailbox('sent');
  });
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#one-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      
      emails.forEach(email => add_mail(email, mailbox));
  });
}

function add_mail(email, mailbox) {
  const element = document.createElement('div');
  element.id = 'email-container';
  if (email.read) {
    element.style = 'background-color: #eeeeeee0;';
  }

  if (mailbox === 'inbox' || mailbox === 'archive') {
    const sender = document.createElement('div');
    sender.id = 'email-sender';
    sender.innerHTML = email.sender;
    element.append(sender)
  } else {
    element.innerHTML = 'To: ';
    const recipient = document.createElement('div');
    recipient.id = 'email-sender';
    recipient.innerHTML = email.recipients[0];
    element.append(recipient)
  }
  const subject = document.createElement('div');
  subject.id = 'email-subject';
  subject.innerHTML = email.subject;
  element.append(subject)
  const timestamp = document.createElement('div');
  timestamp.id = 'email-timestamp';
  timestamp.innerHTML = email.timestamp;
  element.append(timestamp)

  element.addEventListener('click', function() {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })

      fetch(`/emails/${email.id}`)
      .then(response => response.json())
      .then(email => {
          // Print email
          console.log(email);

          // Show the mailbox and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#one-email-view').style.display = 'block';
          document.querySelector('#one-email-view').innerHTML = '';

          const view = document.createElement('div');
          view.id = 'view-container';
          
          if (mailbox === 'inbox' || mailbox === 'archive') {
            const archive  = document.createElement('div');
            archive.id = 'archive';
            const archive_btn = document.createElement('button');
            archive_btn.className = "btn btn-sm btn-outline-info";
            if (mailbox === 'archive') {
              archive_btn.innerHTML = 'Unarchive';
              archive_btn.addEventListener('click', function() {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: false
                  })
                })
                .then(() => {
                  load_mailbox('inbox');
                });
              });
            } else if (mailbox === 'inbox') {
              archive_btn.innerHTML = 'Archive';
              archive_btn.addEventListener('click', function() {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: true
                  })
                })
                .then(() => {
                  load_mailbox('inbox');
                });
              });
            }
            archive.append(archive_btn);
            view.append(archive);
          }

          const sender = document.createElement('div');
          sender.id = 'view-sender';
          sender.innerHTML = '<strong>From:</strong> ' + email.sender;
          view.append(sender);
          
          const recipient = document.createElement('div');
          recipient.id = 'view-recipient';
          recipient.innerHTML = '<strong>To:</strong> ' + email.recipients[0];
          view.append(recipient);
          
          const subject = document.createElement('div');
          subject.id = 'view-subject';
          subject.innerHTML = '<strong>Subject:</strong> ' + email.subject;
          view.append(subject);
          
          const timestamp = document.createElement('div');
          timestamp.id = 'view-timestamp';
          timestamp.innerHTML = '<strong>Timestamp:</strong> ' + email.timestamp;
          view.append(timestamp);          

          const reply = document.createElement('button');
          reply.id = 'reply_btn';
          reply.className = "btn btn-sm btn-outline-primary";
          reply.innerHTML = "Reply";
          reply.addEventListener('click', function() {
            compose_email();
            document.querySelector('#compose-recipients').value = email.sender;
            document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
            document.querySelector('#compose-body').value = 'On ' + email.timestamp + ' ' + email.sender + ' wrote: ' + email.body + '\n';

          });
          view.append(reply)

          view.append(document.createElement('hr'));

          const body = document.createElement('div');
          body.id = 'view-body';
          body.innerHTML = email.body;
          view.append(body)

          document.querySelector('#one-email-view').append(view);
      });
  });

  document.querySelector('#emails-view').append(element);
}