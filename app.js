const express = require('express');
const app = express();

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
