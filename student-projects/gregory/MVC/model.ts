type Todo = {
    id: string,
    status: "Pending" | "Completed",
    createdAt: Date,
    content: string,
};



// const storedData = localStorage.getItem(key);
// return storedData ? new Map<K, V>(JSON.parse(storedData)) : new Map<K, V>();

const usersStorageKey = "users";
const currentUserStorageKey = "currUser";
const storedUsers = JSON.parse(localStorage.getItem(usersStorageKey) || "[]"); // Ensure it's at least an empty array
const users = new Map<string,string>(Array.isArray(storedUsers) ? storedUsers : []) // Ensure it's a valid Map
// const users = new Map<string,string>(JSON.parse(localStorage.getItem(usersStorageKey))) ?? new Map<string,string>();

const currentUser = sessionStorage.getItem(currentUserStorageKey) ?? "";
let todosStorageKey = `${currentUser}_todos`;
let todos: Todo[] = JSON.parse(localStorage.getItem(todosStorageKey) ?? "[]")
.map((exp: any) => ({ ...exp, createdAt: new Date(exp.createdAt) }));

let onTodosUpdateCallbacks: (() => void)[] = [];
onTodosUpdateCallbacks.push(newestFirst);

export function getPassword(username : string) : string {

    const password = users.get(username);
    if (password) {
        return password;        
    }else{
        return "";
    } 
}

export function setCurrentUser(username: string){
    sessionStorage.setItem(currentUserStorageKey,username);
}

export function getCurrentUser():string {
    return sessionStorage.getItem(currentUserStorageKey) ?? "";
}

// function checkPassword(username:string, password : string) : boolean{
//     return (users.get(username)===password);
// }

export function addUser(username:string, password : string){
    if (users.has(username)){
        throw new Error(`User with Username: ${username} already exists`);        
    }
    users.set(username,password);
    console.log(users);
    const usersArray = Array.from(users.entries());
    localStorage.setItem(usersStorageKey, JSON.stringify(usersArray));
}


export function getTodos(showCompleted : boolean, showPending : boolean): Todo[] {

    if (!showCompleted){
        return todos.filter(todos => todos.status === "Pending");
    }
    if (!showPending){
        return todos.filter(todos => todos.status === "Completed");
    }
    return todos;
    // .toSorted((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
}

export function deleteCompletedTasks(){
    todos = todos.filter(todos => todos.status === "Pending");
    localStorage.setItem(todosStorageKey, JSON.stringify(todos));
    callOnTodosUpdateCallbacks();
}

export function newestFirst(){
    todos = todos.toSorted((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    console.log(todos);
}

export function pedningFirst(){
    // todos.toSorted((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    todos = todos.toSorted((a, b) => b.status.length- a.status.length);
    console.log(todos);
}

export function completedFirst(){
    // todos.toSorted((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    todos = todos.toSorted((a, b) => a.status.length- b.status.length);
    console.log(todos);
}

export function addTodo(todo: Todo) {
    if (todos.some((t) => t.id === todo.id)) {
        throw new Error(`Todo with id ${todo.id} already exists`);
    }

    todos.push(todo);
    localStorage.setItem(todosStorageKey, JSON.stringify(todos));
    callOnTodosUpdateCallbacks();
}

export function toggleTodo(todoId: string) {
    const todo = todos.find((t) => t.id === todoId);

    if (!todo) {
        throw new Error(`Todo with id ${todoId} not found`);
    }

    todo.status = todo.status === "Completed" ? "Pending" : "Completed";
    localStorage.setItem(todosStorageKey, JSON.stringify(todos));
    callOnTodosUpdateCallbacks();
}


export function onTodosUpdate(callback: () => void) {
    onTodosUpdateCallbacks.push(callback);
    console.log(onTodosUpdateCallbacks);
}

function callOnTodosUpdateCallbacks() {
    onTodosUpdateCallbacks.forEach((callback) => callback());
}
