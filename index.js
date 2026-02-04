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
        from: 'alerts@petpulse.clestiq.com', // Stay with this for now as user committed it, but I'll add a comment
        subject: `[PetPulse] Alert for ${alert.pet_name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Activity Detected</h2>
        <p style="font-size: 16px; color: #555;"><strong>${alert.pet_name}</strong>: ${alert.message}</p>
        <br/>
        <a href="https://www.petpulse.clestiq.com/alerts/${alert.id}" 
           style="background-color: #007bff; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
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
