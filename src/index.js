const express = require('express');
const cors = require('cors');
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

app.use('/auth', authRouter);
app.use('/result', resultRouter);
app.use('/static-analysis', analysisRouter);

app.get('/', (req, res) => {
  res.json({ message: 'EcoLens Express Backend Running', status: 'ok' });
});

const mulaiServer = async () => {
  await koneksiDatabase();
  await sequelize.sync({ alter: true }); // buat/update tabel otomatis
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

mulaiServer();