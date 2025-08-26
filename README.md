
# wrAIte - AI Content Generation Platform

Welcome to **wrAIte**, your all-in-one solution for effortlessly creating high-quality written and visual content. Leveraging the power of cutting-edge AI, wrAIte helps you generate everything from blog posts and articles to stunning images, all with a few simple clicks.

## 🌟 Features

* **🤖 AI-Powered Content Generation:** Create compelling articles, blog posts, and other written content on any topic.
* **🎨 AI Image Generation:** Generate unique, high-quality images from text prompts.
* **🔐 Secure User Authentication:** Safe and secure user registration and login functionality.
* **👤 User Profiles:** Manage your profile and track your content creation history.
* **✨ Modern & Responsive UI:** A sleek and intuitive user interface built with React and modern CSS.
* **🌓 Light & Dark Mode:** Switch between light and dark themes for a comfortable user experience.

---

## 💻 Tech Stack

### Frontend

* **React:** A JavaScript library for building user interfaces.
* **Vite:** A fast and modern build tool for web development.
* **Redux:** A predictable state container for JavaScript apps.
* **React Router:** For declarative routing in your React applications.
* **Axios:** A promise-based HTTP client for the browser and Node.js.
* **CSS Modules:** For locally scoped CSS.

### Backend

* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A cross-platform document-oriented database program.
* **Mongoose:** An elegant MongoDB object modeling tool for Node.js.
* **JWT (JSON Web Tokens):** For secure user authentication.
* **Bcrypt:** A library for hashing passwords.
* **Google Generative AI (Gemini):** For advanced AI content generation.
* **ImageKit.io:** For image hosting and optimization.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* MongoDB Atlas account or local MongoDB installation

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/DeveloperChetram/ai_content_generation.git](https://github.com/DeveloperChetram/ai_content_generation.git)
    cd ai_content_generation
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**

    Create a `.env` file in the `backend` directory and add the following variables:

    ```env
    PORT=3000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    IMAGEKIT_PUBLIC_KEY=<YOUR_IMAGEKIT_PUBLIC_KEY>
    IMAGEKIT_PRIVATE_KEY=<YOUR_IMAGEKIT_PRIVATE_KEY>
    IMAGEKIT_URL_ENDPOINT=<YOUR_IMAGEKIT_URL_ENDPOINT>
    ```

2.  **Frontend Environment Variables:**

    Create a `.env` file in the `frontend` directory and add the following variable:

    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

Open your browser and navigate to `http://localhost:5173` to see the application in action.

---

## 📖 Usage

1.  **Register a new account:** Create a new user account to get started.
2.  **Login:** Log in with your credentials to access the dashboard.
3.  **Generate Content:**
    * Navigate to the "Create Post" section.
    * Enter a title, select the content type (e.g., blog post, article), and provide a prompt.
    * Click "Generate" to create your AI-powered content.
4.  **Generate Images:**
    * In the post editor, you'll find an option to generate an image.
    * Enter a prompt describing the image you want to create.
    * The generated image will be added to your post.
5.  **View and Manage Posts:**
    * Your created posts will be available on your profile page.

---

## 🔗 API Endpoints

### Auth Routes

* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Log in a user.
* `GET /api/auth/logout`: Log out a user.

### User Routes

* `GET /user/profile`: Get user profile information.
* `PATCH /user/update-user`: Update user profile information.

### Post Routes

* `POST /api/posts/create-post`: Create a new post with AI-generated content.

### Image Generation Routes

* `POST /api/generate-image/:postId`: Generate an image for a specific post.

---

## 📁 Project Structure

````

.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── services
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend
├── src
│   ├── api
│   ├── components
│   ├── pages
│   ├── redux
│   ├── routes
│   └── styles
├── .env.example
├── index.html
└── package.json

```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
```
