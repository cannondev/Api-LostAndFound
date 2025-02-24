/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { Router } from 'express';
import mongoose from 'mongoose';
import * as Thoughts from './controllers/thoughts_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.route('/thought')
  .get(async (req, res) => {
    try {
      const thoughts = await Thoughts.getAllThoughts();
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const newThought = await Thoughts.createThought(req.body);
      res.json(newThought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.route('/thought/:id')
  .get(async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      const thought = await Thoughts.getThought(req.params.id);
      if (!thought || !req.params.id) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
