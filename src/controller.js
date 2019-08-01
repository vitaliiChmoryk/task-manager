require("@babel/polyfill");
import Model from './model.js';
import BacklogPage from './pages/backlog.js';
import BoardPage from './pages/board.js';
import AddTaskPage from './pages/addTask';
import {ViewAddTask, ViewBacklog, ViewBoard } from './view';
import { save, load} from './helpers';

const boardNavNode = document.querySelector('[data-role=nav-board]');
const backlogNavNode = document.querySelector('[data-role=nav-backlog]');
const addTaskNavNode = document.querySelector('[data-role=nav-task]');

const arrowUp = ViewBacklog.getArrowUp();
const arrowDown = ViewBacklog.getArrowDown();
const completed = ViewBacklog.getFilterCompl();
const uncompleted = ViewBacklog.getFilterUncompl();
const all = ViewBacklog.getFilterAll();

let activeNavNode;
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on('add', this.addTodo.bind(this));
        view.on('toggle', this.toggleTodo.bind(this));
        view.on('edit', this.editTodo.bind(this));
        view.on('remove', this.removeTodo.bind(this));

        view.show(model.items);
    }

    addTodo(title) {
        const item = this.model.addItem({
            id: Date.now(),
            title,
            completed: false
        });

        this.view.addItem(item);
    }

    toggleTodo({ id, completed }) {
        const item = this.model.updateItem(id, { completed });

        this.view.toggleItem(item);
    }

    editTodo({ id, title }) {
        const item = this.model.updateItem(id, { title });

        this.view.editItem(item);
    }

    removeTodo(id) {
        this.model.removeItem(id);
        this.view.removeItem(id);
    }
}


function setActiveNavNode(node) {
    if (activeNavNode) {
        activeNavNode.classList.remove('active');
    }

    activeNavNode = node;
    activeNavNode.classList.add('active');
}

function compare( obj1, obj2 ) {
    if ( obj1.title < obj2.title ){
        return -1;
    }
    if ( obj1.title > obj2.title ){
        return 1;
    }
    return 0;
}

function filterCompleted(array){
    console.log(array);
    let completedTask = array.filter(function (obj) {
        return obj.completed === true ? obj: '';
    });
console.log(completedTask.length);
    if (completedTask.length === 0)
        completedTask.push({title:'Unfortunately, you don\'t have completed tasks :('});
    return completedTask;
}

function filterUncompleted(array){
    console.log(array);
    let completedTask = array.filter(function (obj) {
        return obj.completed === false ? obj: '';
    });
    console.log(completedTask.length);
    if (completedTask.length === 0)
        completedTask.push({title:'Fortunately, you don\'t have uncompleted tasks :)'});
    return completedTask;
}

function sortAsc() {
    BacklogPage.render();

    const arrowUp = ViewBacklog.getArrowUp();
    const arrowDown = ViewBacklog.getArrowDown();
    const completed = ViewBacklog.getFilterCompl();
    const uncompleted = ViewBacklog.getFilterUncompl();
    const all = ViewBacklog.getFilterAll();

    const state = load();

    state.sort(compare);
    const model = new Model(state || undefined);
    model.on('change', state => save(state));

    const view = new ViewBacklog();
    const controller = new Controller(model, view);

    arrowUp.addEventListener('click', sortDesc);
    arrowDown.addEventListener('click', sortAsc);
    completed.addEventListener('click', completedTasks);
    uncompleted.addEventListener('click', uncompletedTasks);
    all.addEventListener('click', allTasks);
}

function sortDesc() {
    BacklogPage.render();

    const arrowUp = ViewBacklog.getArrowUp();
    const arrowDown = ViewBacklog.getArrowDown();
    const completed = ViewBacklog.getFilterCompl();
    const uncompleted = ViewBacklog.getFilterUncompl();
    const all = ViewBacklog.getFilterAll();

    const state = load();
    state.sort(compare);
    state.reverse();
    const model = new Model(state || undefined);
    model.on('change', state => save(state));

    const view = new ViewBacklog();
    const controller = new Controller(model, view);


    arrowUp.addEventListener('click', sortDesc);
    arrowDown.addEventListener('click', sortAsc);
    completed.addEventListener('click', completedTasks);
    uncompleted.addEventListener('click', uncompletedTasks);
    all.addEventListener('click', allTasks);
}

