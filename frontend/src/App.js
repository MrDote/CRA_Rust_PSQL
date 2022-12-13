import React from "react";
import "./App.css";
import { useState, useEffect } from "react";


const URL = 'http://localhost:3005/tasks';

function Todo({ text, index, handleDelete }) {
    return (
        <div className="todo">
            <span>{text}</span>
            <div>
                <button onClick={() => handleDelete(index)}>X</button>
            </div>
        </div>
    );
}

function FormTodo({ isLoading }) {
    const [value, setValue] = useState("");

    const handleSubmit = async () => {
        const doc = {
            item: value
        };

        await fetch(URL, {
            method: "POST",
            body: JSON.stringify(doc),
            headers: { 'Content-type' : 'application/json' }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input className = 'input' autofocus="autofocus" required type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new items"></input>
            { isLoading ? <button disabled>Sending data..</button> : <button>Add item</button> }
        </form>
    );
}

function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(URL);
                const tasks = await res.json();
                setTodos(tasks);
                setIsLoading(false);
            } catch (e) {
                console.log("ERROR " + e);
            }
        })();
    }, [])

    const handleDelete = async (index) => {
        await fetch(URL + "/" + index, {
            method: "DELETE"
        })
        window.location.reload(true);
    }

    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Todo List</h1>
                <FormTodo
                    isLoading={isLoading}
                />
                {isLoading && <div>Loading...</div>}
                <div>
                    {todos.map((todo) => (
                        <Todo
                            text={todo.item}
                            key={todo.id}
                            index={todo.id}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;