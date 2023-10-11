import { HandleTaskNode } from ".";
import "./style.css";

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

const app = (): void => {
  let tasksList: ListOfTasks = ListOfTasks.SubClass;
  let domHandler: HandleTaskNode = HandleTaskNode.instance;

  let input = document.getElementById("add_input")! as HTMLInputElement;

  let formElement = document.getElementById("addForm")! as HTMLFormElement;

  formElement.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    let inputTxt = input.value.trim();
    if (inputTxt !== "") {
      let newItem: ListItem = new CreateListItem(
        `${HandleTaskNode.count}-${inputTxt}`,
        inputTxt
      );

      tasksList.addTask(newItem);
      domHandler.createDiv(tasksList);
    }
  });

  let clearBtn = document.getElementById("clear")! as HTMLInputElement;
  clearBtn.addEventListener("click", () => {
    tasksList.clearTasks();
    domHandler.clear();
  });

  tasksList.load();
  domHandler.createDiv(tasksList);
};
app();
