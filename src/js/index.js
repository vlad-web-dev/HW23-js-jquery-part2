const resource = 'http://localhost:3000'
const $todosSection = $('#todos')
const $formAddTask = $('#addTask')
let todos = []

function deleteTask(id) {
    return $.ajax({
        url: `${resource}/todos/${id}`,
        method: 'DELETE'
    })
}

function addTask(data) {
    return $.ajax({
        url: `${resource}/todos`,
        method: 'POST',
        data
    })
}

function changeTask(data) {
    return $.ajax({
        url: `${resource}/todos/${data.id}`,
        method: 'PUT',
        data
    })
}

function draw(whereDraw) {
    let todosContainer = ''
    todos.forEach(todo => {
        todosContainer += templateTodo(todo)
    })
    whereDraw.html(todosContainer)
}
function templateTodo(data) {
    return `<li class="todo-list" data-id="${data.id}" data-completed="${data.completed}" data-title="${data.title}">
                <div class="list-item-view">
                    <label ${data.completed !== 'false' && 'class="completed"'}>
                            <input type="checkbox" class="checkbox-completed-task" ${data.completed !== 'false' && 'checked'}>${data.title}
                    </label>
                    <button class="btn btn-danger delete-task">Delete</button>
                </div>
            </li>`
}

$.ajax({
    url: `${resource}/todos`
})
    .then((res) => {
        todos = res
        draw($todosSection)
    })

function handlerDeleteTask(event) {
    const $parentEl = $(event.target).closest('.todo-list')
    const id = $parentEl.data('id')
    deleteTask(id)
        .then(() => {
            $parentEl.remove()
        })
}

function handlerMarkedTask(event) {
    const $parentEl = $(event.target).closest('.todo-list')
    const id = $parentEl.data('id')
    const status = $parentEl.data('completed')
    const title = $parentEl.data('title')
    let newStatus = !Boolean(+status)

    changeTask({
        completed: newStatus,
        id,
        title
    })
        .then(() => {
            $parentEl.data('completed', newStatus ? '1' : '0')
            const $label = $(event.target).closest('label')
            if (newStatus) {
                $label.addClass('completed')
            } else {
                $label.removeClass('completed')
            }
        })
}


$formAddTask.submit((event) => handlerAddTask(event))

function handlerAddTask(event) {
    const $input = $(event.target).children('input')
    event.preventDefault()
    addTask({
        title: $input.val(),
        completed: false
    })
        .then(res => {
            const el = templateTodo(res)
            $todosSection.append(el)
            $input.val('')
        })
}

$todosSection.click((event) => {
    switch (event.target.tagName) {
        case 'LABEL':
            handlerMarkedTask(event)
            break;
        case 'BUTTON':
            handlerDeleteTask(event)
            break;
    }
})

