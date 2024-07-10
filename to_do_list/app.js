const todoFormElement = document.querySelector('#todo-management form');
const todosListElement = document.getElementById('todos-list');

let editedTodoElement;

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  for (const todo of todos) {
    createTodoListItem(todo.text, todo.id, todo.completed);
  }
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoListItem(todoText, todoId, completed = false) {
  const newTodoItemElement = document.createElement('li');
  newTodoItemElement.dataset.todoid = todoId;
  if (completed) {
    newTodoItemElement.classList.add('completed');
  }

  const todoTextElement = document.createElement('p');
  todoTextElement.textContent = todoText;

  const completeTodoButtonElement = document.createElement('button');
  completeTodoButtonElement.textContent = completed ? 'Undo' : 'Complete';
  completeTodoButtonElement.addEventListener('click', toggleTodoCompletion);

  const editTodoButtonElement = document.createElement('button');
  editTodoButtonElement.textContent = 'Edit';
  editTodoButtonElement.addEventListener('click', startTodoEditing);

  const deleteTodoButtonElement = document.createElement('button');
  deleteTodoButtonElement.textContent = 'Delete';
  deleteTodoButtonElement.addEventListener('click', deleteTodo);

  const todoActionsWrapperElement = document.createElement('div');
  todoActionsWrapperElement.appendChild(completeTodoButtonElement);
  todoActionsWrapperElement.appendChild(editTodoButtonElement);
  todoActionsWrapperElement.appendChild(deleteTodoButtonElement);

  newTodoItemElement.appendChild(todoTextElement);
  newTodoItemElement.appendChild(todoActionsWrapperElement);

  todosListElement.appendChild(newTodoItemElement);
}

function createTodo(todoText) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoId = Date.now().toString();
  const newTodo = { text: todoText, id: todoId, completed: false };
  todos.push(newTodo);
  saveTodos(todos);
  createTodoListItem(todoText, todoId);
}

function updateTodo(newTodoText) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoId = editedTodoElement.dataset.todoid;

  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    todos[todoIndex].text = newTodoText;
    saveTodos(todos);
  }

  editedTodoElement.firstElementChild.textContent = newTodoText;
  todoFormElement.querySelector('input').value = '';
  editedTodoElement = null;
}

function deleteTodo(event) {
  const clickedButtonElement = event.target;
  const todoElement = clickedButtonElement.parentElement.parentElement;
  const todoId = todoElement.dataset.todoid;

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const updatedTodos = todos.filter(todo => todo.id !== todoId);
  saveTodos(updatedTodos);

  todoElement.remove();
}

function toggleTodoCompletion(event) {
  const clickedButtonElement = event.target;
  const todoElement = clickedButtonElement.parentElement.parentElement;
  const todoId = todoElement.dataset.todoid;

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    todos[todoIndex].completed = !todos[todoIndex].completed;
    saveTodos(todos);
  }

  todoElement.classList.toggle('completed');
  clickedButtonElement.textContent = todos[todoIndex].completed ? 'Undo' : 'Complete';
}

function saveTodo(event) {
  event.preventDefault();

  const formInput = new FormData(event.target);
  const enteredTodoText = formInput.get('text');

  if (!editedTodoElement) {
    createTodo(enteredTodoText);
  } else {
    updateTodo(enteredTodoText);
  }
}

function startTodoEditing(event) {
  const clickedButtonElement = event.target;
  editedTodoElement = clickedButtonElement.parentElement.parentElement;
  const currentText = editedTodoElement.firstElementChild.textContent;

  todoFormElement.querySelector('input').value = currentText;
}

todoFormElement.addEventListener('submit', saveTodo);

loadTodos();
