import {render} from "../view.js";

const resultsNode = document.querySelector('#results');


export default {
    render() {
        resultsNode.innerHTML = render('addTask');
    }
}