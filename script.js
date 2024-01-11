const btnAdauga = document.getElementById('btnAdauga');
const btnGoleste = document.getElementById('btnGoleste');
const txtItem = document.getElementById('txtItem');
const textFiltru = document.getElementById('txtFiltru');
const lista = document.getElementById('list');

const key = "lista";

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    btnAdauga.addEventListener('click', adaugaTask);
    btnGoleste.addEventListener('click', golesteLista);
    lista.addEventListener('click', onListClick);
    textFiltru.addEventListener('keyup', onKeyUp);

    citesteDinLocalStorage().forEach(x => {
        adaugaElement(x.text, x.isDone);
    });
}

function adaugaTask(e) {
    if (!txtItem.value || txtItem.value === '') {
        alert('Nu se pot adauga task-uri goale!');
        return;
    }
    adaugaElement(txtItem.value);
    scrieInLocalStorage({ isDone: false, text: txtItem.value });
    txtItem.value = '';
    txtItem.focus();
}

function adaugaElement(value, isDone = false) {
    let el = document.createElement('li');
    el.innerHTML = `<input type="checkbox" ${isDone ? "checked" : ""}><span>${value}</span><i>x</i>`;
    lista.appendChild(el);
}

function golesteLista(e) {
    if (!confirm('Esti sigur ca vrei sa golesti lista')) {
        return;
    }
    lista.innerHTML = '';
    localStorage.clear();
}

function onListClick(e) {
    let tg = e.target,
        li = tg.closest('li');
    if (tg.nodeName == "I") {
        if (!confirm('Esti sigur ca vrei sa stergi taskutile?')) {
            return;
        }
        let span = li.querySelector('span');
        stergeDinLocalStorage(span.textContent);
        li.remove();
    } else {
        const chk = li.querySelector('input[type="checkbox"]');
        chk.checked = !chk.checked;
        scrieInLocalStorage({ isDone: chk.checked, text: chk.nextElementSibling.textContent });
    }
}

let time;
function onKeyUp(e) {
    clearTimeout(time);
    time = setTimeout(() => onFiltre(e), 400); // Intarzierea in milisecunde
}

function onFiltre(e) {
    let filtru = e.target.value.toLowerCase();
    let elemente = lista.querySelectorAll('li');
    elemente.forEach(i => {
        const txt = i.children[1].textContent.toLowerCase();
        if (txt.indexOf(filtru) > -1) {
            i.style.display = "flex";
        } else {
            i.style.display = "none";
        }
    });
}

function scrieInLocalStorage(obj) {
    if (!obj) return;
    let items;
    if (localStorage.getItem(key) === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem(key));
    }
    let item = items.find(x => x.text == obj.text);
    if (item) {
        Object.assign(item, obj);
    } else {
        items.push(obj);
    }
    localStorage.setItem(key, JSON.stringify(items));
}

function stergeDinLocalStorage(text) {
    let items;
    if (localStorage.getItem(key) === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem(key));
    }
    items = items.filter(x => x.text !== text); // "filtre" în loc de "filtre"
    localStorage.setItem(key, JSON.stringify(items));
}

function citesteDinLocalStorage() {
    let items;
    let raw = localStorage.getItem(key);
    if (raw) {
        items = JSON.parse(raw);
    } else {
        items = [];
    }
    return items;
}
