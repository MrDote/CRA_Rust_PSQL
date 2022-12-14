export default function Todo({ text, index, handleDelete }) {
    return (
        <div className="todo">
            <span>{text}</span>
            <div>
                <button onClick={() => handleDelete(index)}>X</button>
            </div>
        </div>
    );
}