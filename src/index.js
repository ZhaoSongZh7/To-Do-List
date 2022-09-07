import './style.css';
import deleteIcon from './delete.png';
import projectEditIcon from './projectedit.png';
import { format, compareAsc, isToday, endOfDay, lastDayOfWeek, startOfWeek} from 'date-fns';

const projectOverlay = document.querySelector('.create-project-overlay');
const overlayForm = document.querySelectorAll('.overlay-form');
const overlayFormContainer = document.querySelectorAll('.overlay-form-container');
const createProjectButton = document.querySelector('.create-project-button');
const overlayProjectFormSubmitButton = document.querySelector('.overlay-project-form-submit-button');
const projectTitleInput = document.querySelector('#project-title-input');
const projectDescriptionInput = document.querySelector('#project-description-input');
const projectDueDateInput = document.querySelector('#project-due-date-input');
const projectPriorityInput = document.querySelector('#project-priority-input');
const projectNotesInput = document.querySelector('#project-notes-input');
const titleInput = document.querySelector('#title-input');
let dueDateInput = document.querySelector('#due-date-input');
const defaultInfoDescription = document.querySelector(".default-info-description")
const infoDescriptionGrid = document.querySelector('.info-description-grid');
let titleValue;
let descriptionValue;
let dueDateValue;
let priorityValue;
let notesValue;
const todoProjectList = document.querySelector('.todo-project-list');
const infoTitle = document.querySelector('.info-title');
const inboxButton = document.querySelector('.inbox');
const todayButton = document.querySelector('.today');
const thisWeekButton = document.querySelector('.this-week');
const todoProjectOverlay = document.querySelector('.create-todo-project-overlay');
const createTodoProjectButton = document.querySelector('.create-todo-project-button');
const overlayTodoProjectFormSubmitButton = document.querySelector('.overlay-todo-project-form-submit-button');
const inputBox = document.createElement('input');
const todoArray = [];
const projectArray = [];
let todayArray = [];
let thisWeekArray = [];
let todoProjectProperty = 'INBOX';
let inboxButtonClicked = false;
let lastProjectClicked = 'inbox';
let toDoEditClicked = false;
let hoverInfoBoxDescriptionCancelValue = '';
let hoverInfoBoxDueDateCancelValue = '';
let hoverInfoBoxPriorityCancelValue = '';
let hoverInfoBoxNotesCancelValue = '';

function toDoProjectItem(title, description, dueDate, priority, notes, project, projectChanged) {
    // Constructor
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.project = project;
    this.projectChanged = projectChanged;
}

projectOverlay.addEventListener('click', () => {
    projectOverlay.style.display = 'none';
});

todoProjectOverlay.addEventListener('click', () => {
    todoProjectOverlay.style.display = 'none';
});

createProjectButton.addEventListener('click', () => {
    projectOverlay.style.display = 'block';
});

createTodoProjectButton.addEventListener('click', () => {
    todoProjectOverlay.style.display = 'block';
});

overlayFormContainer.forEach((form) => {
    form.addEventListener('click', (e) => {
        e.stopPropagation();
    })
});

overlayProjectFormSubmitButton.addEventListener('click', (e) => {
    if (projectTitleInput.value.length == 0 || projectDescriptionInput.value.length == 0 || projectDueDateInput.value.length == 0 || projectPriorityInput.value.length == 0) {
        e.preventDefault();
        alert('Please fill in the required fields!')
    } else {
        projectOverlay.style.display = 'none';
        displayController.projectUpdate();
        ProjectMethods.addProjectToArray();
    }
    overlayForm.forEach(form => {
        form.reset();
    });
});

