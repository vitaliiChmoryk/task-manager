import { EventEmitter } from './helpers';

class Model extends EventEmitter {
    constructor(items = []) {
        super();

        this.items = items;
    }

    getItem(id) {
        return this.items.find(item => item.id == id);
    }

    addItem(item) {
        this.items.push(item);
        this.emit('change', this.items);
        return item;
    }

    updateItem(id, data) {
        console.log(id, data);
        const item = this.getItem(id);

        Object.keys(data).forEach(prop => item[prop] = data[prop]);

        this.emit('change', this.items);

        return item;
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id == id);

        if (index > -1) {
            this.items.splice(index, 1);
            this.emit('change', this.items);
        }
    }

    updateItemBoard(id, data) {
        const item = this.getItem(id);
        console.log(id,data)
        Object.keys(data).forEach(prop => item[prop] = data[prop]);

        this.emit('click', this.items);

        return item;
    }
}

export default Model;