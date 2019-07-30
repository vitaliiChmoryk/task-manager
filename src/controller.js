require("@babel/polyfill");
import Model from './model.js';
import BacklogPage from './pages/backlog.js';
import boardPage from './pages/board.js';
import AddTaskPage from './pages/addTask';
import {ViewAddTask, ViewBacklog } from './view';
import { save, load} from './helpers';

const boardNavNode = document.querySelector('[data-role=nav-board]');
const backlogNavNode = document.querySelector('[data-role=nav-backlog]');
const addTaskNavNode = document.querySelector('[data-role=nav-task]');



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

function compare( a, b ) {
    if ( a.title < b.title ){
        return -1;
    }
    if ( a.title > b.title ){
        return 1;
    }
    return 0;
}

export default {
    async backlogRoute() {
        const sorted = document.querySelector('.sort');
        BacklogPage.render();
        setActiveNavNode(backlogNavNode);
        const state = load();

        const model = new Model(state || undefined);
        model.on('change', state => save(state));

        const view = new ViewBacklog();
        const controller = new Controller(model, view);

        // sorted.addEventListener('click', () => {
        //     state.sort(compare);
        //     BacklogPage.render();
        //     setActiveNavNode(backlogNavNode);
        //     const state = load();
        //
        //     const model = new Model(state || undefined);
        //     model.on('change', state => save(state));
        //
        //     const view = new ViewBacklog();
        //     const controller = new Controller(model, view);
        // });

    },
    async boardRoute() {
        boardPage.render();
        setActiveNavNode(boardNavNode);
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
