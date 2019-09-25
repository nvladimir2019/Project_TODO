class Todo extends Widget {
    constructor(todoSelector){
        super();
        this.selector = todoSelector;
    }

    onWidgetInit() {
        this.wrapper = document.querySelector(this.selector);
        this.blockTaskList = this.wrapper.querySelector(".task-list");
        this.blockInWork = this.wrapper.querySelector(".in-work");
        this.blockDone = this.wrapper.querySelector(".done");
        this.ulTaskList = this.blockTaskList.querySelector("ul");
        this.ulInWork = this.blockInWork.querySelector("ul");
        this.ulDone = this.blockDone.querySelector("ul");
        this.blockAddTaskList = this.blockTaskList.querySelector(".add-task-list");
        this.inputAddTaskList = this.blockAddTaskList.querySelector(".input-add-task-list");
        this.btnAddTaskList = this.blockAddTaskList.querySelector(".btn-add-task-list");

    }

    onWidgetStartWork() {
        this.updateTaskList();
        this.updateInWork();
        this.updateDone();

        this.btnAddTaskList.addEventListener('click', ()=> {
           let task = this.inputAddTaskList.value;
           this.addTaskList(task);
           this.inputAddTaskList.value = "";
           this.updateTaskList();
        });

        this.inputAddTaskList.addEventListener('keydown', (e)=> {
            if(e.keyCode === 13) {
                let task = this.inputAddTaskList.value;
                this.addTaskList(task);
                this.inputAddTaskList.value = "";
                this.updateTaskList();
            }
        });

        this.ulTaskList.addEventListener('click', (e)=> {
            if(e.target.classList.contains('btn-delete-task-list')) {
                let id = e.target.dataset.id;
                this.deleteTaskList(id);
                this.updateTaskList();
            }
            else if(e.target.classList.contains('btn-edit-task-list')) {
                let id = e.target.dataset.id;
                let taskList = this.getTaskList();
                let editTask = prompt("Изменить задачу", taskList[id]);
                if(editTask) {
                    this.editTaskList(id, editTask);
                    this.updateTaskList();
                }
            }
            else if(e.target.classList.contains('btn-in-work')) {
                let id = e.target.dataset.id;
                this.inProgress(id);
                this.updateTaskList();
                this.updateInWork();
            }
        });

        this.ulInWork.addEventListener('click', (e)=> {
            if(e.target.classList.contains('btn-return-to-task-list')) {
                let id = e.target.dataset.id;
                this.returnToTaskList(id);
                this.updateInWork();
                this.updateTaskList();
            }
            else if(e.target.classList.contains('btn-done')) {
                let id = e.target.dataset.id;
                this.done(id);
                this.updateInWork();
                this.updateDone();
            }
        });

        this.ulDone.addEventListener('click', (e)=> {
            if (e.target.classList.contains('btn-return-to-work')) {
                let id = e.target.dataset.id;
                this.returnToWork(id);
                this.updateDone();
                this.updateInWork();
            }
        });
    }


    /* --- TASK LIST --- */

    getTaskList() {
        return JSON.parse(localStorage.getItem("taskList"));
    }

    addTaskList(task) {
        if(task.length === 0) return;
        let taskList = this.getTaskList();
        if(taskList === null) {
           taskList = [];
        }
        taskList.push(task);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }

    updateTaskList() {
        let taskList = this.getTaskList();
        if(taskList !== null) {
            this.drawTaskList(taskList);
        }
    }

    drawTaskList(taskList) {
        let html = "";
        taskList.forEach((task, id) => {
        html += `
               <li>
                   <span>${task}</span>
                   <span>
                       <button class="btn btn-in-work" data-id="${id}">⇨</button>
                       <button class="btn btn-edit-task-list" data-id = "${id}">✎</button>
                       <button class="btn btn-delete-task-list" data-id = "${id}">✖</button>
                       
                    </span>
               </li>
           `;
        });
        this.ulTaskList.innerHTML = html;
    }

    deleteTaskList(id) {
        let taskList = this.getTaskList();
        taskList.splice(id, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }

    editTaskList(id, newTask) {
        let taskList = this.getTaskList();
        taskList[id] = newTask;
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }

    inProgress(id) {
        let taskList = this.getTaskList();
        let taskInWork = taskList[id];
        this.deleteTaskList(id);
        this.addInWork(taskInWork);
    }


    /* --- IN WORK --- */
    getInWork() {
        return JSON.parse(localStorage.getItem("inWork"));
    }

    addInWork(task) {
        if(task.length === 0) return;
        let tasksInWork = this.getInWork();
        if(tasksInWork === null) {
            tasksInWork = [];
        }
        tasksInWork.push(task);
        localStorage.setItem("inWork", JSON.stringify(tasksInWork));
    }

    updateInWork() {
        let inWork = this.getInWork();
        if(inWork !== null) {
            this.drawInWork(inWork);
        }
    }

    drawInWork(inWork) {
        let html = "";
        inWork.forEach((task, id) => {
            html += `
               <li>
                   <span>${task}</span>
                   <span>
                       <button class="btn btn-done" data-id="${id}">⇨</button>
                       <button class="btn btn-return-to-task-list" data-id = "${id}">⇦</button>
                    </span>
              </li>
           `;
        });
        this.ulInWork.innerHTML = html;
    }

    deleteInWork(id) {
        let inWork = this.getInWork();
        inWork.splice(id, 1);
        localStorage.setItem("inWork", JSON.stringify(inWork));
    }

    returnToTaskList(id) {
        let inWork = this.getInWork();
        let task = inWork[id];
        this.deleteInWork(id);
        this.addTaskList(task);
    }

    done(id) {
        let inWork = this.getInWork();
        let task = inWork[id];
        this.deleteInWork(id);
        this.addDone(task);
    }


    /* --- DONE --- */
    getDone() {
        return JSON.parse(localStorage.getItem("done"));
    }

    addDone(task) {
        if(task.length === 0) return;
        let tasksDone = this.getDone();
        if(tasksDone === null) {
            tasksDone = [];
        }
        tasksDone.push(task);
        localStorage.setItem("done", JSON.stringify(tasksDone));
    }

    updateDone() {
        let done = this.getDone();
        if(done !== null) {
            this.drawDone(done);
        }
    }

    drawDone(done) {
        let html = "";
        done.forEach((task, id) => {
            html += `
               <li>
                   <span>${task}</span>
                   <span>
                        <button class="btn btn-return-to-work" data-id="${id}">⇦</button>
                   </span>
              </li>
           `;
        });
        this.ulDone.innerHTML = html;
    }

    deleteDone(id) {
        let tasksDone = this.getDone();
        tasksDone.splice(id, 1);
        localStorage.setItem("done", JSON.stringify(tasksDone));
    }

    returnToWork(id) {
        let tasksDone = this.getDone();
        let task = tasksDone[id];
        this.deleteDone(id);
        this.addInWork(task);
    }
}