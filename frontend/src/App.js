import React from "react";
import { useState, useEffect } from "react";


// const URL = 'http://localhost:3005/tasks';
const URL = 'http://localhost:8000/';


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

        // await fetch(URL, {
        await fetch(URL + 'addtask', {
            method: "POST",
            body: JSON.stringify(doc),
            headers: { 
                accept: 'application/json',
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input className = 'input' autoFocus="autofocus" required type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new items"></input>
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
                const res = await fetch(URL + "readtasks", {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    }
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

        // await fetch(URL + "/" + index, {
        //     method: "DELETE"
        // })
        await fetch(URL + "deletetask", {
            method: "POST",
            body: JSON.stringify(doc),
            headers: {
                accept: 'application/json',
            }
        });


        // const handleSubmit = async () => {
        //     const doc = {
        //         item: value
        //     };
    
        //     await fetch(URL + 'addtask', {
        //         method: "POST",
        //         body: JSON.stringify(doc),
        //         headers: { 
        //             accept: 'application/json',
        //         }
        //     });
        // };

        const res = await fetch(URL + "readtasks", {
            method: 'GET',
            headers: {
            accept: 'application/json',
            }
        });
        const tasks = await res.json();
        console.log(tasks);
        setTodos(tasks);
        setIsLoading(false);
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
                    {todos.length && todos.map((todo) => (
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