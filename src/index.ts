import { CreateListItem, List, ListItem, ListOfTasks } from "./main";

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
