CREATE TABLE users (
	"id" serial primary key,
	"address" VARCHAR(50),
	"balance" integer default 0 not null,
	"date_joined" timestamp default current_timestamp not null,
	"description" VARCHAR(50),
	"email" VARCHAR(50) NOT NULL,
	"image" TEXT,
	"is_active"  boolean default true not null,
	"is_staff"  boolean default false not null,
	"last_login" timestamp default current_timestamp not null,
	"is_superuser"  boolean default false not null,
	"last_name" VARCHAR(50),
	"password" VARCHAR(50) NOT NULL,
	"phone_number" VARCHAR(50),
	"time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null,
	"username" VARCHAR(50) NOT NULL,

     UNIQUE("email"),
     UNIQUE("password"),
    "position" integer default 1 not null,
    "rooms" TEXT[] NOT NULL default "{}"
);
CREATE TABLE  messages (
  "id" SERIAL PRIMARY KEY,
  "room" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "time" TEXT NOT NULL
);
CREATE TABLE "verify"(
    "id" serial primary key,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "code" integer,
     UNIQUE("email"),
     UNIQUE("password"),
    "position" integer default 1 not null
);

 CREATE TABLE registerCourse( 
    "id" serial primary key,
    "course" integer  NOT NULL,
    "total_mark" integer default 0 NOT NULL,
    "propose_time" timestamp default current_timestamp not null,
    "completed_themes" VARCHAR(50) default 0% NOT NULL,
    "rating" integer default 4  NOT NULL,
    "users" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null   
 )
CREATE TABLE course (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "description" VARCHAR (50) NOT NULL,
    "price" integer NOT NULL,
    "planned_time" integer NOT NULL,
    "course_type" integer NOT NULL,
    "author" integer NOT NULL,
    "image" TEXT,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE cours_types(
    "id" serial primary key,
    "name" VARCHAR(50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE course_theme_task  (
    "id" serial primary key,
    "content" VARCHAR (50) NOT NULL,
    "course_theme" integer NOT NULL,
    "image" TEXT,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE course_theme_task_student(
    "id" serial primary key,
    "content" VARCHAR (50) NOT NULL,
    "course_theme" integer NOT NULL,
    "image" TEXT,
    "feedback"  TEXT,
    "mark" integer,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE  course_theme_comment (
    "id" serial primary key,
    "theme" integer NOT NULL,
    "image" TEXT,
    "text" VARCHAR (50) NOT NULL,
    "subcomment" integer,
    "user_id" VARCHAR(50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
) 
CREATE TABLE course_data_theme (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "content" VARCHAR (50) NOT NULL,
    "image" TEXT,
    "video" VARCHAR (50),
    "extra_data" VARCHAR (50) NOT NULL,
    "category" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
 )
CREATE TABLE course_data_category(
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "course" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)

CREATE TABLE base_theme(
 "id" serial primary key,
 "name" VARCHAR (50) NOT NULL,
 "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null,
)
CREATE TABLE knowladge (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "description" VARCHAR (50) NOT NULL,
    "image"  TEXT,
    "link" VARCHAR NOT NULL,
    "base_theme" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null,
);


CREATE TABLE help_category(
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "image" TEXT,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null,
);

CREATE TABLE help(
    "id" serial primary key,
    "title" VARCHAR (50),
    "description" TEXT NOT NULL,
    "image" TEXT,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null,
);

CREATE TABLE follow(
    "id" serial primary key,
    "topuser" integer NOT NULL,
    "minuser" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)

CREATE TABLE call_me(
 "id" serial primary key,
 "fullname" VARCHAR(120) NOT NULL,
 "email" VARCHAR(50),
 "message" TEXT,
 "purchase" TEXT,
 "read" boolean default false not null,
 "time_create" timestamp default current_timestamp not null
)

-- group
CREATE TABLE education(
    "id" serial PRIMARY KEY,
    "education_name" varchar(255),
    "description" text,
    "start_date" DATE,
    "end_date" DATE,
    "created_date" timestamp default current_timestamp not null
);
CREATE TABLE schedule(
    "id" SERIAL PRIMARY KEY,
    "lesson_name" VARCHAR(255) NOT NULL,
    "education_id" INT NOT NULL,
    "start_time" time,
    "day" date not null,
    "end_time" time,
    "teacher_id" integer not null
);

CREATE TABLE group_student(
  "id" serial primary key,
  "student_id" integer not NULL,
  "education_id" integer NOT NULL,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);   
CREATE TABLE attendance_lesson(
  "id" serial primary key,
  "lesson_id" integer not NULL,
  "group_id" integer NOT NULL,
  "mark" integer,
  "came" boolean default false NOT null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);   
 
--test
CREATE TABLE test(
    "id" SERIAL PRIMARY KEY,
    "education_id" INT NOT NULL,
    "start_time" time,
    "day" date not null,
    "deadline" text not null,  
    "end_time" time,
    "level_start" text,
    "level_end" text,
    "teacher_id" integer not null
);

CREATE TABLE attendance_test(
  "id" serial primary key,
  "test_id" integer not NULL,
  "group_id" integer NOT NULL,
  "mark" integer,
  "came" boolean default false NOT null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);   
CREATE TABLE quations(
    "id" serial primary key, 
    "question" TEXT NOT NULL,
    "variant1" varchar(100) not null,
    "variant2" varchar(100) not null,
    "variant3" varchar(100) not null,
    "variant4" varchar(100) not null,
    "answer" integer NOT null,
    "image" TEXT,
    "test_id" integer NOT null,
    "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
)



