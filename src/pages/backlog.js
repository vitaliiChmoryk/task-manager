import {render} from "../view";

const resultsNode = document.querySelector('#results');

export default {

    render() {
        resultsNode.innerHTML = render('backlog');
    }
}
