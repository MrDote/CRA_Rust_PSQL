#[macro_use]
extern crate rocket;
use rocket::serde::{json::Json, Deserialize, Serialize};
use std::{
    fs::OpenOptions,
    io::{BufRead, BufReader, Write},
};

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct Task<'r> {
    item: &'r str,
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct TaskUpdate<'r> {
    id: u8,
    item: &'r str,
}

#[post("/addtask", data = "<task>")]
fn add_task(task: Json<Task<'_>>) -> &'static str {
    let mut tasks = OpenOptions::new()
        .read(true)
        .append(true)
        .create(true)
        .open("tasks.txt")
        .expect("didn't open well");

    let reader = BufReader::new(&tasks);
    let id = reader.lines().count();
    let task_item_string = format!("{},{}\n", id, task.item);
    let task_item_bytes = task_item_string.as_bytes();
    tasks
        .write(task_item_bytes)
        .expect("Can't write to file lad");
    "Task added aight"
}

#[get("/readtask")]
fn read_task() -> Json<Vec<String>> {
    let tasks = OpenOptions::new()
        .read(true)
        .append(true)
        .create(true)
        .open("tasks.txt")
        .expect("didn't read right lad");
    let reader = BufReader::new(tasks);
    Json(
        reader
            .lines()
            .map(|line| {
                let line_string: String = line.expect("Canny read that line laddy");
                let line_pieces = line_string.split(",").collect::<Vec<&str>>();
                line_pieces[1].to_string()
            })
            .collect(),
    )
}

#[put("/edittask", data = "<task_update>")]
fn edit_task(task_update: Json<TaskUpdate<'_>>) -> &'static str {
    let tasks = OpenOptions::new()
        .read(true)
        .append(true)
        .create(true)
        .open("tasks.txt")
        .expect("couldn't open tasks lad");

    let mut temp = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open("temp.txt")
        .expect("couldn't open temp lad");

    let reader = BufReader::new(tasks);

    for line in reader.lines() {
        let line_string = line.expect("couldn't read that line lad");
        let line_pieces = line_string.split(",").collect::<Vec<&str>>();

        if line_pieces[0]
            .parse::<u8>()
            .expect("can't parse that ID bozo")
            == task_update.id
        {
            let task_items: [&str; 2] = [line_pieces[0], task_update.item];
            let task = format!("{}\n", task_items.join(", "));
            temp.write(task.as_bytes())
                .expect("Couldn't upddate this entry fool");
        } else {
            let task = format!("{}\n", line_string);
            temp.write(task.as_bytes())
                .expect("somwthing is wrong but not sure what");
        }
    }

    std::fs::remove_file("tasks.txt").expect("It no let you delete");
    std::fs::rename("temp.txt", "tasks.txt").expect("Couldn't rename it brosky");
    "Task was updated, dw lad u good"
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct TaskId {
    id: u8,
}

#[delete("/deletetask", data = "<task_id>")]
fn delete_task(task_id: Json<TaskId>) -> &'static str {
    let tasks = OpenOptions::new()
        .read(true)
        .append(true)
        .create(true)
        .open("tasks.txt")
        .expect("unable to access tasks.txt");
    let mut temp = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open("temp.txt")
        .expect("unable to access temp.txt");

    let reader = BufReader::new(tasks);

    for line in reader.lines() {
        let line_string: String = line.expect("could not read line");
        let line_pieces: Vec<&str> = line_string.split(",").collect();

        if line_pieces[0]
            .parse::<u8>()
            .expect("unable to parse id as u8")
            != task_id.id
        {
            let task = format!("{}\n", line_string);
            temp.write(task.as_bytes())
                .expect("could not write to temp file");
        }
    }

    std::fs::remove_file("tasks.txt").expect("unable to remove tasks.txt");
    std::fs::rename("temp.txt", "tasks.txt").expect("unable to rename temp.txt");
    "Task deleted succesfully"
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount(
        "/",
        routes![index, add_task, read_task, edit_task, delete_task],
    )
}