function completedTasks() {
    BacklogPage.render();

    const arrowUp = ViewBacklog.getArrowUp();
    const arrowDown = ViewBacklog.getArrowDown();
    const completed = ViewBacklog.getFilterCompl();
    const uncompleted = ViewBacklog.getFilterUncompl();
    const all = ViewBacklog.getFilterAll();

    completed.classList.add('active');

    const state = load();
    const filter = filterCompleted(state);
    const model = new Model(filter || undefined);
    model.on('change', state => save(state));

    const view = new ViewBacklog();
    const controller = new Controller(model, view);

    arrowUp.addEventListener('click', sortDesc);
    arrowDown.addEventListener('click', sortAsc);
    completed.addEventListener('click', completedTasks);
    uncompleted.addEventListener('click', uncompletedTasks);
    all.addEventListener('click', allTasks);
}

function uncompletedTasks() {
    BacklogPage.render();

    const arrowUp = ViewBacklog.getArrowUp();
    const arrowDown = ViewBacklog.getArrowDown();
    const completed = ViewBacklog.getFilterCompl();
    const uncompleted = ViewBacklog.getFilterUncompl();
    const all = ViewBacklog.getFilterAll();

    uncompleted.classList.add('active');

    const state = load();
    const filter = filterUncompleted(state);
    const model = new Model(filter || undefined);
    model.on('change', state => save(state));

    const view = new ViewBacklog();
    const controller = new Controller(model, view);

    arrowUp.addEventListener('click', sortDesc);
    arrowDown.addEventListener('click', sortAsc);
    completed.addEventListener('click', completedTasks);
    uncompleted.addEventListener('click', uncompletedTasks);
    all.addEventListener('click', allTasks);
}

function allTasks() {
    BacklogPage.render();
    const arrowUp = ViewBacklog.getArrowUp();
    const arrowDown = ViewBacklog.getArrowDown();
    const completed = ViewBacklog.getFilterCompl();
    const uncompleted = ViewBacklog.getFilterUncompl();
    const all = ViewBacklog.getFilterAll();

    all.classList.add('active');

    const state = load();
    const model = new Model(state || undefined);
    model.on('change', state => save(state));

    const view = new ViewBacklog();
    const controller = new Controller(model, view);

    arrowUp.addEventListener('click', sortDesc);
    arrowDown.addEventListener('click', sortAsc);
    completed.addEventListener('click', completedTasks);
    uncompleted.addEventListener('click', uncompletedTasks);
    all.addEventListener('click', allTasks);
}

export default {
    async backlogRoute() {
        BacklogPage.render();
        setActiveNavNode(backlogNavNode);

        const arrowUp = ViewBacklog.getArrowUp();
        const arrowDown = ViewBacklog.getArrowDown();
        const completed = ViewBacklog.getFilterCompl();
        const uncompleted = ViewBacklog.getFilterUncompl();
        const all = ViewBacklog.getFilterAll();

        const state = load();
        const model = new Model(state || undefined);

        model.on('change', state => save(state));

        const view = new ViewBacklog();
        const controller = new Controller(model, view);

        arrowUp.addEventListener('click', sortDesc);
        arrowDown.addEventListener('click', sortAsc);
        completed.addEventListener('click', completedTasks);
        uncompleted.addEventListener('click', uncompletedTasks);
        all.addEventListener('click', allTasks);

    },

    async boardRoute() {
        BoardPage.render();
        setActiveNavNode(addTaskNavNode);
        const state = load();
        const model = new Model(state || undefined);

        model.on('change', state => save(state));
        const view = new ViewBoard();
        const controller = new Controller(model, view);
    },

    async addTaskRoute() {
        AddTaskPage.render();
        setActiveNavNode(addTaskNavNode);
        const state = load();
        const model = new Model(state || undefined);

        model.on('change', state => save(state));
        const view = new ViewAddTask ();
        const controller = new Controller(model, view);
    }
};
