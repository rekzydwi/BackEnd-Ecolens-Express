const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const ScanResult = sequelize.define('ScanResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  nama_makanan: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  confidence: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  emisi_co2_kg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  kategori_dampak: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'scan_results',
  timestamps: true,
  createdAt: 'scanned_at',
  updatedAt: false,
});

User.hasMany(ScanResult, { foreignKey: 'user_id' });
ScanResult.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ScanResult;