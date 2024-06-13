const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001' // Replace with your frontend origin if different
}));