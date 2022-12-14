import React, { useState } from "react";

export default function FormTodo({ isLoading , updateTodos }) {
    const [value, setValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const doc = {
                item: value
            };
            const response = await fetch('http://localhost:8000/addtask', {
                method: "POST",
                body: JSON.stringify(doc)
            });
            // For res returning all items
            // const tasks = await response.json();
            // updateTodos(tasks);
            // For res returning added item
            const task = await response.json();
            updateTodos(prev => [...prev, task]);
            setValue('');

        } catch (err) {
            console.error(err.message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                className=''
                autoFocus="autofocus" 
                required 
                type="text" 
                value={value} 
                onChange={e => setValue(e.target.value)} 
                placeholder="Add new items"
            ></input>
            {isLoading ? <button disabled>Sending data..</button> : <button>Add item</button>}
        </form>
    );
}