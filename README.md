# QR Generator

A premium, engineering-focused QR code generator designed with a strict minimalist aesthetic. Built for speed, precision, and elegance.

![QR Generator Preview](https://github.com/Sparkyyy45/QR-Code-Generator/assets/placeholder.png)

## ✨ Features

-   **Premium Aesthetic**: Inspired by Linear and Stripe, featuring a monochrome palette, glassmorphism, and subtle grain textures.
-   **Instant Generation**: Real-time QR code rendering with optimized performance (debounced).
-   **High Precision**: Generates high-resolution (1024x1024) PNGs suitable for professional print and digital use.
-   **Customization**:
    -   **Segmented Color Control**: Switch between calibrated Black, Blue, and Red themes.
    -   **Logo Integration**: Seamlessly upload and center your brand logo within the QR code.
-   **Smart Interactions**:
    -   Fluid spring animations for all UI state changes.
    -   Micro-interactions on buttons (lift, scale, press).
    -   Smart clipboard integration.
-   **Privacy First**: 100% client-side processing. No data ever leaves your browser.

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Typography**: [Satoshi](https://fontshare.com/fonts/satoshi) (Headers) & [Inter](https://rsms.me/inter/) (Body)
-   **QR Library**: `qrcode`
-   **Language**: TypeScript

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Sparkyyy45/QR-Code-Generator.git
    cd QR-Code-Generator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎨 Design Philosophy

This project rejects generic "dashboard" styling in favor of a cohesive **Engineering Aesthetic**:

-   **Typography**: Uses `Satoshi` for headers with tight tracking (`-0.04em`) to create a dense, logotype feel.
-   **Layout**: Enforces a strict vertical rhythm (`120px` top padding, `48px` input gap) to maintain visual calm.
-   **Depth**: Avoids flat white backgrounds by using a radial gradient overlaid with an SVG noise texture for "soft depth".
-   **Glass**: The QR card uses a specialized backdrop blur with a custom shadow curve (`0 10px 40px rgba(0,0,0,0.06)`) to lift it off the page.

## 📄 License

MIT License. Free to use for personal and commercial projects.
