const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const { sequelize, koneksiDatabase } = require('./config/database');
const User = require('./models/User');
const ScanResult = require('./models/ScanResult');

const authRouter = require('./routes/auth');
const resultRouter = require('./routes/result');
const analysisRouter = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRouter);
app.use('/result', resultRouter);
app.use('/static-analysis', analysisRouter);

app.get('/', (req, res) => {
  res.json({ message: 'EcoLens Express Backend Running', status: 'ok' });
});

const mulaiServer = async () => {
  await koneksiDatabase();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
    console.log(`docs Dokumentasi API di http://localhost:${PORT}/docs`);
  });
};

mulaiServer();