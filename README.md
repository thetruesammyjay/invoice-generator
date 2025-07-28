# Invoice Generator

A simple yet powerful Invoice Generator built with React and styled using custom CSS. This application allows users to input client details, add multiple line items, automatically calculate totals, and generate a printable invoice.

## Features

- **Client and Invoice Details**: Easily input invoice number, dates, client name, address, and email
- **Dynamic Line Items**: Add, edit, and remove multiple service or product line items with descriptions, quantities, and unit prices
- **Automatic Calculations**: Subtotal, tax amount (based on a configurable tax rate), and total are calculated in real-time
- **Custom Color Scheme**: Utilizes a professional color scheme (Blue: #01015C, Orange: #FFA200, White: #FFFFFF) for a branded look
- **Print-Friendly Output**: Generates a clean, formatted invoice suitable for printing
- **Responsive Design**: Built with responsive CSS to ensure a great user experience on various screen sizes
- **Logo Integration**: Includes a placeholder for your company logo in both the main application and the printable invoice

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **Vite**: A fast build tool for modern web projects
- **Custom CSS**: Hand-crafted styles for complete design control

## Prerequisites

- Node.js (version 20.19.0 or higher, or 22.12.0 or higher as per create-vite engine warning)
- npm (Node Package Manager)

## Getting Started

Follow these steps to set up and run the project locally.

### Installation

1. **Clone the repository** (or create a new Vite project):

   If you're starting from scratch, create a new Vite React project:
   ```bash
   npm create vite@latest invoice-generator -- --template react
   cd invoice-generator
   ```

2. **Install dependencies**:

   Navigate into the project directory and install the required Node.js packages:
   ```bash
   npm install
   ```

### Configuration

1. **Update project structure**:

   Your project structure should look like this:
   ```
   invoice-generator/
   ├── public/
   │   ├── index.html
   │   └── favicon.ico
   ├── src/
   │   ├── App.js (Main React component)
   │   ├── index.js (Entry point)
   │   ├── index.css (Global styles and custom CSS)
   │   └── assets/ (Optional: for images, fonts, etc.)
   │       └── logo.svg
   ├── .gitignore
   ├── package.json
   └── README.md
   ```

2. **Replace App.js content**:

   Replace the content of `src/App.js` with the provided React code that incorporates custom CSS classes and the color scheme.

3. **Update index.css**:

   Replace the content of `src/index.css` with the custom CSS styles that implement the design system.

4. **Add Logo (Optional)**:

   - Create an assets folder inside src: `src/assets/`
   - Place your logo file inside `src/assets/`
   - Update the import in `src/App.js` accordingly

## Running the Development Server

Once all files are in place and dependencies are installed, you can start the development server:

```bash
npm run dev
```

This will typically open the application in your browser at `http://localhost:5173/` (or another available port).

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

### Steps:

1. **Create a Git Repository**:

   Initialize a Git repository in your project directory and commit your files:

   ```bash
   git init
   git add .
   git commit -m "Initial commit of Invoice Generator"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com) and log in or sign up
   - Click on "Add New..." → "Project"
   - Import your Git repository (e.g., from GitHub, GitLab, Bitbucket)

3. **Deploy**:

   Vercel will automatically detect that it's a Vite React project and configure the build process. Simply click "Deploy".

Vercel will build and deploy your application, providing you with a live URL. Subsequent pushes to your connected Git branch will automatically trigger new deployments.

## Color Scheme

The application uses a consistent color scheme throughout:

- **Primary Blue**: `#01015C` - Used for headers, totals, and primary text
- **Accent Orange**: `#FFA200` - Used for buttons, focus states, and highlights
- **Background White**: `#FFFFFF` - Used for backgrounds and cards

## Customization

Feel free to customize this project further with:
- Additional features specific to your business needs
- Company branding and contact information
- Enhanced styling and UI components
- Additional export formats (PDF, etc.)
- Logo integration (simply replace the placeholder logo)

## Project Structure

```
src/
├── App.js          # Main application component
├── index.js        # React application entry point
├── index.css       # Global styles and component CSS
└── assets/         # Static assets (logos, images)
```

## CSS Architecture

The project uses a custom CSS approach with:
- CSS variables for consistent color usage
- Responsive design using CSS media queries
- Print-specific styles for invoice generation
- Hover and focus states for better user experience
- Clean, semantic class naming

## Contributing

If you'd like to contribute to this project, please feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).