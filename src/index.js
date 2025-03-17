document.addEventListener("DOMContentLoaded", function () {
  let list = document.querySelector(".list");
  let priorityDropdown = document.getElementById("priority");

  function loadTasks() {
    list.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    todos.forEach((todo) => {
      const key = Object.keys(todo)[0];
      createTaskElement(
        todo[key].text,
        key,
        todo[key].priority,
        todo[key].done
      );
    });
  }
  // add new a task to the local storage
  function addTasks() {
    let inputContent = document.querySelector(".input-area").value;
    if (inputContent === "") {
      alert("Please enter a task");
      return;
    }
    // get the existing list of todos or an empty array it the list is empty its a stringified array
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    //create a key to assign to my new task
    const key = new Date().toISOString();
    //set the priority
    const priority = priorityDropdown.value;
    // create a new todo object with our key
    let newTask = {
      [key]: {
        text: inputContent,
        priority: priority,
        done: false,
      },
    };
    //add the new task to the dodos array
    todos.push(newTask);
    //saving the updated todo list
    localStorage.setItem("todos", JSON.stringify(todos));
    //adding the new todo to the list
    createTaskElement(inputContent, key, priority, false);

    document.querySelector(".input-area").value = "";
    priorityDropdown.value = "";
  }

  function createTaskElement(taskText, key, priority, done) {
    let li = document.createElement("li");
    li.classList.add("one-list");
    li.setAttribute("data-key", key); // adds a new key to the li

    let leftContainer = document.createElement("div");
    leftContainer.classList.add("left-content");

    let icon = document.createElement("span");
    icon.innerHTML = `<i class="fa-regular fa-circle"></i>`;

    icon.style.color = "#263238";

    let span = document.createElement("span");
    span.textContent = taskText;

    leftContainer.appendChild(icon);
    leftContainer.appendChild(span);

    let rightContainer = document.createElement("div");
    rightContainer.classList.add("right-content");

    let edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.classList.add("edit-task-btn");

    let del = document.createElement("button");
    del.textContent = "x";
    del.classList.add("del-task-btn");

    rightContainer.appendChild(edit);
    rightContainer.appendChild(del);

    li.appendChild(leftContainer);
    li.appendChild(rightContainer);

    list.appendChild(li);

    del.addEventListener("click", () => {
      li.remove();
      removeTaskFromStorage(key);
    });

    icon.addEventListener("click", () => {
      span.classList.toggle("done");
      icon.classList.toggle("icon-click");
      updateDoneStatus(key, !done);
    });

    edit.addEventListener("click", () => {
      editTask(key);
    });

    if (done) {
      span.classList.add("done");
      icon.classList.add("icon-click");
    }
    //setting the priority
    if (priority === "low") {
      li.style.backgroundColor = "#A7FFEB";
    } else if (priority === "medium") {
      li.style.backgroundColor = "#F4FF81";
    } else if (priority === "high") {
      li.style.backgroundColor = "#FF8A80";
    } else {
      li.style.backgroundColor = "white";
    }
  }

  function editTask(key) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const taskToEdit = todos.find((todo) => todo.hasOwnProperty(key))[key];
    const inputArea = document.querySelector(".input-area");
    const priorityDropdown = document.getElementById("priority");
    const taskElement = document.querySelector(`[data-key="${key}"]`);

    inputArea.value = taskToEdit.text;
    priorityDropdown.value = taskToEdit.priority;
    taskElement.style.display = "none";

    const saveEditButton = document.getElementById("save-edit");
    saveEditButton.onclick = function () {
      taskToEdit.text = inputArea.value;
      taskToEdit.priority = priorityDropdown.value;
      localStorage.setItem("todos", JSON.stringify(todos));

      createTaskElement(
        taskToEdit.text,
        key,
        taskToEdit.priority,
        taskToEdit.done
      );
      taskElement.style.display = "flex";
      inputArea.value = "";
      saveEditButton.onclick = null;
    };
  }

  function updateDoneStatus(key, done) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todo) => {
      if (todo.hasOwnProperty(key)) {
        todo[key].done = done;
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function removeTaskFromStorage(key) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter((todo) => !todo.hasOwnProperty(key));
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  document.querySelector(".form-area").addEventListener("submit", (event) => {
    event.preventDefault();
    addTasks();
  });

  document.querySelector(".delete-all").addEventListener("click", () => {
    localStorage.removeItem("todos");
    list.innerHTML = "";
  });

  loadTasks();
});
