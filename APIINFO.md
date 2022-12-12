Database ID's are 1 indexed

POST "\addtask"
Creates a new task entry at end of the database
Will return a Json file containing the ID + what the entry added was

Input -> Json:
    {
        "item": "string"
    }
Return -> Json:
    {
        "id": i64,
        "item": "string"
    }


GET "\readtask"
Returns all tasks in the database + associated ID's

Input -> None
Return -> Json{Array[Json]}:
    {
        "Tasks": [
            {
                "id": i64,
                "item": "string"
            },
            ...
        ]
    }

PUT "\edittask"
Edits one of the entries in the database
Will return the task ID + what it was editted too

Input -> Json:
    {
        "id": i64,
        "item": "string"
    }
Output -> Json:
    {
        "id": i64,
        "item": "string"
    }

DELETE "\deletetask"
Deletes the task at requested ID
Will return the task ID + what the deleted entry was

Input -> Json:
    {
        "id": i64
    }
Output -> Json:
    {
        "id": i64,
        "item": "string"
    }