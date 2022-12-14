import React, { useState, useEffect } from "react";
import FormTodo from "./FormTodo.jsx";
import Todo from './Todo.jsx';


// const URL = 'http://localhost:3005/tasks';
const URL = 'http://localhost:8000/';


function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(URL + "readtasks", {
                    method: 'GET'
                });
                // const res = await fetch(URL);
                const tasks = await res.json();
                console.log(tasks.length);
                setTodos(tasks);
                setIsLoading(false);

            } catch (e) {
                console.log("ERROR " + e);
            }
        })();
    }, []);

    const handleDelete = async (index) => {
        const doc = {
            id : index
        };

        const response = await fetch(URL + "deletetask", {
            method: "POST",
            body: JSON.stringify(doc)
        });
        const task = await response.json();
        updateTodos((prev) => prev.filter((item) => item.id !== task.id));
    }

    const updateTodos = (items) => {
        setTodos(items)
    }

    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Todo List</h1>
                <FormTodo
                    isLoading={isLoading}
                    updateTodos={updateTodos}
                />
                {isLoading && <div>Loading...</div>}
                <div>
                    {todos.map((todo) => (
                        todo.id !== 0 ? 
                        <Todo
                            text={todo.item}
                            key={todo.id}
                            index={todo.id}
                            handleDelete={handleDelete}
                        /> 
                        : 
                        <p key='1'>{todo.item}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;