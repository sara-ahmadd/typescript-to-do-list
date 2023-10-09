import "./style.css";
import { addingTask, clearAllTasks } from "./index";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class='to-do-list'>
    <h1>To Do List</h1>
    <form class='add-task'>
      <input placeholder='add task' type='text' id='add_input'/>
      <input type='submit' value='add'/>
    </form>
    <div class='tasks-block'>
      <div class='clear_btn'>
        <input value='Clear' type='button' id='clear'/>
      </div>
      <div id='tasks'></div>
    </div>
  </div>
`;
addingTask();
clearAllTasks();
