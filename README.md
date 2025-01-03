# Accounting Integration Example

This is a demo application that shows how to integrate with accounting software using [Integration.app](https://integration.app). The app allows you to:

1. Connect to various accounting systems
2. Import ledger accounts (chart of accounts)
3. Create and post journal entries

## Features

- Connect to accounting software through Integration.app
- Import and view ledger accounts
- Create double-entry journal entries with multiple lines
- Dark/Light mode support
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB database
- Integration.app account and API credentials

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB connection string
MONGO_URI=mongodb://your-mongodb-uri

# Integration.app credentials
INTEGRATION_APP_CLIENT_ID=your-client-id
INTEGRATION_APP_CLIENT_SECRET=your-client-secret
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Start by connecting your accounting software in the Integrations page
2. Import your chart of accounts from the Ledger Accounts page
3. Create journal entries using the Create Journal Entry form

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and helpers
- `/src/hooks` - Custom React hooks
- `/src/models` - MongoDB models

## Technologies

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [MongoDB](https://www.mongodb.com/) - Database
- [Integration.app](https://integration.app) - Accounting integrations

## License

MIT
