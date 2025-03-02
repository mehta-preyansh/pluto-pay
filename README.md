# Pluto Pay

Pluto Pay is a modern banking application built with Next.js, integrating Plaid for financial data aggregation and Dwolla for seamless ACH payments. This application provides users with secure and efficient financial management features.

## Features

- **User Authentication**: Secure login and registration.
- **Plaid Integration**: Connect bank accounts and fetch transaction data.
- **Dwolla Integration**: Enable seamless ACH transfers and payments.
- **Transaction History**: View detailed transaction logs.
- **User Dashboard**: Intuitive UI for managing finances.
- **Security**: End-to-end encryption and OAuth for authentication.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Appwrite
- **Authentication**: Appwrite
- **APIs & Integrations**:
  - **Plaid**: Secure financial data access
  - **Dwolla**: ACH transfers and payment processing

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Plaid and Dwolla API credentials

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pluto-pay.git
   cd pluto-pay
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   Create a `.env.local` file and configure:
   ```env
   NEXT_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
   NEXT_PUBLIC_PLAID_SECRET=your_plaid_secret
   NEXT_PUBLIC_DWOLLA_KEY=your_dwolla_key
   NEXT_PUBLIC_DWOLLA_SECRET=your_dwolla_secret
   ```
4. Run the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```
5. Open `http://localhost:3000` in your browser.

## Deployment

Pluto Pay can be deployed on Vercel, AWS, or other cloud platforms. Make sure to configure environment variables in your deployment settings.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, reach out via email at [preyansh.dev@gmail.com](mailto\:preyansh.dev@gmail.com).

