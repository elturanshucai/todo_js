const form = document.querySelector('form')
const ul = document.querySelector("ul")
const timeBtn = document.getElementById("time")
const abcBtn = document.getElementById("abc")
let todoList = JSON.parse(localStorage.getItem("todoList")) || []

let timeSortType = 'asc'
let abcSortType = 'asc'

timeBtn.addEventListener("click", sortTime)
abcBtn.addEventListener("click", sortAlphabet)

function addItem(item) {
    let todoItem = {
        date: Date(),
        title: item,
        id: todoList.length
    }
    todoList = [todoItem, ...todoList]
    const li = createLi({ value: todoItem.title, id: todoItem.id })
    ul.prepend(li)
    save()
}

function removeItem(id) {
    todoList = todoList.filter(item => item.id != id)
    document.getElementById(id).remove()
    save()
}

function editItem({ id, newTitle }) {
    let updatedItem = todoList.filter(item => item.id === id)[0]
    updatedItem.title = newTitle
    todoList.forEach(elem => {
        if (elem.id === updatedItem.id) {
            elem.title = updatedItem.title
        }
    });
    let input = document.querySelector(`li #input${id}`)
    input.value = newTitle
    clickEdit(id)
    save()
}

function save() {
    localStorage.setItem("todoList", JSON.stringify(todoList))
}

function clickEdit(id) {
    const input = document.querySelector(`li #input${id}`)
    input.disabled = !input.disabled
    if(!input.disabled){
        input.focus()
    }
}

function createLi({ value, id }) {
    let li = document.createElement("li")
    let input = document.createElement("input")
    input.disabled = true
    input.value = value
    input.id = `input${id}`
    input.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            editItem({ id, newTitle: e.target.value })
        }
    })
    li.appendChild(input)
    let remove = document.createElement('button')
    remove.innerText = 'x'
    li.id = id
    remove.id = id
    remove.addEventListener("click", (e) => {
        removeItem(e.target.id)
    })
    let edit = document.createElement('button')
    let editIcon = document.createElement('img')
    editIcon.src = "images/edit.svg"
    editIcon.id = id
    edit.appendChild(editIcon)
    edit.className = 'edit-btn'
    edit.id = id
    edit.addEventListener("click", (e) => {
        clickEdit(e.target.id)
    })
    li.appendChild(remove)
    li.appendChild(edit)
    return li;
}

function getTodoList() {
    for (let i = 0; i < todoList.length; i++) {
        let li = createLi({ value: todoList[i].title, id: todoList[i].id })
        ul.appendChild(li)
    }
}

function sortAlphabet() {
    if (abcSortType === 'asc') {
        todoList.sort(function (a, b) {
            let titleA = a.title
            let titleB = b.title
            return (titleA > titleB) ? 1 : (titleA < titleB) ? -1 : 0
        })
    } else if (abcSortType === 'desc') {
        todoList.sort(function (a, b) {
            let titleA = a.title
            let titleB = b.title
            return (titleA < titleB) ? 1 : (titleA > titleB) ? -1 : 0
        })
    }
    ul.innerHTML = ''
    getTodoList()
    abcSortType === 'asc' ? abcSortType = 'desc' : abcSortType = 'asc'
    save()
}

function sortTime() {
    if (timeSortType === 'asc') {
        todoList.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (timeSortType === 'desc') {
        todoList.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    ul.innerHTML = ''
    getTodoList()
    timeSortType === 'asc' ? timeSortType = 'desc' : timeSortType = 'asc'
    save()
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    addItem(e.target[0].value)
    e.target[0].value = ''
})

getTodoList()