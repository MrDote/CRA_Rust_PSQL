import React, { useState } from "react";

export default function FormTodo({ isLoading }) {
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
                // headers: {
                //     "Content-Type": "application/json",
                // }
            });

            window.location = "/";
        } catch (err) {
            console.error(err.message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                className='input'
                autoFocus="autofocus" 
                required type="text" 
                value={value} 
                onChange={e => setValue(e.target.value)} 
                placeholder="Add new items"
            ></input>
            {isLoading ? <button disabled>Sending data..</button> : <button>Add item</button>}
        </form>
    );
}