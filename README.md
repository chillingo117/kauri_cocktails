# Kauri Cocktails

An interactive web application for browsing cocktail menus and building custom drinks through a guided decision-making experience.

## Overview

Kauri Cocktails is a modern, client-side React application that provides two main features:
- **Cocktail Menu**: Browse a curated selection of pre-made cocktails with descriptions and prices
- **Cocktail Builder**: Create custom drinks through an interactive decision tree that guides users through spirit selection, preparation methods, and mix-ins

## Features

### Cocktail Menu
- View 7 pre-made cocktails including classics like Daiquiri, Espresso Martini, and Bramble
- See detailed descriptions and pricing for each drink
- Quickly select a cocktail to view its full recipe and ingredients
- Special drinks highlighted with star icons

### Interactive Cocktail Builder
- **Spirit Selection**: Choose from Gin, Rum, Whiskey, or Vodka as your base
- **Decision Tree Navigation**: Navigate through hierarchical options to customize your drink
  - Ice preferences (on the rocks, neat, etc.)
  - Mixers and modifiers
  - Preparation methods
- **Dynamic Pricing**: See your drink price update in real-time as you add ingredients
- **Ingredient Tracking**: View all selected ingredients as you build
- **Navigation History**: Go back to previous steps to change your selections
- **Final Order Summary**: Review your complete custom cocktail before finishing

## Tech Stack

### Frontend
- **React 18.3.1** - Component-based UI framework
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend/Data
- **Supabase JS** - Backend service client (currently integrated but not actively used)
- **JSON Data Store** - Cocktail recipes and menu stored in `cocktailData.json`

## Project Structure

```
kauri_cocktails/
├── src/
│   ├── components/
│   │   ├── CocktailMenu.tsx      # Menu display component
│   │   └── CocktailBuilder.tsx   # Interactive builder component
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   ├── types.ts                   # TypeScript type definitions
│   ├── cocktailData.json          # Cocktail recipes and menu data
│   └── index.css                  # Global styles with Tailwind
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kauri_cocktails
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run typecheck` - Run TypeScript type checking

## Deployment

This project is configured for continuous deployment with Netlify.

### Automatic Deployment Setup

The site is deployed to Netlify with automatic deployments enabled. Any push to the `main` branch triggers an automatic build and deployment.

#### Initial Setup (Already Configured)

1. **Connect to Netlify**:
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify to access the GitHub repository
   - Select the `chillingo117/kauri_cocktails` repository

2. **Build Configuration**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Production branch**: `main`

3. **Automatic Setup**:
   - Netlify automatically creates a webhook on the GitHub repository
   - Adds a deploy key for secure code access
   - Configures continuous deployment

### How Automatic Deployment Works

When you push code to the `main` branch:

1. **GitHub** detects the push and triggers a webhook
2. **Netlify** receives the webhook notification with commit details
3. **Build Process** executes:
   - Clones the latest code from the repository
   - Runs `npm install` to install dependencies
   - Executes `vite build` to create optimized production files
   - Generates static assets in the `dist/` directory
4. **Atomic Deployment**:
   - All new files are staged
   - Only changed files are uploaded to Netlify's CDN
   - The entire new version goes live instantly once all changes are ready
   - Previous versions remain accessible for instant rollback

The entire process typically takes 1-3 minutes from push to live deployment.

### Deploy Previews

- **Branch Deploys**: Pushes to non-production branches create preview deployments with unique URLs
- **Pull Request Previews**: Each PR automatically gets a deploy preview with a shareable URL
- Netlify adds status checks and comments to PRs with preview links

### Manual Deployment

If needed, you can trigger manual deployments:
- Through the Netlify dashboard: "Trigger deploy" → "Deploy site"
- Using Netlify CLI:
  ```bash
  npm install -g netlify-cli
  ntl login
  ntl deploy --prod
  ```

### Monitoring Deployments

- View deployment status and logs in the Netlify dashboard
- Each deployment gets a unique URL for testing before going live
- Build logs show detailed information about the build process
- Failed builds automatically send notifications

## Data Structure

The application uses a hierarchical data structure stored in [cocktailData.json](src/cocktailData.json):

```typescript
{
  baseSpirits: {
    [spiritKey]: {
      name: string          // Display name (e.g., "Gin")
      price: number         // Base price
      ingredients: string[] // Initial ingredients
      options: {            // Nested decision tree
        [optionKey]: {
          name: string
          price: number
          ingredients: string[]
          options?: {...}   // Further nested options
        }
      }
    }
  },
  menuItems: [
    {
      name: string          // Cocktail name
      description: string   // Marketing description
      price: number         // Fixed price
      path: string[] | null // Navigation path in the builder
    }
  ]
}
```

## UI/UX Design

- **Dark Theme**: Slate gray backgrounds with amber accent colors
- **Responsive Layout**: Works seamlessly on mobile and desktop devices
- **Interactive Feedback**: Hover effects and smooth transitions
- **Icon Integration**: Visual cues using Lucide React icons
- **Intuitive Navigation**: Clear back buttons and progress indicators

## Development

### Type Safety
The project uses TypeScript in strict mode with comprehensive type definitions in [types.ts](src/types.ts):
- `CocktailOption` - Individual drink options
- `BaseSpirit` - Starting spirit data
- `MenuItem` - Pre-made cocktail data
- `CocktailData` - Complete data structure
- `BuilderState` - Builder component state

### Component Architecture
- **App.tsx**: Main coordinator, manages view switching
- **CocktailMenu.tsx**: Displays menu, handles cocktail selection
- **CocktailBuilder.tsx**: Complex state management for the builder experience

### Styling
The application uses Tailwind CSS with custom configuration. Styles are utility-first with some custom CSS for global elements in [index.css](src/index.css).

## Future Enhancements

Potential areas for expansion:
- Integration with Supabase for real-time menu updates
- User accounts and order history
- Shopping cart functionality
- More base spirits and options
- Nutritional information
- Drink ratings and reviews
- Photo gallery for cocktails

## License

Private project - not currently licensed for public use.

## Contributing

This is a private project. Contact the repository owner for contribution guidelines.
