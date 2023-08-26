//
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Создание модели для задачи
const Task = mongoose.model('Task', {
  title: String,
  completed: Boolean,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Получение всех задач
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Создание новой задачи
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, completed: false });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Обновление статуса задачи
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Удаление задачи
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
