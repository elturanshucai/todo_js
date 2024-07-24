const form = document.querySelector('form')
const ul = document.querySelector("ul")
const timeBtn = document.getElementById("time")
const abcBtn = document.getElementById("abc")
const addBtn = document.getElementsByClassName('add-btn')[0]
let todoList = JSON.parse(localStorage.getItem("todoList")) || []
let idCount = localStorage.getItem("idCount") || 0

let timeSortType = 'asc'
let abcSortType = 'asc'

timeBtn.addEventListener("click", sortTime)
abcBtn.addEventListener("click", sortAlphabet)

function addItem(item) {
    let todoItem = {
        date: Date(),
        title: item,
        id: idCount
    }
    todoList = [todoItem, ...todoList]
    const li = createLi({ value: todoItem.title, id: todoItem.id })
    ul.prepend(li)
    idCount++
    save()
}

function removeItem(id) {
    todoList = todoList.filter(item => item.id != id)
    document.getElementById(id).remove()
    if (todoList.length === 0) {
        clickAddButton()
        idCount = 0
    }
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
    localStorage.setItem("idCount", idCount)
}

function clickEdit(id) {
    const input = document.querySelector(`li #input${id}`)
    input.disabled = !input.disabled
    if (!input.disabled) {
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
    let removeIcon = document.createElement('img')
    removeIcon.src = "images/delete.png"
    removeIcon.className = 'static'
    removeIcon.id = id
    let removeIconHover = document.createElement('img')
    removeIconHover.src = "images/delete-hover.png"
    removeIconHover.className = 'hover'
    removeIconHover.id = id
    remove.appendChild(removeIcon)
    remove.appendChild(removeIconHover)
    li.id = id
    remove.id = id
    remove.className = 'remove-btn'
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

function clickAddButton() {
    ul.classList.toggle('open')
    form.classList.toggle('hidden')
    form.todo.focus()
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    if(e.target[0].value.trim()===0) return
    addItem(e.target[0].value)
    e.target[0].value = ''
    ul.classList.toggle('open')
    form.classList.toggle('hidden')
})

addBtn.addEventListener("click", clickAddButton)



getTodoList()