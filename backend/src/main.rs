#[macro_use] extern crate rocket;
    
use rocket::{serde::{Deserialize, json::Json, Serialize}, response::{Responder, self}, http::{Status}, Request};
use rocket_db_pools::{Database, Connection};
use rocket::http::Header;
use rocket::{Request as Something, Response};
use rocket::fairing::{Fairing, Info, Kind};


#[derive(Deserialize, Serialize, sqlx::FromRow)]
#[serde(crate = "rocket::serde")]
struct Task {
    id: i64,
    item: String
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct TaskItem<'r> {
    item: &'r str
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct TaskId {
    id: i64
}

#[derive(Database)]
#[database("todo")]
struct TodoDatabase(sqlx::PgPool);
pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _request: &'r Something<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "DELETE, POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}
struct DatabaseError(rocket_db_pools::sqlx::Error);

impl<'r> Responder<'r, 'r> for DatabaseError {
    fn respond_to(self, _request: &Request) -> response::Result<'r> {
        Err(Status::InternalServerError)
    }
}

impl From<rocket_db_pools::sqlx::Error> for DatabaseError {
    fn from(error: rocket_db_pools::sqlx::Error) -> Self {
        DatabaseError(error)
    }
}

// For res to return added item
#[post("/addtask", data="<task>")]
async fn add_task(task: Json<TaskItem<'_>>, mut db: Connection<TodoDatabase>) -> Result<Json<Task>, DatabaseError> {
    println!("You got here");

    let added_task = sqlx::query_as::<_, Task>("INSERT INTO tasks (item) VALUES ($1) RETURNING *")
        .bind(task.item)
        .fetch_one(&mut *db)
        .await?;

    println!("You got almost to the end");
    
    Ok(Json(added_task))
}

// For res to return all items
// #[post("/addtask", data="<task>")]
// async fn add_task(task: Json<TaskItem<'_>>, mut db: Connection<TodoDatabase>) -> Result<Json<Vec<Task>>, DatabaseError> {
//     println!("You got here");

//     sqlx::query_as::<_, Task>("INSERT INTO tasks (item) VALUES ($1)")
//         .bind(task.item)
//         .fetch_optional(&mut *db)
//         .await?;

//     println!("You got almost to the end");

//     let all_tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks")
//         .fetch_all(&mut *db)
//         .await?;
    
//     Ok(Json(all_tasks))
// }

#[get("/readtasks")]
async fn read_tasks(mut db: Connection<TodoDatabase>) -> Result<Json<Vec<Task>>, DatabaseError> {
    let all_tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks")
        .fetch_all(&mut *db)
        .await?;

    // println!("{}", all_tasks[0].id);
    Ok(Json(all_tasks))
}

#[put("/edittask", data="<task_update>")]
async fn edit_task(task_update: Json<Task>, mut db: Connection<TodoDatabase>) -> Result<Json<Task>, DatabaseError> {
    let updated_task = sqlx::query_as::<_, Task>("UPDATE tasks SET item = $1 WHERE id = $2 RETURNING *")
        .bind(&task_update.item)
        .bind(task_update.id)
        .fetch_one(&mut *db)
        .await?;

    Ok(Json(updated_task))
}

#[delete("/deletetask", data="<task_id>")]
async fn delete_task(task_id: Json<TaskId>, mut db: Connection<TodoDatabase>) -> Result<Json<Task>, DatabaseError> {
    let deleted_task = sqlx::query_as::<_, Task>("DELETE FROM tasks WHERE id = $1 RETURNING *")
        .bind(task_id.id)
        .fetch_one(&mut *db)
        .await?;

    Ok(Json(deleted_task))
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(TodoDatabase::init())
        .attach(CORS)
        .mount("/", routes![index, add_task, read_tasks, edit_task, delete_task])
}