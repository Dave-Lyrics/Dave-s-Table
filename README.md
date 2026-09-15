# Dave's Table Restaurant Ordering System

A full-stack restaurant ordering application based on the supplied project brief.

## Included

- Single permanent admin account. Admin signup is rejected after the first admin exists.
- Customer signup/login/logout.
- Forgot-password and reset-code flows.
- Menu CRUD with availability toggle.
- Persistent customer cart in MongoDB.
- Checkout with delivery address.
- Paystack initialize + backend verification.
- Order history and Pending-only customer cancellation.
- Admin order dashboard with status workflow.
- Socket.io live paid-order push to the admin dashboard.
- Transactional email hooks with Nodemailer.
- Cloudinary image upload support.
- Blue and white Dave's Table visual identity.

## Setup

1. Install Node.js 18+.
2. Install MongoDB locally or use MongoDB Atlas.
3. Copy `.env.example` to `.env` and fill in your values.
4. From the project root run:

```bash
npm install
npm install --prefix frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000/api/health

## Admin

First visit:

`http://localhost:5173/admin/signup`

The backend enforces the one-admin rule, so a second admin cannot be created even if someone manually calls the endpoint.

After the admin exists, use:

`http://localhost:5173/admin/login`

## Paystack

The backend initializes transactions and verifies them directly against Paystack before marking an order as paid. Set `PAYSTACK_SECRET_KEY` and a callback URL in `.env`.

## Email

Add SMTP credentials for real email delivery. Without SMTP credentials, email sending is safely skipped and logged, so local development can continue.

## Cloudinary

Cloudinary is optional. If its environment variables are present, uploaded menu images are sent to Cloudinary. The menu manager also accepts image URLs, which makes local testing easier.

## Production notes

Before deployment, use strong secrets, HTTPS, a production MongoDB connection, secure cookie settings, real SMTP credentials, Cloudinary credentials, Paystack live/test keys as appropriate, and set `CLIENT_URL` to the deployed frontend URL.

## Scope

The supplied brief explicitly excludes multi-admin/staff permissions, guest checkout, delivery tracking/maps, loyalty points, discounts and coupon codes.
