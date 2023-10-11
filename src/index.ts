import {  List } from "./main";





export interface ListItem {
  id: string;
  val: string;
  checked: boolean;
}
export class CreateListItem implements ListItem {
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

export interface List {
  list: ListItem[];
  addTask(item: ListItem): void;
  removeTask(id: string): void;
  clearTasks(): void;
  saveToLocalStorage(): void;
  load(): void;
}

export class ListOfTasks implements List {
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
  load() {
    let data = localStorage.getItem("ListOfTasks") as string;
    if (data !== "undefined") {
      let items: { _id: string; _val: string; _checked: boolean }[] =
        JSON.parse(data);
      items.forEach((i) => {
        let newItem: ListItem = new CreateListItem(i._id, i._val, i._checked);
        ListOfTasks.SubClass.addTask(newItem);
      });
    }
  }
  addTask(t: ListItem) {
    this._list.push(t);
    this.saveToLocalStorage();
  }

  removeTask(id: string) {
    this._list = this._list.filter((item) => item.id !== id);
    this.saveToLocalStorage();
  }

  clearTasks() {
    this._list = [];
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem("ListOfTasks", JSON.stringify(this._list));
  }
}



interface DOMList {
  createDiv(list: ListOfTasks): void;
  appendNodeToTasksBlock(node: HTMLDivElement): void;
  clear(): void;
}

export class HandleTaskNode implements DOMList {
  tasksBlock: HTMLDivElement;
  static instance: HandleTaskNode = new HandleTaskNode();
  static count: number = 0;
  private constructor() {
    this.tasksBlock = document.querySelector<HTMLDivElement>(
      ".tasks-block #tasks"
    )!;
  }
  createDiv(fullList: ListOfTasks): void {
    HandleTaskNode.count++;

    this.clear();

    fullList.list.forEach((item) => {
      let divElem = document.createElement("div")! as HTMLDivElement;
      divElem.classList.add("singleTask");

      let taskTitle = document.createElement("div");
      taskTitle.className = "taskTitle";

      let checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.id = item.id;
      checkBox.checked = item.checked;

      let label = document.createElement("label");
      label.htmlFor = item.id;
      label.innerText = item.val;

      taskTitle.appendChild(checkBox);
      taskTitle.appendChild(label);

      let delBtn = document.createElement("input");
      delBtn.className = "del_btn";
      delBtn.type = "button";
      delBtn.value = "X";

      divElem.appendChild(taskTitle);
      divElem.appendChild(delBtn);

      this.appendNodeToTasksBlock(divElem);

      //add event listener to checkbox
      checkBox.addEventListener("change", () => {
        item.checked = !item.checked;
        fullList.saveToLocalStorage();
      });

      //add event listener to delete button
      delBtn.addEventListener("click", () => {
        fullList.removeTask(item.id);
        this.createDiv(fullList);
      });
    });
  }
  appendNodeToTasksBlock(node: HTMLDivElement): void {
    this.tasksBlock.appendChild(node);
  }
  clear(): void {
    this.tasksBlock.innerHTML = "";
  }
}
