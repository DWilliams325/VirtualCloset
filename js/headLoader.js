//Add any components that are needed on every html page -> reduces retyping

fetch("../html/head.html").then(response => response.text()).then(html => {
    document.head.insertAdjacentHTML("beforeend",html);
})