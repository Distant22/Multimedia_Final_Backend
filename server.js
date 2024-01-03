const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  }
});

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });

io.on('connection', (socket) => {
  socket.on('message', ({
    'text': text,
    'from' : userId,
    'room' : roomId,
  }) => {

    const insertQuery = 'INSERT INTO message (room_id, text, sender) VALUES ($1, $2, $3)';
    const values = [roomId, text, userId]; 

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error('Error inserting message:', err);
      } else {
        console.log('Message inserted into the database');
      }
    });

    console.log(`User ID：${userId}｜Text：${text}｜Room ID：${roomId}`);
    io.emit('updatedMessages', "");
  });

  socket.on('disconnect', () => {
    // console.log(`Client with ID ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors())
app.post('/api/messages', (req, res) => {
  const selectQuery = 'SELECT * FROM message';
  pool.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(result.rows);
    }
  });
});
app.get('', (req, res) => {
  res.status(200).json({
    "result": "Multimedia Final setup Successfully!"
  })
})