export class TodoModule {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    this.init();
  }

  init() {
    this.render();
    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  render() {
    const todoList = document.createElement('div');
    todoList.className = 'todo-list';
    
    this.todos.forEach((todo, index) => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      todoItem.dataset.index = index;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.className = 'todo-checkbox';
      
      const todoText = document.createElement('span');
      todoText.textContent = todo.text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';
      deleteBtn.className = 'todo-delete';
      deleteBtn.style.marginLeft = 'auto';
      deleteBtn.style.background = 'none';
      deleteBtn.style.border = 'none';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.color = '#ff5252';
      
      todoItem.appendChild(checkbox);
      todoItem.appendChild(todoText);
      todoItem.appendChild(deleteBtn);
      todoList.appendChild(todoItem);
    });

    const todoForm = document.createElement('form');
    todoForm.className = 'todo-form';
    
    const todoInput = document.createElement('input');
    todoInput.type = 'text';
    todoInput.placeholder = 'Add a new task...';
    todoInput.required = true;
    
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add';
    
    todoForm.appendChild(todoInput);
    todoForm.appendChild(addButton);
    
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (text) {
        this.addTodo(text);
        todoInput.value = '';
      }
    });

    this.container.innerHTML = '';
    this.container.appendChild(todoList);
    this.container.appendChild(todoForm);
  }

  handleClick(event) {
    const target = event.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    const index = parseInt(todoItem.dataset.index);
    
    if (target.classList.contains('todo-checkbox')) {
      this.toggleComplete(index);
    } else if (target.classList.contains('todo-delete')) {
      this.deleteTodo(index);
    }
  }

  addTodo(text) {
    this.todos.push({
      text,
      completed: false
    });
    this.saveTodos();
    this.render();
  }

  toggleComplete(index) {
    if (this.todos[index]) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodos();
      this.render();
    }
  }

  deleteTodo(index) {
    if (this.todos[index]) {
      this.todos.splice(index, 1);
      this.saveTodos();
      this.render();
    }
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}

export default TodoModule;