import React from "react";
import "./App.css";
import { useState, useEffect } from "react";


function Todo({ todo, index, removeTodo }) {
    return (
        <div className="todo">
            <span>{todo}</span>
            <div>
                <button onClick={() => removeTodo(index)}>X</button>
            </div>
        </div>
    );
}

function FormTodo({ addTodo }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    };

    return (
        <>
            <form action="#" onSubmit={handleSubmit}>
                <input className = 'input' value={value} onChange={e => setValue(e.target.value)} placeholder="Add new shit"></input>
                <button>Add item</button>
            </form>
        </>
    );
}

function App() {
    const [todos, setTodos] = useState(["This is a sampe todo"]);

    const addTodo = text => {
        const newTodos = [...todos, text];
        setTodos(newTodos);
    };

    const removeTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    useEffect(() => {
        async function fetchTodos() {
            const fullResponse = await fetch('http://localhost:3000/readtasks', );
            const responseJson = await fullResponse.json();
            setTodos(responseJson.data);
        }

        fetchTodos();
    }, [])

    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Todo List</h1>
                <FormTodo addTodo={addTodo} />
                <ol>
                    {todos.map((todo, index) => (
                        <Todo
                        key={index}
                        index={index}
                        todo={todo}
                        removeTodo={removeTodo}>
                        </Todo>                
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default App;