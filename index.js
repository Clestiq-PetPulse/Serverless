const sgMail = require('@sendgrid/mail');

exports.sendAlertEmail = async (message, context) => {
    const data = message.data
        ? Buffer.from(message.data, 'base64').toString()
        : '{}';
    const alert = JSON.parse(data);

    console.log('Processing alert:', alert);

    if (!process.env.SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY is not set');
        return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: alert.email,
        from: 'alerts@petpulse.clestiq.com', // Verified sender
        subject: `[PetPulse] Alert: ${alert.title || 'Pet Activity Detected'}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF5722;">Alert Details</h1>
        <p><strong>Pet:</strong> ${alert.pet_name || 'Unknown'}</p>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Severity:</strong> <span style="color: red;">${alert.severity}</span></p>
        <br/>
        <a href="https://${process.env.FRONTEND_DOMAIN || 'petpulse.clestiq.com'}/alerts/${alert.id}" 
           style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
          View Alert Details
        </a>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent to:', alert.email);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};
