# Invoice Generator

A simple yet powerful Invoice Generator built with React and styled using custom CSS. This application allows users to input company details, client information, add multiple line items, automatically calculate totals, and generate professional, branded invoices.

## Features

### 🏢 **Company Branding**
- **Company Information**: Add your business name, address, email, and phone number
- **Logo Upload**: Upload and display your company logo (PNG, JPG, JPEG, GIF, SVG)
- **Live Preview**: See your branding updates in real-time in the interface
- **Professional Output**: Company details and logo appear on all generated invoices

### 📋 **Invoice Management**
- **Client and Invoice Details**: Easily input invoice number, dates, client name, address, and email
- **Dynamic Line Items**: Add, edit, and remove multiple service or product line items with descriptions, quantities, and unit prices
- **Automatic Calculations**: Subtotal, tax amount (based on a configurable tax rate), and total are calculated in real-time
- **Print-Friendly Output**: Generates a clean, formatted invoice suitable for printing with your company branding

### 🎨 **Design & User Experience**
- **Custom Color Scheme**: Utilizes a professional color scheme (Blue: #01015C, Orange: #FFA200, White: #FFFFFF) for a branded look
- **Responsive Design**: Built with responsive CSS to ensure a great user experience on various screen sizes
- **Modern Interface**: Clean, intuitive design with smooth animations and hover effects
- **Accessibility**: Proper focus states and semantic markup for better accessibility

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **Vite**: A fast build tool for modern web projects
- **Custom CSS**: Hand-crafted styles for complete design control
- **FileReader API**: For secure logo image processing and preview

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

   Replace the content of `src/App.js` with the provided React code that incorporates the company details functionality and custom CSS classes.

3. **Update index.css**:

   Replace the content of `src/index.css` with the enhanced CSS styles that implement the design system and logo upload functionality.

## Running the Development Server

Once all files are in place and dependencies are installed, you can start the development server:

```bash
npm run dev
```

This will typically open the application in your browser at `http://localhost:5173/` (or another available port).

## How to Use

### 1. **Set Up Your Company Information**
   - Enter your company name, address, email, and phone number
   - Upload your company logo by clicking "📁 Choose Logo Image"
   - See your branding appear immediately in the header

### 2. **Create Invoice Details**
   - Add invoice number, date, and due date
   - Enter client information (name, address, email)

### 3. **Add Line Items**
   - Use the "Add New Item" section to include services or products
   - Edit quantities and prices directly in the table
   - Watch totals calculate automatically

### 4. **Configure Pricing**
   - Set tax rate (percentage)
   - Add discount amount if needed
   - View real-time total calculations

### 5. **Generate Invoice**
   - Click "🖨 Generate & Print Invoice" to create a professional PDF
   - Your company branding will appear on the printed invoice

## Logo Requirements

- **Supported Formats**: PNG, JPG, JPEG, GIF, SVG
- **Recommended Size**: 200x200px for best quality
- **File Size**: Keep under 5MB for optimal performance
- **Background**: Transparent PNG recommended for best results

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

## Customization Ideas

Feel free to customize this project further with:

- **Enhanced Features**:
  - Client database for storing frequent customers
  - Invoice templates with different layouts
  - Email integration for sending invoices directly
  - PDF export with advanced formatting
  - Multiple currency support
  - Recurring invoice automation

- **Business Integration**:
  - Payment gateway integration (Stripe, PayPal)
  - Accounting software connections
  - Cloud storage for invoice backups
  - Multi-user access with roles

- **Design Enhancements**:
  - Multiple color themes
  - Custom fonts and typography
  - Advanced logo positioning options
  - Invoice watermarks and security features

## Project Structure

```
src/
├── App.js          # Main application component with all functionality
├── index.js        # React application entry point
├── index.css       # Global styles, component CSS, and logo upload styling
└── assets/         # Static assets (logos, images)
```

## CSS Architecture

The project uses a modern CSS approach with:
- **CSS Custom Properties**: For consistent color usage and theming
- **Responsive Design**: Using CSS Grid and Flexbox with media queries
- **Print-Specific Styles**: Optimized styles for invoice generation
- **Component-Based CSS**: Modular styles with semantic class naming
- **Interactive States**: Hover, focus, and transition effects for better UX
- **Logo Upload Styling**: Custom file input styling with preview functionality

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **Print Support**: All major browsers with proper color reproduction
- **File Upload**: Requires modern browser with FileReader API support

## Contributing

If you'd like to contribute to this project, please feel free to submit issues and enhancement requests!

### Development Guidelines

1. **Code Style**: Follow the existing code formatting and structure
2. **CSS**: Use the established CSS custom properties for consistency
3. **Responsive**: Ensure all new features work on mobile devices
4. **Accessibility**: Maintain proper ARIA labels and keyboard navigation
5. **Print**: Test that new features work correctly when printing invoices

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Samuel Justin Ifiezibe**

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about the problem
3. Include browser version and operating system details
4. Provide steps to reproduce any bugs

---

**⭐ If you find this project helpful, please consider giving it a star!**
