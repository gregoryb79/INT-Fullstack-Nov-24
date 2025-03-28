import { onAddTodoSubmit, onToggleTodo, onRegisterFormSubmit, onLoginFormSubmit } from "./controller.js";
import { getTodos, onTodosUpdate, pedningFirst, completedFirst, newestFirst, 
        deleteCompletedTasks, getCurrentUser } from "./model.js";


export function checkUser(title : HTMLHeadingElement){
    const currentUser = getCurrentUser();
    if (currentUser === ""){
        window.location.href = "./login.html";
    }else{
        title.textContent = `${currentUser}'s ToDo List`;
    } 
}
export function init(addTodoForm: HTMLFormElement, todoList: HTMLUListElement,
                     sortAndDisplay : HTMLButtonElement, deleteCompleted : HTMLButtonElement) {

    addTodoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(addTodoForm, e.submitter);

        try {
            onAddTodoSubmit(formData);
            addTodoForm.reset();
        } catch (error) {
            console.error(error);
            displayToast(error);
        }
    });

    todoList.addEventListener("click", function (e) {
        const todoId = (e.target as HTMLElement).dataset.id;

        if (!todoId) {
            return;
        }

        try {
            onToggleTodo(todoId);
        } catch (error) {
            console.error(error);
            displayToast(addTodoForm,error);
        }
    });

    let showCompleted = true;
    let showPending = true;
    let buttonStatus = 0;  
    renderTodos();  

    sortAndDisplay.addEventListener("click", function(e) {
        console.log(`Button Status is: ${buttonStatus}`);
        switch(buttonStatus){
            case 1:
                console.log("Hide Pending is pressed");                
                showPending = false; 
                showCompleted = true;               
                break;
            case 2:
                console.log("Pending on top is pressed");                
                console.log("call pending first");
                pedningFirst();
                showCompleted = true;
                showPending = true;
                break;
            case 3:
                console.log("Completed on top is pressed");                
                console.log("call completed first");
                completedFirst();
                showCompleted = true;
                showPending = true;
                break;
            case 4:
                console.log("Newest On Top is pressed");               
                console.log("call newest first");
                newestFirst();
                showCompleted = true;
                showPending = true;
                break;
            default:
                console.log("Hide Completed is pressed");
                showCompleted = false;
                showPending = true;
        }
        
        renderTodos();              

        buttonStatus +=1;
        buttonStatus = buttonStatus > 4 ? 0 : buttonStatus;

        switch(buttonStatus){
            case 1:
                sortAndDisplay.textContent = "Hide Pending";                
                break;
            case 2:
                sortAndDisplay.textContent = "Pending On Top";
                break;
            case 3:
                sortAndDisplay.textContent = "Completed On Top";
                break;
            case 4:
                sortAndDisplay.textContent = "Newest On Top";
                break;
            default:
                sortAndDisplay.textContent = "Hide Completed";
        }
    });

    deleteCompleted.addEventListener("click", function(e) {
        const result = confirm(`This will permanently delete all completed tasks.\n
                OK to confirm, CANCEL to abort;`);
        if (result) {
            deleteCompletedTasks();
        }
    });



    onTodosUpdate(renderTodos);    

    function renderTodos() {

        const todos = getTodos(showCompleted,showPending);
        if (todos.length === 0){
            const li = document.createElement("li");
            li.textContent = "No todos yet";
            todoList.append(li);
            return
        }
        
        todoList.innerHTML = "";

        for (const todo of todos) {
            const li = document.createElement("li");

            li.textContent = todo.content;
            li.dataset.id = todo.id;
            
            if (todo.status === "Completed") {
                li.classList.add("completed");
            }

            todoList.append(li);
        }
    }   
}

function displayToast(container: HTMLElement, message: string){
           
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000); // Auto-hide after 3s
}

export function register(registerForm: HTMLFormElement){

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm, e.submitter) as any;
        
        try {
            onRegisterFormSubmit(formData);
            registerForm.reset();
             window.location.href = "./login.html"
        } catch (error) {
            console.error(error);
            displayToast(registerForm, error);
        }
    });

}

export function login(loginForm: HTMLFormElement){

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let isLoginSucsessful = false;         
        const formData = new FormData(loginForm, e.submitter) as any;
        
        try {
            isLoginSucsessful = onLoginFormSubmit(formData);
            loginForm.reset();
        } catch (error) {
            console.error(error);
            console.log("show toast");
            displayToast(loginForm, error);
        } 

        if (isLoginSucsessful) {
            window.location.href = "./index.html" 
        }

    });

}
