class CreateTaskElement {
  constructor(public val: string) {}
  createDiv() {
    let divElem = document.createElement("div")! as HTMLDivElement;
    divElem.classList.add("singleTask");
    divElem.innerHTML = `
          <div class='taskTitle'>
            <input type='checkbox' id='check_box'/>
            <p id='task_title'>${this.val}</p>
          </div>
          <input type='button' value='X' class='del_btn'/>
      `;
    return divElem;
  }
}

//adding and displaying the new task to the tasks block
export function addingTask() {
  let newTask = document.querySelector<HTMLInputElement>("#add_input")!;
  let formElem = document.querySelector<HTMLFormElement>("form.add-task")!;
  let tasksBlock = document.querySelector<HTMLDivElement>(
    ".tasks-block #tasks"
  )!;
  getLocalTasks(tasksBlock);
  formElem.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newTask.value !== "") {
      let newT: HTMLDivElement = new CreateTaskElement(
        `${newTask.value}`
      ).createDiv();
      if (newT) {
        tasksBlock.appendChild(newT);
      }
    }
    newTask.value = "";
    refreshLocalStorage();
    deleteTasks();
    checkElem();
  });
}

//get stored tasks from local storage
const getLocalTasks = (tasksBlock: HTMLDivElement) => {
  let data = localStorage.getItem("toDoListItems");
  if (data !== undefined) {
    let items: { id: number; val: string }[] = JSON.parse(data as string);
    items.forEach((item) => {
      let newT: HTMLDivElement = new CreateTaskElement(
        `${item.val}`
      ).createDiv();
      if (newT) {
        tasksBlock.appendChild(newT);
      }
    });
    deleteTasks();
    checkElem();
  }
};

//function deletes the task on cliking the del_btn
function deletingTask(btn: HTMLButtonElement): void {
  btn.addEventListener("click", (e: MouseEvent) => {
    (e.currentTarget as HTMLInputElement)?.parentElement?.remove();
    refreshLocalStorage();
  });
}

//attach deleteTask function for every del_btn
let deleteTasks = (): void => {
  let delBTNs = document.querySelectorAll<HTMLButtonElement>(
    ".singleTask .del_btn"
  )! as NodeListOf<HTMLButtonElement>;
  if (delBTNs.length > 0) {
    delBTNs.forEach((el: HTMLButtonElement) => {
      deletingTask(el);
    });
  }
};

export let clearAllTasks = (): void => {
  let clearAll = document.querySelector(
    ".tasks-block .clear_btn #clear"
  )! as HTMLButtonElement;
  let tasksBlock = document.querySelector("#tasks")! as HTMLDivElement;

  clearAll.addEventListener<"click">("click", () => {
    if (tasksBlock.innerHTML !== "") {
      tasksBlock.innerHTML = "";
      refreshLocalStorage();
    }
  });
};

//decrease the opacity of the checked tasks
function checkElem() {
  let checkBoxes = document.querySelectorAll(
    "#check_box"
  )! as NodeListOf<HTMLInputElement>;

  checkBoxes.forEach((box: HTMLInputElement) => {
    box.addEventListener<"click">("click", (e: MouseEvent) => {
      let singleTask = (e.currentTarget as HTMLInputElement)
        ?.parentElement as HTMLElement;
      singleTask.style.opacity = "0.5";
    });
  });
}

//save tasks in local storage and refresh on every change
function refreshLocalStorage() {
  let tasksContent = document.querySelectorAll<HTMLDivElement>(
    ".tasks-block #tasks .singleTask #task_title"
  )! as NodeListOf<HTMLParagraphElement>;

  let arr: { id: number; val: string }[] = [];

  if (tasksContent) {
    tasksContent.forEach((t) => {
      arr.push({
        id: Math.floor(Math.random() * 1000),
        val: t.innerText as string,
      });
    });
    localStorage.setItem("toDoListItems", JSON.stringify(arr));
  }
}
