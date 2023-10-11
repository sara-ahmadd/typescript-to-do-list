import { CreateListItem, HandleTaskNode, ListItem, ListOfTasks } from ".";
import "./style.css";

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
