import React, { useState, useEffect } from "react";
import FormTodo from "./FormTodo.jsx";
import Todo from './Todo.jsx';


const URL = 'http://localhost:8000/';


function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(URL + "readtasks");
                const tasks = await res.json();
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
            method: "DELETE",
            body: JSON.stringify(doc)
        });
        const task = await response.json();
        updateTodos((prev) => prev.filter((item) => item.id !== task.id));
    }

    const updateTodos = (items) => {
        setTodos(items)
    }

    return (
        <div className="">
            <div className="">
                <h1 className="">Todo List</h1>
                <FormTodo
                    isLoading={isLoading}
                    updateTodos={updateTodos}
                />
                {isLoading && <div>Loading...</div>}
                { todos.length === 0 ?
                <p>No items in list</p>
                :
                <div>
                    {todos.map((todo) =>
                        <Todo
                            text={todo.item}
                            key={todo.id}
                            index={todo.id}
                            handleDelete={handleDelete}
                        /> 
                    )}
                </div>
                }
            </div>
        </div>
    );
}

export default App;