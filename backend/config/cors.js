const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "https://stayzz-1olr.onrender.com",
        "https://stayzz-frontend.onrender.com"
    ].filter(Boolean),
    credentials: true,
};

export default corsOptions;
