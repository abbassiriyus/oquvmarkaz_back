create table users (
	"id" serial primary key,
	"address" VARCHAR(50),
	"balance" integer default 0 not null,
	"date_joined" timestamp default current_timestamp not null,
	"description" VARCHAR(50),
	"email" VARCHAR(50) NOT NULL,
	"image" VARCHAR(50),
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
    "position" integer default 1 not null
);

CREATE TABLE "verify"(
    "id" serial primary key,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "code" integer,
    "position" integer default 1 not null
);

 create table registerCourse( 
    "id" serial primary key,
    "course" integer  NOT NULL,
    "total_mark" integer  NOT NULL,
    "propose_time" timestamp default current_timestamp not null,
    "completed_themes" VARCHAR (50) NOT NULL,
    "rating" integer  NOT NULL,
    "users" VARCHAR (50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null   
 )
create table course (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "description" VARCHAR (50) NOT NULL,
    "price" integer NOT NULL,
    "planned_time" integer NOT NULL,
    "course_type" integer NOT NULL,
    "author" VARCHAR(50) NOT NULL,
    "image" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
create table cours_types(
    "id" serial primary key,
    "name" VARCHAR(50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
create table course_theme_task  (
    "content" VARCHAR (50) NOT NULL,
    "course_theme" integer NOT NULL,
    "image" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
create table  course_theme_comment (
    "theme" integer NOT NULL,
    "image" VARCHAR (50),
    "text" VARCHAR (50) NOT NULL,
    "subcomment" integer NOT NULL,
    "id"serial primary key,
    "user" VARCHAR (50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
) 
 create table course_data_theme (
    "name" VARCHAR (50) NOT NULL,
    "content" VARCHAR (50) NOT NULL,
    "image" VARCHAR (50),
    "video" VARCHAR (50),
    "links" VARCHAR (50) NOT NULL,
    "extra_data" VARCHAR (50)NOT NULL,
    "subcategory" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
 )
create table course_data_sub_category(
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "category" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
create table  course_data_category(
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "course" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)



ALTER TABLE users ADD CONSTRAINT uq_passport UNIQUE ( "password" , "email", "username");
ALTER TABLE users ADD CONSTRAINT  UNIQUE("password");
