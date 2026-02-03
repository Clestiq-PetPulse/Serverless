# PetPulse Serverless Functions

This repository contains the serverless functions for the PetPulse platform, deployed on Google Cloud Functions.

## Functions

### `email-sender`
A Cloud Function triggered by Google Cloud Pub/Sub to send email alerts using SendGrid.

- **Runtime**: Node.js 20
- **Trigger**: Pub/Sub Topic (`alert-email-topic-{env}`)
- **Entry Point**: `sendAlertEmail`

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The function requires the following environment variables:
   - `SENDGRID_API_KEY`: Your SendGrid API Key
   - `FRONTEND_DOMAIN`: The domain for the frontend application (e.g., `petpulse.clestiq.com`)

## Deployment

### CI/CD (Recommended)
This repository includes a GitHub Actions workflow `.github/workflows/serverless-deploy.yml` that automatically deploys changes to the `main` branch.

**Prerequisites**:
Add the following secrets to your GitHub Repository:
- `GCP_SA_KEY`: Google Cloud Service Account JSON Key
- `SENDGRID_API_KEY`: SendGrid API Key
- `FRONTEND_DOMAIN`: Your frontend domain

### Manual Deployment
You can deploy manually using `gcloud` CLI:

```bash
gcloud functions deploy email-sender-production \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=sendAlertEmail \
  --trigger-topic=alert-email-topic-production \
  --set-env-vars=SENDGRID_API_KEY=your_key,FRONTEND_DOMAIN=your_domain
```

## Payload Structure
The function expects a Pub/Sub message with a JSON payload:

```json
{
  "email": "user@example.com",
  "pet_name": "Buddy",
  "title": "Unusual Behavior Detected",
  "message": "Buddy has been pacing for 10 minutes.",
  "severity": "high",
  "id": "alert-uuid-123"
}
```
