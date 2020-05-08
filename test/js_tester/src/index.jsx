import Ginkgo from "ginkgo";

function load() {
    const greet = document.createElement('div');
    greet.innerHTML = "Hi there and greetings!";
    document.getElementById("root").append(greet);

    let c = <span>abc</span>
}

window.onload = function () {
    load();
};
