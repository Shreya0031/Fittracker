import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { User, Feature, Health, Period } from './models.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/fitness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get('/api/feature/:userId', async (req, res) => {
  try {
    const feature = await Feature.findOne({ userId: req.params.userId });
    res.json(feature || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/feature/:userId', async (req, res) => {
  try {
    let feature = await Feature.findOne({ userId: req.params.userId });
    if (feature) {
      feature.set(req.body);
      await feature.save();
    } else {
      feature = new Feature({ userId: req.params.userId, ...req.body });
      await feature.save();
    }
    res.json(feature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/api/health/:userId', async (req, res) => {
  try {
    const health = await Health.findOne({ userId: req.params.userId });
    res.json(health || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/health/:userId', async (req, res) => {
  try {
    let health = await Health.findOne({ userId: req.params.userId });
    if (health) {
      health.set(req.body);
      await health.save();
    } else {
      health = new Health({ userId: req.params.userId, ...req.body });
      await health.save();
    }
    res.json(health);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/api/period/:userId', async (req, res) => {
  try {
    const period = await Period.findOne({ userId: req.params.userId });
    res.json(period || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/period/:userId', async (req, res) => {
  try {
    let period = await Period.findOne({ userId: req.params.userId });
    if (period) {
      period.set(req.body);
      await period.save();
    } else {
      period = new Period({ userId: req.params.userId, ...req.body });
      await period.save();
    }
    res.json(period);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });

    if (user) {
        if (user.password === password) {
            res.status(200).send({ msg: 'user exists and password is correct' });
        } else {
            res.status(401).send({ msg: 'user exists but password is incorrect' });
        }
    } else {
        res.status(404).send({ msg: 'user does not exist' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (user) {
        res.status(409).send({ msg: 'user already exists' });
    } else {
        await User.create({
            name: username,
            password: password,
        });
        res.status(201).send({ msg: 'user created' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




