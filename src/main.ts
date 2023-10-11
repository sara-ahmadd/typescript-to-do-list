import "./style.css";
// import { addingTask, clearAllTasks } from "./index";

// addingTask();
// clearAllTasks();

interface ListItem {
  id: string;
  val: string;
  checked: boolean;
}
class CreateListItem implements ListItem {
  constructor(
    private _id: string = "",
    private _val: string = "",
    private _checked: boolean = false
  ) {}

  get id() {
    return this._id;
  }
  set id(val: string) {
    this._id = val;
  }
  get val() {
    return this._val;
  }
  set val(value: string) {
    this._val = value;
  }
  get checked() {
    return this._checked;
  }
  set checked(val: boolean) {
    this._checked = val;
  }
}
// let item = new CreateListItem("223", "task", false);

// console.log({ id: item.id, checked: item.checked, val: item.val });

// let task = { id: item.id, checked: item.checked, val: item.val };

interface List {
  list: ListItem[];
  addTask(item: ListItem): void;
  removeTask(id: string): void;
  clearTasks(): void;
  saveToLocalStorage(): void;
  renderFromLocalStorage(): void;
}

class ListOfTasks implements List {
  //this line enables us to create only one instance from this class
  static SubClass = new ListOfTasks();
  //this line prevents creation of another instances from this class
  private constructor(private _list: ListItem[] = []) {}

  get list() {
    return this._list;
  }
  set list(val: ListItem[]) {
    this._list = val;
  }

  addTask(t: ListItem) {
    ListOfTasks.SubClass.list = [...ListOfTasks.SubClass.list, t];
  }

  removeTask(id: string) {
    this._list = this._list.filter((item) => item.id !== id);
  }

  clearTasks() {
    this._list = [];
  }

  saveToLocalStorage() {
    localStorage.setItem(
      "ListOfTasks",
      JSON.stringify(ListOfTasks.SubClass.list)
    );
  }

  renderFromLocalStorage() {
    let data = localStorage.getItem("ListOfTasks") as string;
    if (data !== "undefined") return JSON.parse(data);
  }
}
// ListOfTasks.SubClass.saveToLocalStorage();
// ListOfTasks.SubClass.addTask(task);
// console.log(ListOfTasks.SubClass.renderFromLocalStorage());

//get input text
//create div > p
//add id to the p
//get that id
//create {id,text,checked=false}
//call methods of ListOfTasks

class HandleTaskNode {
  static count: number = 0;
  constructor() {}
  createDiv(val: string): HTMLDivElement {
    HandleTaskNode.count++;
    let divElem = document.createElement("div")! as HTMLDivElement;
    divElem.classList.add("singleTask");
    divElem.innerHTML = `
          <div class='taskTitle'>
            <input type='checkbox' id='check_box'/>
            <p id='task_title${HandleTaskNode.count}'>${val}</p>
          </div>
          <input type='button' value='X' class='del_btn'/>
      `;
    return divElem;
  }
  appendNodeToTasksBlock(node: HTMLDivElement): void {
    let tasksBlock = document.querySelector<HTMLDivElement>(
      ".tasks-block #tasks"
    )!;
    tasksBlock.appendChild(node);
  }
  deletingTaskNode(btn: HTMLButtonElement): void {
    btn.addEventListener("click", (e: MouseEvent) => {
      (e.currentTarget as HTMLInputElement)?.parentElement?.remove();
    });
  }
  clearAllTaskNodes(btn: HTMLInputElement): void {
    let tasksBlock = document.querySelector("#tasks")! as HTMLDivElement;
    btn.addEventListener<"click">("click", () => {
      tasksBlock.innerHTML = "";
    });
  }
}

const getInputValue = (): string => {
  let newTask = document.querySelector<HTMLInputElement>("#add_input")!;
  return newTask.value;
};
const clearInputField = () => {
  let newTask = document.querySelector<HTMLInputElement>("#add_input")!;
  newTask.value = "";
};

const createId = (val: string): string => {
  let num = Math.floor(Math.random() * 100);
  return `${val}-${num}`;
};

//construct Tasks List In LocalStorage
function constructTaskList(item: ListItem) {
  let newItem: ListItem = new CreateListItem(item.id, item.val, item.checked);
  ListOfTasks.SubClass.addTask({
    id: newItem.id,
    val: newItem.val,
    checked: newItem.checked,
  });
}
//render Tasks from local storage
function renderTasks(item: ListItem) {
  let tasks: ListItem[] = ListOfTasks.SubClass.renderFromLocalStorage();

  let newT = tasks?.filter((t) => t.id === item.id);

  if (newT.length === 0) {
    let newNode = new HandleTaskNode();
    let node = newNode.createDiv(item.val);
    newNode.appendNodeToTasksBlock(node);
  }
}

function displayTasks() {
  let formElem = document.getElementById("addForm")! as HTMLFormElement;
  formElem.addEventListener<"submit">("submit", (e) => {
    e.preventDefault();
    let input: string = getInputValue();
    let id: string = createId(input as string);
    if (input !== "") {
      let newT = { id, val: input, checked: false };
      constructTaskList(newT);
    }
    clearInputField();
    renderTasks({ id, val: input, checked: false });
  });
}

displayTasks();
