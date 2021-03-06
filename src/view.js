import * as Handlebars from "./handlebars-v4.1.2";
import { EventEmitter, createElement } from './helpers';

class ViewAddTask extends EventEmitter {
    constructor() {
        super();

        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('add-input');
        this.list = document.getElementById('todo-list');

        this.form.addEventListener('submit', this.handleAdd.bind(this));
    }

    createListItem(todo) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox', checked: todo.completed ? 'checked' : '' });
        const label = createElement('label', { className: 'title' }, todo.title);
        const editInput = createElement('input', { type: 'text', className: 'textfield' });
        const editButton = createElement('button', { className: 'edit' }, 'Edit');
        const deleteButton = createElement('button', { className: 'remove' }, 'Remove');
        const item = createElement('li', { className: `todo-item${todo.completed ? ' completed': ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, deleteButton);

        return this.addEventListeners(item);
    }

    addEventListeners(item) {
        const checkbox = item.querySelector('.checkbox');
        const editButton = item.querySelector('button.edit');
        const removeButton = item.querySelector('button.remove');

        checkbox.addEventListener('change', this.handleToggle.bind(this));
        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));

        return item;
    }

    findListItem(id) {
        console.log(this.list);
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Please enter name task.');

        const value = this.input.value;

        this.emit('add', value);
    }

    handleToggle({ target }) {
        const listItem = target.parentNode;
        console.log(target.parentNode.className);
        const id = listItem.getAttribute('data-id');
        const completed = target.checked;

        this.emit('toggle', { id, completed });
    }

    handleEdit({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');
        const title = input.value;
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            this.emit('edit', { id, title });
        } else {
            input.value = label.textContent;
            editButton.textContent = 'Save';
            listItem.classList.add('editing');
        }
    }

    handleRemove({ target }) {
        const listItem = target.parentNode;

        this.emit('remove', listItem.getAttribute('data-id'));
    }

    show(todos) {
        todos.forEach(todo => {
            const listItem = this.createListItem(todo);

            this.list.appendChild(listItem);
        });
    }

    addItem(todo) {
        const listItem = this.createListItem(todo);

        this.input.value = '';
        this.list.appendChild(listItem);

    }

    toggleItem(todo) {
        const listItem = this.findListItem(todo.id);
        const checkbox = listItem.querySelector('.checkbox');

        checkbox.checked = todo.completed;

        if(todo.completed) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
    }

    editItem(todo) {
        const listItem = this.findListItem(todo.id);
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');

        label.textContent = todo.title;
        editButton.textContent = 'Edit';
        listItem.classList.remove('editing');
    }

    removeItem(id) {
        const listItem = this.findListItem(id);

        this.list.removeChild(listItem);
    }
}

class ViewBacklog extends EventEmitter {
    constructor() {
        super();
        this.list = document.getElementById('backlog-list');
        this.quality = document.querySelector('.backlog-title')
    }

    createListItem(todo) {
        const label = createElement('label', { className: 'title' }, todo.title);
        const item = createElement('li', { className: `backlog-item${todo.completed ? ' completed': ''}`, 'data-id': todo.id }, label);

        return item
    }


    show(todos) {
        let count = 0;
        todos.forEach(todo => {
            const listItem = this.createListItem(todo);
            this.list.appendChild(listItem);
            if(todo.completed === true) count++;
        });

        let counter = document.createElement('div');
        counter.className = 'quality';
        let counterValue = ((count/todos.length)*100).toFixed(2);

        if (count === 0) {
            counter.innerText = 'completed: ' + count + '%';
        } else {
            counter.innerText = 'completed: ' + counterValue + '%';
        }

        this.quality.appendChild(counter);
    }

    static getArrowUp(){
        const elem = document.querySelector('.arrow_up');
        return elem
    }

    static getArrowDown(){
        const elem = document.querySelector('.arrow_down');
        return elem
    }

    static getFilterCompl() {
        const elem = document.querySelector('[data-role=completed-task');
        return elem
    }

    static getFilterUncompl() {
        const elem = document.querySelector('[data-role=uncompleted-task');
        return elem
    }

    static getFilterActive() {
        const elem = document.querySelector('[data-role=active-task');
        return elem
    }

    static getFilterAll() {
        const elem = document.querySelector('[data-role=all-task');
        return elem
    }

}

class ViewBoard extends EventEmitter {
    constructor() {
        super();
        this.todo = document.querySelector('.todo_task');
        this.active = document.querySelector('.active_task');
        this.done = document.querySelector('.done_task');
    }

    createListItem(todo) {
        const label = createElement('label', { className: 'title' }, todo.title);
        const item = createElement('li', { className: `board_item${todo.completed ? ' completed': ''}`, 'data-id': todo.id, 'id': todo.id, 'draggable':"true" }, label);
        return this.addEventListeners(item);
    }


    show(todos) {
        todos.forEach(todo => {
            const listItem = this.createListItem(todo);
            if(todo.completed) {
                this.done.appendChild(listItem);
            } else if(todo.completed == null) {
                this.active.appendChild(listItem);
            } else {
                this.todo.appendChild(listItem);
            }
        });
    }

    findListItem(id) {

        return this.todo.querySelector(`[data-id="${id}"]`);
    }

    findListItemActive(id) {

        return this.active.querySelector(`[data-id="${id}"]`);
    }

    findListItemDone(id) {

        return this.done.querySelector(`[data-id="${id}"]`);
    }

    addEventListeners(item) {

        const elem = item;

        elem.addEventListener('click', this.handleToggle.bind(this));

        return item;
    }

    handleToggle({ target }) {
        const listItem = target;
        console.log(target.parentNode.className);
        const id = listItem.getAttribute('data-id');
        console.log(id);
        let completed;
        if (target.parentNode.className === 'todo_task'){
            completed = false;
        } else if(target.parentNode.className === 'active_task') {
            completed = null;
        } else {
            completed = true;
        }
        this.emit('click', { id, completed });
    }


    toggleItem(todo) {
        console.log(todo);
        let listItem = this.findListItem(todo.id);
        if (listItem == null) {
            listItem = this.findListItemActive(todo.id);
            if (listItem == null) {
                listItem = this.findListItemDone(todo.id);
            }
        }
        if (todo.completed === null) {
            listItem.classList.add('active');
            listItem.classList.remove('completed');
        } else if(todo.completed) {
            listItem.classList.add('completed');
            listItem.classList.remove('active');
        } else {
            listItem.classList.remove('completed');
            listItem.classList.remove('active');
        }
    }

    static getBoardElemTodo() {
        const elem = document.querySelector('.todo_task');
        return elem
    }

    static getBoardElemActive() {
        const elem = document.querySelector('.active_task');
        return elem
    }

    static getBoardElemDone() {
        const elem = document.querySelector('.done_task');
        return elem
    }


}

function render(templateName, model) {
    templateName = templateName + 'Template';

    const templateElement = document.getElementById(templateName);
    const templateSource = templateElement.innerHTML;
    const renderFn = Handlebars.compile(templateSource);
    console.log('111');

    return renderFn(model);
}
export  {render, ViewAddTask, ViewBacklog, ViewBoard };
