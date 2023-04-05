import { Task } from "./task.js";
import { List } from "./list.js";
import { ListsController } from "./listsController.js";
// import './style.css';


const AppController = () => {
   const getListsFromStorage = () => {
      const lists = JSON.parse(localStorage.getItem('allLists'));
      console.log(lists);
      if (!lists || !lists.length) {
         return [List(
            'Todo List', '', '', false, false, []
         )];
      }
      let properLists = [];
      lists.forEach(list => {
         const properTasks = [];
         list.tasks.forEach(task => {
            let fixedDate = '';
            if (task.dueDate) {
               fixedDate = new Date(task.dueDate);
            } else {
               fixedDate = '';
            }
            properTasks.push(Task(
               task.title, 
               task.note, 
               fixedDate, 
               task.isImportant, 
               task.isDone));
         })
         properLists.
         push(List(
            list.title, 
            list.note, 
            new Date(list.dueDate), 
            list.isImportant, 
            list.isDone, 
            properTasks));
      })
      return(properLists);
   }

   const app = ListsController(getListsFromStorage());

   const sidebar = document.getElementById('sidebar');
   const listContent = document.getElementById('listContent');

   const loadListContent = (listIndex) => {
      window.localStorage.setItem('allLists', JSON.stringify(app.allLists));
      listContent.textContent = '';

      const listHeader = document.createElement('div');
      listHeader.classList.add('list-header');
      const listTitle = document.createElement('h2');
      listTitle.textContent = app.allLists[listIndex].title;
      listHeader.append(listTitle);

      const listTasks = document.createElement('div');
      listTasks.classList.add('list-tasks');
      const tasks = app.allLists[listIndex].tasks;
      
      tasks.forEach(task => {
         const li = document.createElement('li');
         li.classList.add('task');
         const taskMain = document.createElement('div');
         taskMain.classList.add('task-main');

         const checkbox = document.createElement('input');
         checkbox.classList.add('task-checkbox');
         checkbox.setAttribute('type', 'checkbox');
         if (task.isDone) {
            checkbox.checked = true;
         }
         checkbox.addEventListener('click', () => {
            task.toggleIsDone();
            loadListContent(listIndex);
         });
         taskMain.appendChild(checkbox);

         if (task.dueDate) { 
            console.log(task.dueDate);
            const date = document.createElement('span');
            date.classList.add('task-date');
            let dayAndMonth = 
            `${task.dueDate.getDate()}. ${task.dueDate.toLocaleString('default', {month: 'short'})}`;
            date.textContent = dayAndMonth;
            date.addEventListener('click', () => {
               createFormForTask('editTaskForm', listIndex, task);
            })
            taskMain.appendChild(date);
         } else {
            taskMain.classList.add('task-main-dateless')
         }

         if (task.isImportant) {
            const importantIcon = document.createElement('span');
            importantIcon.classList.add('material-icons', 'task-star');
            importantIcon.textContent = 'star';
            importantIcon.addEventListener('click', () => {
               createFormForTask('editTaskForm', listIndex, task);
            })
            taskMain.appendChild(importantIcon);
         }

         const title = document.createElement('h3');
         title.textContent = task.title;
         title.classList.add('task-title');
         title.addEventListener('click', () => {
            createFormForTask('editTaskForm', listIndex, task);
         })
         taskMain.appendChild(title);

         if (task.note != '') {
            const noteIcon = document.createElement('span');
            noteIcon.classList.add('material-icons', 'task-note');
            noteIcon.textContent = 'description';
            noteIcon.addEventListener('click', () => {
               handleClickOnNoteIcon(li, task);
            })
            taskMain.appendChild(noteIcon);
         }

         const deleteTaskButton = createDeleteTaskButton(listIndex, task);
         deleteTaskButton.textContent = '';
         const deleteTaskButtonSpan = document.createElement('span');
         deleteTaskButtonSpan.classList.add('material-icons', 'md-36');
         deleteTaskButtonSpan.textContent = 'delete';
         deleteTaskButton.append(deleteTaskButtonSpan);
         

         li.append(taskMain, deleteTaskButton);
         listTasks.append(li);
      })

      listContent.prepend(listHeader);
      listContent.append(listTasks);

      loadControlsforListContent(listIndex);
   }

   const handleClickOnNoteIcon = (li, task) => {
      const element = li.querySelector('.note');
      if (task.note != '' && !element) {
         const note = document.createElement('p');
         note.classList.add('note');
         note.textContent = task.note;
         li.appendChild(note);
      } else if (element) {
         element.remove();
      }   
   }

   const loadControlsforListContent = (listIndex) => {
      const controls = createControlsDiv();
      controls.append
      (
         createNewTaskButton(listIndex), 
         createDeleteListButton(listIndex)
      );
      listContent.append(controls);
   }

   const updateSidebar = () => {
      window.localStorage.setItem('allLists', JSON.stringify(app.allLists));
      sidebar.textContent = '';
      const lists = document.createElement('div');
      lists.classList.add('lists');
      app.allLists.forEach(list => {
         const li = document.createElement('li');
         li.addEventListener('click', () => {
            loadListContent(app.allLists.indexOf(list));
         });
         li.textContent = list.title;
         lists.append(li);
      })
      sidebar.append(lists);
      loadControlsforSidebar();
   }

   const loadControlsforSidebar = () => {
      const controls = createControlsDiv();
      controls.append(createNewListButton());
      sidebar.append(controls);
   }

   const createControlsDiv = () => {
      const controls = document.createElement('div');
      controls.classList.add('controls');
      return controls;
   }

   const createNewTaskButton = (listIndex) => {
      const newTaskButton = document.createElement('button');
      newTaskButton.setAttribute('id', 'newTaskButton');
      newTaskButton.classList.add('controls-button');
      newTaskButton.setAttribute('type', 'button');
      newTaskButton.textContent = 'New Task';
      newTaskButton.addEventListener('click', () => {
         // createFormForNewTask(listIndex)
         createFormForTask('addTaskForm', listIndex);
      });
      return newTaskButton;
   }

   const createNewListButton = () => {
      const newListButton = document.createElement('button');
      newListButton.setAttribute('id', 'newListButton');
      newListButton.classList.add('controls-button');
      newListButton.setAttribute('type', 'button');
      newListButton.textContent = 'New List';
      newListButton.addEventListener('click', () => {
         createFormForNewList();
      })
      return newListButton;
   }

   const createDeleteListButton = (listIndex) => {
      const deleteListButton = document.createElement('button');
      deleteListButton.setAttribute('id', 'deleteListButton');
      deleteListButton.classList.add('controls-button');
      deleteListButton.setAttribute('type', 'button');
      deleteListButton.textContent = 'Delete List';
      deleteListButton.addEventListener('click', () => {
         app.removeList(app.allLists[listIndex]);
         listContent.textContent = '';
         updateSidebar();
      });
      return deleteListButton;
   }

   const createFormForNewList = () => {
      closeAllForms();
      const addListForm = document.createElement('div');
      addListForm.setAttribute('id', 'addListForm');
      addListForm.classList.add('form');
      const form = document.createElement('form');
      const ul = document.createElement('ul');
      for (let i = 0; i < 1; i++) {
         const li = document.createElement('li');
         const label = document.createElement('label');
         const input = document.createElement('input');
         switch (i) {
            case 0: 
               label.textContent = 'Name';
               label.setAttribute('for', 'listTitle');
               input.setAttribute('type', 'text');
               input.setAttribute('id', 'listTitle');
               break;
            case 1:
               label.textContent = 'Due date';
               label.setAttribute('for', 'listDate');
               input.setAttribute('type', 'date');
               input.setAttribute('id', 'listDate');
               break;
            case 2:
               label.textContent = 'Note';
               label.setAttribute('for', 'listNote');
               input.setAttribute('type', 'text');
               input.setAttribute('id', 'listNote');
               break;
            case 3:
               label.textContent = 'Important';
               label.setAttribute('for', 'listIsImportant');
               input.setAttribute('type', 'checkbox');
               input.setAttribute('id', 'listIsImportant');
               break;
         }
         li.append(label, input);
         ul.append(li);
         
      }
      form.append(ul);
      
      const cancelListButton = document.createElement('button');
      cancelListButton.setAttribute('id', 'cancel-task');
      cancelListButton.setAttribute('type', 'button');
      cancelListButton.classList.add('close-button');
      const cancelSpan = document.createElement('span');
      cancelSpan.classList.add('material-icons', 'md-36');
      cancelSpan.textContent = 'close';
      cancelListButton.append(cancelSpan);
      cancelListButton.addEventListener('click', () => {
         document.getElementById('addListForm').remove();
      })
   
      const submitListButton = document.createElement('button');
      submitListButton.setAttribute('id', 'submit-task');
      submitListButton.setAttribute('type', 'button');
      submitListButton.textContent = 'Submit';
      submitListButton.addEventListener('click', () => {
         const title = document.getElementById('listTitle').value;
         // const date = document.getElementById('listDate').value;
         // let dueDate;
         // if (date != '') {
         //    dueDate = new Date(date);
         // } else {
         //    dueDate = '';
         // }
      
         // const note = document.getElementById('listNote').value;
         // const isImportant = document.getElementById('listIsImportant').checked;
         console.log('title:' + title);
         // console.log('date:' + date);
         // console.log('dueDate:' + dueDate);
         // console.log('note:' + note);
         // console.log('isImportant:' + isImportant);
         app.addList(List(title, '', '', false, false, []));
         loadListContent(app.allLists.length - 1);
         updateSidebar();
         
      })
   
      addListForm.append(cancelListButton);
      form.append(submitListButton);
      addListForm.append(form);
      sidebar.append(addListForm);
   }
   
   const createCancelButton = (formId) => {
      const cancelTaskButton = document.createElement('button');
      // cancelTaskButton.setAttribute('id', 'cancel-task');
      cancelTaskButton.setAttribute('type', 'button');
      cancelTaskButton.classList.add('close-button');
      const cancelSpan = document.createElement('span');
      cancelSpan.classList.add('material-icons', 'md-36');
      cancelSpan.textContent = 'close';
      cancelTaskButton.append(cancelSpan);
      cancelTaskButton.addEventListener('click', () => {
         document.getElementById(formId).remove();
      })
      return cancelTaskButton;
   }
   
   const createSubmitTaskButton = (formId, listIndex, task) => {
      const submitTaskButton = document.createElement('button');
      submitTaskButton.setAttribute('id', 'submit-task');
      submitTaskButton.setAttribute('type', 'button');
      submitTaskButton.textContent = 'Submit';
      submitTaskButton.addEventListener('click', () => {
         console.log(`${formId}Title`);
         const title = document.getElementById(`${formId}Title`).value;
         const date = document.getElementById(`${formId}DueDate`).value;
         let dueDate;
         if (date) {
            dueDate = new Date(date);
         } else {
            dueDate = '';
         }
         const note = document.getElementById(`${formId}Note`).value;
         const isImportant = document.getElementById(`${formId}IsImportant`).checked;
         console.log('title:' + title);
         console.log('date:' + date);
         console.log('dueDate:' + dueDate);
         console.log('note:' + note);
         console.log('isImportant:' + isImportant);
         if (!task) {
            app.allLists[listIndex].addTask(Task(title, note, dueDate, isImportant, false));
         } else {
            task.editTask(title, note, dueDate, isImportant);
         }
         loadListContent(listIndex);   
      });
   
      return submitTaskButton;
   }
   
   const createDeleteTaskButton = (listIndex, task) => {
      const deleteTaskButton = document.createElement('button');
      deleteTaskButton.classList.add('delete-task-button');
      deleteTaskButton.setAttribute('type', 'button');
      deleteTaskButton.textContent = 'Delete';
      deleteTaskButton.addEventListener('click', () => {
         app.allLists[listIndex].deleteTask(task);
         loadListContent(listIndex); 
      })
      return deleteTaskButton;
   }
   
   const createFormForTask = (formId, listIndex, task) => {
      closeAllForms();
      const taskForm = document.createElement('div');
      taskForm.setAttribute('id', formId);
      taskForm.classList.add('form');
      const form = document.createElement('form');
      const ul = document.createElement('ul');
   
      for (let i = 0; i < 4; i++) {
         const li = document.createElement('li');
         const label = document.createElement('label');
         const input = document.createElement('input');
         switch (i) {
            case 0: 
               label.textContent = 'Name';
               label.setAttribute('for', `${formId}Title`);
               input.setAttribute('type', 'text');
               input.setAttribute('id', `${formId}Title`);
               if (task) input.value = task.title;
               break;
            case 1:
               label.textContent = 'Due date';
               label.setAttribute('for', `${formId}DueDate`);
               input.setAttribute('type', 'date');
               input.setAttribute('id', `${formId}DueDate`);
               if (task) {
                  if (task.dueDate) input.valueAsDate = task.dueDate; 
               }  
               break;
            case 2:
               label.textContent = 'Note';
               label.setAttribute('for', `${formId}Note`);
               input.setAttribute('type', 'text');
               input.setAttribute('id', `${formId}Note`);
               if (task) input.value = task.note;
               break;
            case 3:
               label.textContent = 'Important';
               label.setAttribute('for', `${formId}IsImportant`);
               input.setAttribute('type', 'checkbox');
               input.setAttribute('id', `${formId}IsImportant`);
               input.classList.add('form-checkbox');
               if (task) input.checked = task.isImportant;
               break;
         }
         li.append(label, input);
         ul.append(li);
      }
   
      form.append(ul);
   
      const formButtons = document.createElement('div');
      formButtons.classList.add('form-buttons');
      formButtons.append(createSubmitTaskButton(formId, listIndex, task));
      if (task) {
         formButtons.append(createDeleteTaskButton(listIndex, task));
      }
   
      taskForm.append(createCancelButton(formId));
      taskForm.append(form);
      taskForm.append(formButtons);
      listContent.append(taskForm);
   }
   
   const closeAllForms = () => {
      if (document.getElementById('addTaskForm')) {
         document.getElementById('addTaskForm').remove();
      }
      if (document.getElementById('editTaskForm')) {
         document.getElementById('editTaskForm').remove();
      }
      if (document.getElementById('addListForm')) {
         document.getElementById('addListForm').remove();
      }
   }

   updateSidebar();
   loadListContent(0);
}

AppController();