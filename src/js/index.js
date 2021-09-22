const resource = 'http://localhost:3000'
const $todosSection = $('#todos')
const $formAddTask = $('#addTask')
let todos = []

async function deleteTask(id) {
    return await $.ajax({
        url: `${resource}/todos/${id}`,
        method: 'DELETE'
    })
}

async function addTask(data) {
    return await $.ajax({
        url: `${resource}/todos`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

async function changeTask(data) {
    return await $.ajax({
        url: `${resource}/todos/${data.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
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
                    <label ${data.completed && 'class="completed"'}>
                            <input type="checkbox" class="checkbox-completed-task" ${data.completed && 'checked'}>${data.title}
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

async function handlerDeleteTask(event) {
    const $parentEl = $(event.target).closest('.todo-list')
    const id = $parentEl.data('id')
    await deleteTask(id)
    $parentEl.remove()
}

async function handlerMarkedTask(event) {
    const $parentEl = $(event.target).closest('.todo-list')
    const id = $parentEl.data('id')
    const status = $parentEl.data('completed')
    const title = $parentEl.data('title')
    let newStatus = !Boolean(+status)

    await changeTask({
        completed: newStatus,
        id,
        title
    })
    $parentEl.data('completed', newStatus ? '1' : '0')
    const $label = $(event.target).closest('label')
    if (newStatus) {
        $label.addClass('completed')
    } else {
        $label.removeClass('completed')
    }
}


$formAddTask.submit((event) => handlerAddTask(event))

async function handlerAddTask(event) {
    const $input = $(event.target).children('input')
    event.preventDefault()
    const res = await addTask({
        title: $input.val(),
        completed: false
    })
    const el = templateTodo(res)
    $todosSection.append(el)
    $input.val('')
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

