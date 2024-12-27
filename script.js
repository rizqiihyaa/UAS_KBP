let timer;
let isPaused = false;
let timeLeft = 25 * 60;
let isBreakTime = false;

const timerDisplay = document.getElementById('timer-display');
const timerLabel = document.getElementById('timer-label');
const startButton = document.getElementById('start-timer');
const pauseButton = document.getElementById('pause-timer');
const resetButton = document.getElementById('reset-timer');

startButton.addEventListener('click', () => {
  if (!timer) {
    startTimer();
  }
});

pauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
});

resetButton.addEventListener('click', () => {
  resetTimer();
});

function startTimer() {
  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        isBreakTime = !isBreakTime;
        timeLeft = isBreakTime
          ? parseInt(document.getElementById('break-time').value) * 60
          : parseInt(document.getElementById('study-time').value) * 60;
        updateTimerLabel();
        startTimer();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function updateTimerLabel() {
  const label = isBreakTime ? 'Break Time' : 'Study Time';
  timerLabel.textContent = label;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isPaused = false;
  isBreakTime = false;
  timeLeft = parseInt(document.getElementById('study-time').value) * 60;
  updateTimerDisplay();
  updateTimerLabel();
}

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodoItem(text);
    todoInput.value = '';
  }
});

function addTodoItem(text) {
  const li = document.createElement('li');
  li.textContent = text;

  const completeButton = document.createElement('button');
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveToLocalStorage();
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-times"></i>';
  deleteButton.addEventListener('click', () => {
    li.remove();
    saveToLocalStorage();
  });

  li.appendChild(completeButton);
  li.appendChild(deleteButton);
  
  todoList.appendChild(li);
  saveToLocalStorage();
}

function saveToLocalStorage() {
  const items = [];
  todoList.querySelectorAll('li').forEach((li) => {
    items.push({
      text: li.textContent.slice(0, -2),
      completed: li.classList.contains('completed'),
    });
  });
  localStorage.setItem('todoItems', JSON.stringify(items));
}

function loadFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem('todoItems')) || [];
  items.forEach(({ text, completed }) => {
    const li = document.createElement('li');
    li.textContent = text;
    if (completed) {
      li.classList.add('completed');
    }

    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener('click', () => {
      li.classList.toggle('completed');
      saveToLocalStorage();
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
    deleteButton.addEventListener('click', () => {
      li.remove();
      saveToLocalStorage();
    });
    
    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

loadFromLocalStorage();
