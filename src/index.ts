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

export function addingTask() {
  let newTask = document.querySelector<HTMLInputElement>("#add_input")!;
  let formElem = document.querySelector<HTMLFormElement>("form.add-task")!;
  let tasksBlock = document.querySelector<HTMLDivElement>(
    ".tasks-block #tasks"
  )!;

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
    deleteTasks();
    checkElem();
  });
}

//function deletes the task on cliking the del_btn
function deletingTask(btn: HTMLButtonElement) {
  btn.addEventListener("click", (e: MouseEvent) =>
    (e.currentTarget as HTMLInputElement)?.parentElement?.remove()
  );
}

//attach deleteTask for every del_btn
let deleteTasks = () => {
  let delBTNs = document.querySelectorAll<HTMLButtonElement>(
    ".singleTask .del_btn"
  )!;
  if (delBTNs.length > 0) {
    delBTNs.forEach((el) => {
      deletingTask(el);
    });
  }
};

export let clearAllTasks = () => {
  let clearAll = document.querySelector(".tasks-block .clear_btn #clear")!;
  let tasksBlock = document.querySelector("#tasks")!;
  clearAll?.addEventListener("click", () => {
    if (tasksBlock.innerHTML !== "") {
      tasksBlock.innerHTML = "";
    }
  });
};

//decrease the opacity of the checked tasks
function checkElem() {
  let checkBoxes = document.querySelectorAll(
    "#check_box"
  )! as NodeListOf<HTMLInputElement>;

  checkBoxes.forEach((box: HTMLInputElement) => {
    box.addEventListener("click", (e) => {
      let singleTask = (e.currentTarget as HTMLInputElement)
        ?.parentElement as HTMLElement;
      singleTask.style.opacity = "0.5";
    });
  });
}
