import {render,View} from "../view";

const resultsNode = document.querySelector('#results');


export default {
    render() {
        resultsNode.innerHTML = render('board');
    }
}