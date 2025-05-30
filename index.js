const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const morgan = require('morgan');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(morgan(':method :url :response-time :date[web] :status :res[content-length]'));
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

const Peripherals = mongoose.model('Peripheral', {
  name: String,
  description: String,
  price: String,
  photo: String,
  latitude: Number,
  longitude: Number,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/peripheral', async (req, res) => {
  const peripherals = await Peripherals.find();
  res.json(peripherals);
});

app.post('/peripheral', upload.single('photo'), async (req, res) => {
  const { name, description, price, latitude, longitude } = req.body;
  const photo = req.file ? req.file.path : null;
  const peripheral = new Peripherals({ name, description, price, photo, latitude, longitude });
  await peripheral.save();
  res.json(peripheral);
});

app.listen(3000, () => console.log('Backend listening on port 3000'));