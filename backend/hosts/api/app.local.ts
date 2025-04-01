import 'dotenv/config';
import appPromise from './App';
appPromise.then(app => {
    const port = process.env.port || 8004;
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize the app:', error);
});