overlayTodoProjectFormSubmitButton.addEventListener('click', (e) => {
    if (titleInput.value.length == 0) {
        e.preventDefault();
        alert('Please fill in the required fields!')
    } else {
        todoProjectOverlay.style.display = 'none';
        displayController.todoProjectUpdate();
        ToDoMethods.addToDoToArray();
        if (lastProjectClicked == 'inbox') {
            displayController.displayTodo
        } else {
            displayController.reRenderTodos(lastProjectClicked);
        }
        overlayForm.forEach(form => {
            form.reset();
        });
    }
});

inboxButton.addEventListener('click', () => {
    // The inbox tab is separate from the other projects, so it gets its own special event listener
    // Changes the title when you click on it to 'INBOX', creates the createTodoProject button, and gives some button logic
    // Displays all todos
    infoTitle.textContent = 'INBOX';
    infoTitle.appendChild(createTodoProjectButton);
    inboxButtonClicked = true;
    lastProjectClicked = 'inbox';
    displayController.todoProjectUpdate();
    displayController.displayTodo();
});

todayButton.addEventListener('click', () => {
    infoTitle.textContent = 'Today';
    displayController.displayTodo();
    displayController.todoProjectUpdate();
    displayController.displayTodayTodos();
});

thisWeekButton.addEventListener('click', () => {
    infoTitle.textContent = 'This Week';
    displayController.displayTodo();
    displayController.todoProjectUpdate();
    displayController.displayThisWeekTodos();
});

const ToDoMethods = (() => {
    // Adds todo to todoArray
    const addToDoToArray = () => {
        titleValue = titleInput.value;
        if (dueDateInput.value.length == 0) {
            dueDateValue = 'No Date';
        } else {
            dueDateValue = dueDateInput.value;
        }
        const newToDo = new toDoProjectItem(titleValue, undefined, dueDateValue, undefined, undefined, 'inbox', false);
        todoArray.push(newToDo);
        displayController.displayTodo();
    };

    const editToDoDueDate = (dueDate) => {
        inputBox.type = 'date';
        dueDate.innerHTML = '';
        dueDate.appendChild(inputBox);
    }

    return {addToDoToArray, editToDoDueDate};
})();

const ProjectMethods = (() => {
    const addProjectToArray = () => {
        // Adds project to projectArray
        titleValue = projectTitleInput.value;
        descriptionValue = projectDescriptionInput.value;
        dueDateValue = projectDueDateInput.value;
        priorityValue = projectPriorityInput.value;
        notesValue = projectNotesInput.value;
        const newProject = new toDoProjectItem(titleValue, descriptionValue, dueDateValue, priorityValue, notesValue, undefined, undefined);
        projectArray.push(newProject);
        displayController.displayProject();
    }
    
    return {addProjectToArray};
})();

const displayController = (() => {
    const displayTodo = () => {
        todayArray = [];
        thisWeekArray = [];
        // Loops through the array of todos and displays each one on the todos grid.
        for (let i = 0; i < todoArray.length; i++) {
            const infoDescription = document.createElement('div');
            const toDoTitle = document.createElement('div');
            const toDoDueDate = document.createElement('div');
            const toDoDueDateGetFirstDayOfWeek = startOfWeek(new Date(), {weekStartsOn: 1});            
            const toDoDueDateGetFullDate = new Date(todoArray[i].dueDate);
            const toDoDueDateGetLastDayOfWeek = lastDayOfWeek(new Date(), {weekStartsOn: 1});
            const deleteTodoButton = new Image();
            deleteTodoButton.src = deleteIcon;
            infoDescription.classList.add('info-description');
            infoDescription.setAttribute('style', 'height: 60px; font-size: 25px; border: 1px solid #05386B; font-family: "Nunito", sans-serif; border-radius: 6px;')
            toDoTitle.classList.add('to-do-title');
            toDoDueDate.classList.add('to-do-due-date');
            deleteTodoButton.classList.add('to-do-delete-button');
            infoDescription.style.display = 'flex';
            defaultInfoDescription.style.display = 'none';
            toDoTitle.textContent = todoArray[i].title;
            toDoDueDate.textContent = todoArray[i].dueDate;

            if (todoArray[i].dueDate == format(endOfDay(new Date()), 'yyyy-MM-dd')) {
                todayArray.push(todoArray[i]);
            }

            if (compareAsc(toDoDueDateGetFullDate, toDoDueDateGetLastDayOfWeek) == -1 && compareAsc(toDoDueDateGetFullDate, toDoDueDateGetFirstDayOfWeek) == 1) {
                thisWeekArray.push(todoArray[i]);
            }

            if (toDoDueDateGetFullDate.getUTCDate() == toDoDueDateGetFirstDayOfWeek.getUTCDate() && toDoDueDateGetFullDate.getUTCMonth() == toDoDueDateGetFirstDayOfWeek.getUTCMonth() && toDoDueDateGetFullDate.getUTCFullYear() == toDoDueDateGetFirstDayOfWeek.getUTCFullYear()) {
                thisWeekArray.push(todoArray[i]);
            }

            toDoDueDate.addEventListener('click', () => {
                if (toDoEditClicked == false) {
                    ToDoMethods.editToDoDueDate(toDoDueDate);
                }
                toDoEditClicked = true;
            })

            toDoDueDate.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoEditClicked = false;
                    toDoDueDate.textContent = inputBox.value;
                    todoArray[i].dueDate = toDoDueDate.textContent;
                    inputBox.value = toDoDueDate.textContent;
                    if (todoArray[i].dueDate == format(endOfDay(new Date()), 'yyyy-MM-dd')) {
                        todayArray.push(todoArray[i]);
                    }
                }
            })

            toDoTitle.addEventListener('click', () => {
                toDoTitle.contentEditable = true;
            })
            toDoTitle.addEventListener('input', () => {
                todoArray[i].title = toDoTitle.textContent;
            })

            toDoTitle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoTitle.contentEditable = false;
                }
            })
            
            if (todoArray[i].projectChanged == false) {
                if (inboxButtonClicked == true) {
                    todoArray[i].project = 'INBOX';
                    inboxButtonClicked = false;
                    todoArray[i].projectChanged = true;
                } else {
                    todoArray[i].project = todoProjectProperty;
                    todoArray[i].projectChanged = true;
                    inboxButtonClicked = false;
                }
            }

            infoDescriptionGrid.appendChild(infoDescription);
            // infoDescription.appendChild(toDoPriority);
            infoDescription.appendChild(toDoTitle);
            infoDescription.appendChild(toDoDueDate);
            infoDescription.appendChild(deleteTodoButton);
            deleteTodoButton.addEventListener('click', () => {
                todoArray.splice(i, 1);
                i = 0;
                todoProjectUpdate();
                displayTodo();
            });
        }
    }

    const displayTodayTodos = () => {
        // Loops through the array of today's todos and displays each one on the todos grid.
        for (let i = 0; i < todayArray.length; i++) {
            const infoDescription = document.createElement('div');
            const toDoTitle = document.createElement('div');
            const toDoDueDate = document.createElement('div');
            const deleteTodoButton = new Image();
            deleteTodoButton.src = deleteIcon;
            infoDescription.classList.add('info-description');
            infoDescription.setAttribute('style', 'height: 60px; font-size: 25px; border: 1px solid #05386B; font-family: "Nunito", sans-serif; border-radius: 6px;')
            toDoTitle.classList.add('to-do-title');
            toDoDueDate.classList.add('to-do-due-date');
            deleteTodoButton.classList.add('to-do-delete-button');
            infoDescription.style.display = 'flex';
            defaultInfoDescription.style.display = 'none';
            toDoTitle.textContent = todayArray[i].title;
            toDoDueDate.textContent = todayArray[i].dueDate;

            toDoDueDate.addEventListener('click', () => {
                if (toDoEditClicked == false) {
                    ToDoMethods.editToDoDueDate(toDoDueDate);
                }
                toDoEditClicked = true;
            })

            toDoDueDate.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoEditClicked = false;
                    toDoDueDate.textContent = inputBox.value;
                    todoArray[i].dueDate = toDoDueDate.textContent;
                    inputBox.value = toDoDueDate.textContent;
                }
            })

            toDoTitle.addEventListener('click', () => {
                toDoTitle.contentEditable = true;
            })
            toDoTitle.addEventListener('input', () => {
                todoArray[i].title = toDoTitle.textContent;
            })

            toDoTitle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoTitle.contentEditable = false;
                }
            })

            infoDescriptionGrid.appendChild(infoDescription);
            infoDescription.appendChild(toDoTitle);
            infoDescription.appendChild(toDoDueDate);
            infoDescription.appendChild(deleteTodoButton);
            deleteTodoButton.addEventListener('click', () => {
                const todoIndex = todoArray.findIndex((todo) => todo === todayArray[i]);
                todoArray.splice(todoIndex, 1);
                infoDescription.parentNode.removeChild(infoDescription);
            });
        }
    }

    const displayThisWeekTodos = () => {
        // Loops through the array of today's todos and displays each one on the todos grid.
        for (let i = 0; i < thisWeekArray.length; i++) {
            const infoDescription = document.createElement('div');
            const toDoTitle = document.createElement('div');
            const toDoDueDate = document.createElement('div');
            const deleteTodoButton = new Image();
            deleteTodoButton.src = deleteIcon;
            infoDescription.classList.add('info-description');
            infoDescription.setAttribute('style', 'height: 60px; font-size: 25px; border: 1px solid #05386B; font-family: "Nunito", sans-serif; border-radius: 6px;')
            toDoTitle.classList.add('to-do-title');
            toDoDueDate.classList.add('to-do-due-date');
            deleteTodoButton.classList.add('to-do-delete-button');
            infoDescription.style.display = 'flex';
            defaultInfoDescription.style.display = 'none';
            toDoTitle.textContent = thisWeekArray[i].title;
            toDoDueDate.textContent = thisWeekArray[i].dueDate;

            toDoDueDate.addEventListener('click', () => {
                if (toDoEditClicked == false) {
                    ToDoMethods.editToDoDueDate(toDoDueDate);
                }
                toDoEditClicked = true;
            })

            toDoDueDate.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoEditClicked = false;
                    toDoDueDate.textContent = inputBox.value;
                    todoArray[i].dueDate = toDoDueDate.textContent;
                    inputBox.value = toDoDueDate.textContent;
                }
            })

            toDoTitle.addEventListener('click', () => {
                toDoTitle.contentEditable = true;
            })
            toDoTitle.addEventListener('input', () => {
                todoArray[i].title = toDoTitle.textContent;
            })

            toDoTitle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoTitle.contentEditable = false;
                }
            })

            infoDescriptionGrid.appendChild(infoDescription);
            infoDescription.appendChild(toDoTitle);
            infoDescription.appendChild(toDoDueDate);
            infoDescription.appendChild(deleteTodoButton);
            deleteTodoButton.addEventListener('click', () => {
                const todoIndex = todoArray.findIndex((todo) => todo === thisWeekArray[i]);
                todoArray.splice(todoIndex, 1);
                infoDescription.parentNode.removeChild(infoDescription);
            });
        }
    }

    const displayProject = () => {
        // Loops through the array of projects and displays each one on the sidebar
        for (let i = 0; i < projectArray.length; i++) {
            const projectTitle = document.createElement('div');
            const hoverInfoBox = document.createElement('div');
            hoverInfoBox.innerHTML = '';
            const hoverInfoTitle = document.createElement('div');
            const hoverInfoDescription = document.createElement('div');
            const hoverInfoDueDate = document.createElement('div');
            const hoverInfoPriority = document.createElement('div');
            const hoverInfoNotes = document.createElement('div');
            const hoverInfoSaveButton = document.createElement('button');
            const hoverInfoCancelButton = document.createElement('button');
            const projectEditButton = new Image();
            projectEditButton.src = projectEditIcon;
            projectEditButton.classList.add('project-edit-button');
            const deleteProjectButton = new Image();
            deleteProjectButton.src = deleteIcon;
            deleteProjectButton.classList.add('project-delete-button');
            hoverInfoBox.classList.add('hover-info-box');
            hoverInfoTitle.classList.add('hover-info-title');
            hoverInfoDescription.classList.add('hover-info-description');
            hoverInfoDueDate.classList.add('hover-info-due-date');
            hoverInfoPriority.classList.add('hover-info-priority');
            hoverInfoNotes.classList.add('hover-info-notes');
            hoverInfoSaveButton.classList.add('hover-info-save-button');
            hoverInfoCancelButton.classList.add('hover-info-cancel-button');
            hoverInfoSaveButton.textContent = 'Save';
            hoverInfoCancelButton.textContent = 'Cancel';
            hoverInfoSaveButton.style.display = 'none';
            hoverInfoCancelButton.style.display = 'none';
            hoverInfoTitle.textContent = 'Title: ' + projectArray[i].title;
            hoverInfoDescription.textContent = 'Description: ' + projectArray[i].description;
            hoverInfoDueDate.textContent = 'Due Date: ' + projectArray[i].dueDate;
            hoverInfoPriority.textContent = 'Priority: ' + projectArray[i].priority;
            if (projectArray[i].priority === 'Low') {
                hoverInfoPriority.style.color = 'green';
            } else if (projectArray[i].priority === 'Medium') {
                hoverInfoPriority.style.color = 'yellow';
            } else if (projectArray[i].priority === 'High') {
                hoverInfoPriority.style.color = 'red';
            }
            hoverInfoNotes.textContent = 'Notes: ' + projectArray[i].notes;

            projectTitle.classList.add('project');
            projectTitle.textContent = projectArray[i].title;
            todoProjectList.appendChild(projectTitle);
            projectTitle.appendChild(hoverInfoBox);
            hoverInfoBox.appendChild(hoverInfoTitle);
            hoverInfoBox.appendChild(hoverInfoDescription);
            hoverInfoBox.appendChild(hoverInfoDueDate);
            hoverInfoBox.appendChild(hoverInfoPriority);
            hoverInfoBox.appendChild(hoverInfoNotes);
            hoverInfoBox.appendChild(hoverInfoSaveButton);
            hoverInfoBox.appendChild(hoverInfoCancelButton);
            projectTitle.appendChild(projectEditButton);
            projectTitle.appendChild(deleteProjectButton);

            projectTitle.addEventListener('click', () => {
                inboxButtonClicked = false;
                // Checks for which project was clicked last in order to rerender when you submit the todoproject form
                lastProjectClicked = i
                todoProjectUpdate();
                todoLoadToSpecificProject(i);
                todoProjectProperty = projectArray[i].title;
                infoTitle.textContent = projectArray[i].title;
                const createTodoProjectButton = document.createElement('button');
                createTodoProjectButton.classList.add('create-todo-project-button');
                createTodoProjectButton.textContent = 'New Todo';
                infoTitle.appendChild(createTodoProjectButton);
                createTodoProjectButton.addEventListener('click', () => {
                    todoProjectOverlay.style.display = 'block';
                });
            });

            projectTitle.addEventListener('mouseenter', () => {
                hoverInfoBox.style.opacity = 1;
                projectTitle.addEventListener('mouseleave', () => {
                    hoverInfoBox.style.opacity = 0;
                });
            });

            hoverInfoBox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            projectEditButton.addEventListener('click', (e) => {
                e.stopPropagation();
                hoverInfoBox.style.opacity = 1;
                hoverInfoBox.style.pointerEvents = 'auto';
                hoverInfoDescription.textContent = projectArray[i].description;
                hoverInfoDueDate.textContent = projectArray[i].dueDate;
                hoverInfoPriority.textContent = projectArray[i].priority;
                hoverInfoNotes.textContent = projectArray[i].notes;
                hoverInfoBoxDescriptionCancelValue = projectArray[i].description;
                hoverInfoBoxDueDateCancelValue = projectArray[i].dueDate;
                hoverInfoBoxPriorityCancelValue = projectArray[i].priority;
                hoverInfoBoxNotesCancelValue = projectArray[i].notes;
                hoverInfoDescription.contentEditable = true;
                hoverInfoDueDate.contentEditable = true;
                hoverInfoPriority.contentEditable = true;
                hoverInfoNotes.contentEditable = true;
                hoverInfoSaveButton.style.display = 'block';
                hoverInfoCancelButton.style.display = 'block';
            });

            hoverInfoDescription.addEventListener('click', () => {
                hoverInfoDescription.textContent = '';
            });

            hoverInfoDueDate.addEventListener('click', () => {
                hoverInfoDueDate.textContent = '';
            });

            hoverInfoPriority.addEventListener('click', () => {
                hoverInfoPriority.textContent = '';
            });

            hoverInfoNotes.addEventListener('click', () => {
                hoverInfoNotes.textContent = '';
            });

            hoverInfoSaveButton.addEventListener('click', () => {
                hoverInfoBox.style.opacity = 0;
                hoverInfoBox.style.pointerEvents = 'none';
                hoverInfoDescription.contentEditable = false;
                hoverInfoDueDate.contentEditable = false;
                hoverInfoPriority.contentEditable = false;
                hoverInfoNotes.contentEditable = false;
                projectArray[i].description = hoverInfoDescription.textContent;
                projectArray[i].dueDate = hoverInfoDueDate.textContent;
                projectArray[i].priority = hoverInfoPriority.textContent;
                projectArray[i].notes = hoverInfoNotes.textContent;
                hoverInfoDescription.textContent = 'Description: ' + projectArray[i].description;
                hoverInfoDueDate.textContent = 'Due Date: ' + projectArray[i].dueDate;
                hoverInfoPriority.textContent = 'Priority: ' + projectArray[i].priority;
                hoverInfoNotes.innerHTML = 'Notes: ' + projectArray[i].notes;
                if (projectArray[i].priority === 'Low') {
                    hoverInfoPriority.style.color = 'green';
                } else if (projectArray[i].priority === 'Medium') {
                    hoverInfoPriority.style.color = 'yellow';
                } else if (projectArray[i].priority === 'High') {
                    hoverInfoPriority.style.color = 'red';
                }
                hoverInfoSaveButton.style.display = 'none';
                hoverInfoCancelButton.style.display = 'none';
            });

            hoverInfoCancelButton.addEventListener('click', () => {
                hoverInfoSaveButton.style.display = 'none';
                hoverInfoCancelButton.style.display = 'none';
                hoverInfoBox.style.opacity = 0;
                hoverInfoBox.style.pointerEvents = 'none';
                hoverInfoDescription.contentEditable = false;
                hoverInfoDueDate.contentEditable = false;
                hoverInfoPriority.contentEditable = false;
                hoverInfoNotes.contentEditable = false;
                hoverInfoDescription.textContent = 'Description: ' + hoverInfoBoxDescriptionCancelValue;
                hoverInfoDueDate.textContent = 'Due Date: ' + hoverInfoBoxDueDateCancelValue;
                hoverInfoPriority.textContent = 'Priority: ' + hoverInfoBoxPriorityCancelValue;
                hoverInfoNotes.innerHTML = 'Notes: ' + hoverInfoBoxNotesCancelValue;
            });

            deleteProjectButton.addEventListener('click', (e) => {
                lastProjectClicked = i
                for (let j = 0; j < findSpecificTodos(lastProjectClicked).length; j++) {
                    const findIndexFromProjectToTodoArray = todoArray.findIndex((todo) => todo === displayController.findSpecificTodos(lastProjectClicked)[j]);
                    todoArray.splice(findIndexFromProjectToTodoArray, 1);
                    j = -1;
                }
                const parentInfoTitleText = infoTitle.firstChild.nodeValue;
                const infoTitleOnly = document.createElement('div');
                infoTitleOnly.innerText = parentInfoTitleText.trim();
                if (infoTitleOnly.textContent == 'INBOX') {
                    todoProjectUpdate();
                    displayTodo();
                    inboxButton.click();
                } else if (infoTitleOnly.textContent == projectArray[lastProjectClicked].title) {
                    infoDescriptionGrid.innerHTML = '';
                    inboxButton.click();
                }
                e.stopPropagation();
                projectArray.splice(i, 1);
                i = 0;
                projectUpdate();
                displayProject();
            });
        }
    }

    const projectUpdate = () => {
        // Updates the sidebar display
        todoProjectList.innerHTML = '';
    }

    const todoProjectUpdate = () => {
        // Updates the the grid where all the todos are placed
        infoDescriptionGrid.innerHTML = '';
    }

    const findSpecificTodos = (i) => {
        // Filters out the todos that have the same project property as the project title
        const findTodos = todoArray.filter(todo => todo['project'] === projectArray[i].title);
        return findTodos;
    }

    const reRenderTodos = (i) => {
        // Renders all the todos
        todoProjectUpdate();
        todoLoadToSpecificProject(i);
    }

    const todoLoadToSpecificProject = (i) => {
        // Takes the corresponding array to that specific project, loops through it, and displays it
        const specificProjectArray = findSpecificTodos(i)
        for (let j = 0; j < specificProjectArray.length; j++) {
            const infoDescription = document.createElement('div');
            const toDoTitle = document.createElement('div');
            const toDoDueDate = document.createElement('div');
            const deleteTodoButton = new Image();
            deleteTodoButton.src = deleteIcon;
            deleteTodoButton.classList.add('to-do-delete-button');
            infoDescription.classList.add('info-description');
            infoDescription.setAttribute('style', 'height: 60px; font-size: 25px; border: 1px solid #05386B; font-family: "Nunito", sans-serif; border-radius: 6px;');
            toDoTitle.classList.add('to-do-title');
            toDoDueDate.classList.add('to-do-due-date');
            infoDescription.style.display = 'flex';
            defaultInfoDescription.style.display = 'none';
            toDoTitle.textContent = specificProjectArray[j].title;
            toDoDueDate.textContent = specificProjectArray[j].dueDate;
            infoDescriptionGrid.appendChild(infoDescription);
            infoDescription.appendChild(toDoTitle);
            infoDescription.appendChild(toDoDueDate);
            infoDescription.appendChild(deleteTodoButton);
            toDoDueDate.addEventListener('click', () => {
                if (toDoEditClicked == false) {
                    ToDoMethods.editToDoDueDate(toDoDueDate);
                }
                toDoEditClicked = true;
            })

            toDoDueDate.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoEditClicked = false;
                    toDoDueDate.textContent = inputBox.value;
                    todoArray[i].dueDate = toDoDueDate.textContent;
                    inputBox.value = toDoDueDate.textContent;
                }
            })

            toDoTitle.addEventListener('click', () => {
                toDoTitle.contentEditable = true;
            });

            toDoTitle.addEventListener('input', () => {
                todoArray[i].title = toDoTitle.textContent;
            });

            toDoTitle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    toDoTitle.contentEditable = false;
                }
            });

            deleteTodoButton.addEventListener('click', () => {
                todoArray.splice(j, 1);
                todoProjectUpdate();
                displayTodo();
            });
        }
    }

    return {displayTodo, displayTodayTodos, displayThisWeekTodos, displayProject, projectUpdate, todoProjectUpdate, findSpecificTodos, reRenderTodos, todoLoadToSpecificProject};
})();
