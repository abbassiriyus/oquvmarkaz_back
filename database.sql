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
    "gender" CHAR(1) check("gender" in ('F','M')),
    "verify" VARCHAR(50) default NULL,
     UNIQUE("email"),
     UNIQUE("password"),
    "position" integer default 1 not null,
    "rooms" TEXT[] NOT NULL default "{}"
);
CREATE TABLE messages (
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
    "propose_time" timestamp default current_timestamp NOT NULL,
    "completed_themes" VARCHAR(50) default 0% NOT NULL,
    "rating" integer default 4  NOT NULL,
    "users" integer NOT NULL,
    "finishing" boolean default false NOT NULL,
     UNIQUE ("users", "course"),
    "time_create" timestamp default current_timestamp NOT NULL,
	"time_update" timestamp default current_timestamp NOT NULL   
 )
CREATE TABLE course (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "description" VARCHAR (50) NOT NULL,
    "price" integer NOT NULL,
    "homiy_id" integer,
    "planned_time" integer NOT NULL,
    "course_type" integer NOT NULL,
    "author" integer NOT NULL,
    "image" TEXT,
    "sertificat_id" integer not NULL,
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


CREATE TABLE course_data_theme (
    "id" serial primary key,
    "name" VARCHAR (50) NOT NULL,
    "content" TEXT,
    "image" TEXT,
    "video" TEXT,
    "extra_data" VARCHAR(50) NOT NULL,
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
    "link" TEXT,
    "base_theme" integer NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
);
CREATE TABLE notification (
    "id" serial primary key,
    "title" VARCHAR (50),
    "description" VARCHAR (50) NOT NULL,
    "user_id" integer NOT NULL,
    "to_user_id" integer NOT NULL,
    "read" boolean default false not null,
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
     UNIQUE (topuser, minuser),
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)

CREATE TABLE call_me(
 "id" serial primary key,
 "fullname" VARCHAR(120) NOT NULL,
 "email" VARCHAR(50),
 "message" TEXT,
 "city" VARCHAR(120),
 "phone" varchar(30),
 "which_lesson"  varchar(100),
 "purchase" TEXT,
 "read" boolean default false not null,
 "time_create" timestamp default current_timestamp not null
)
  
CREATE TABLE purchase(
   "id" serial primary key,
   "title" TEXT not null, 
   "time_create" timestamp default current_timestamp not null
)


-- group
CREATE TABLE education(
    "id" serial PRIMARY KEY,
    "education_name" varchar(255),
    "description" text,
    "start_date" DATE,
    "sertificat_id" integer not NULL,
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
    "teacher_id" integer not null,
    UNIQUE ("education_id", "start_time","day","end_time","teacher_id")
);

CREATE TABLE group_student(
  "id" serial primary key,
  "student_id" integer not NULL,
  "finishing" boolean default false NOT NULL,
  "education_id" integer NOT NULL,
  UNIQUE("student_id", "education_id"),
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);   
CREATE TABLE attendance_lesson(
  "id" serial primary key,
  "lesson_id" integer not NULL,
  "student_id" integer NOT NULL,
  "mark" integer,
  UNIQUE("student_id", "lesson_id"),
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
  "student_id" integer NOT NULL,
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

CREATE TABLE sertificat(
   "id" serial primary key, 
   "file" TEXT NOT NULL,
   "description" TEXT NOT NULL,
   "type" VARCHAR(50) NOT NULL,
   "director" VARCHAR(70) NOT NULL,
   "mentor" VARCHAR(70) not NULL,
   "time_create" timestamp default current_timestamp not null,
   "time_update" timestamp default current_timestamp not null
)
CREATE TABLE Student_sertificat(
     "id" serial primary key,  
     "file" TEXT NOT NULL, 
     "image" TEXT,
     "title" varchar(50) NOT NULL,
     "description" TEXT,
     "sertificat_id" integer NOT NULL,
     "student_id" integer NOT NULL,
     "time_create" timestamp default current_timestamp not null,
     "time_update" timestamp default current_timestamp not null
)

CREATE TABLE university  (
    "id" serial primary key,
    "title" VARCHAR (50) NOT NULL,
    "deckription" TEXT NOT NULL,
    "image" TEXT,
    "logo":TEXT,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)

CREATE TABLE payment(
    "id" serial primary key,
    "amout" VARCHAR (50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" varchar(20) not NULL
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)

CREATE TABLE admin(
    "id" serial primary key,
    "user_id" integer not null,
     UNIQUE("user_id"),
     "diogram_get" boolean default false not null,
     "alluser_get" boolean default false not null,
     "alluser_post" boolean default false not null,
     "alluser_delete" boolean default false not null,
     "alluser_put" boolean default false not null,
     "student_get" boolean default false not null,
     "student_post" boolean default false not null,
     "student_delete" boolean default false not null,
     "student_put" boolean default false not null,
     "teacher_get" boolean default false not null,
     "teacher_post" boolean default false not null,
     "teacher_delete" boolean default false not null,
     "teacher_put" boolean default false not null,
     "admin_get" boolean default false not null,
     "admin_post" boolean default false not null,
     "admin_delete" boolean default false not null,
     "admin_put" boolean default false not null,
     "course_get" boolean default false not null,
     "course_post" boolean default false not null,
     "course_delete" boolean default false not null,
     "course_put" boolean default false not null,
     "news_get" boolean default false not null,
     "news_post" boolean default false not null,
     "news_delete" boolean default false not null,
     "news_put" boolean default false not null,
     "chat_get" boolean default false not null,
     "chat_post" boolean default false not null,
     "chat_delete" boolean default false not null,
     "chat_put" boolean default false not null,
     "get_allchat" boolean default false not null,
     "dars_get" boolean default false not null,
     "dars_post" boolean default false not null,
     "dars_delete" boolean default false not null,
     "dars_put" boolean default false not null,
      "dars_student_get" boolean default false not null,
     "dars_student_post" boolean default false not null,
     "dars_student_delete" boolean default false not null,
     "dars_student_put" boolean default false not null,
     "test_get" boolean default false not null,
     "test_post" boolean default false not null,
     "test_delete" boolean default false not null,
     "test_put" boolean default false not null,
     "test_student_get" boolean default false not null,
     "test_student_post" boolean default false not null,
     "test_student_delete" boolean default false not null,
     "test_student_put" boolean default false not null,
     "call_me_get" boolean default false not null,
     "call_me_post" boolean default false not null,
     "call_me_delete" boolean default false not null,
     "call_me_put" boolean default false not null,
     "universitet_get" boolean default false not null,
     "universitet_post" boolean default false not null,
     "universitet_delete" boolean default false not null,
     "universitet_put" boolean default false not null,
     "help_get" boolean default false not null,
     "help_post" boolean default false not null,
     "help_delete" boolean default false not null,
     "help_put" boolean default false not null,
     "category_get" boolean default false not null,
     "category_post" boolean default false not null,
     "category_delete" boolean default false not null,
     "category_put" boolean default false not null,
     "notification_get" boolean default false not null,
     "notification_post" boolean default false not null,
     "notification_delete" boolean default false not null,
     "notification_put" boolean default false not null,
     "get_pay" boolean default false not null,
     
     "servis_get" boolean default false not null,
     "servis_post" boolean default false not null,
     "servis_delete" boolean default false not null,
     "servis_put" boolean default false not null,
     "homiy_get" boolean default false not null,
     "homiy_post" boolean default false not null,
     "homiy_delete" boolean default false not null,
     "homiy_put" boolean default false not null,
    "sertifikat_get" boolean default false not null,
     "sertifikat_post" boolean default false not null,
     "sertifikat_delete" boolean default false not null,
     "sertifikat_put" boolean default false not null,
     "create_video" boolean default false not null,
     "pomish" boolean default false not null,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null   
)
CREATE TABLE servis(
   "id" serial primary key,
    "title" VARCHAR (50) NOT NULL,
    "deckription" VARCHAR (50) NOT NULL,
    "image" text,
   "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE homiy(
   "id" serial primary key,
    "title" VARCHAR (50) NOT NULL,
    "deckription" VARCHAR (50) NOT NULL,
    "image" text,
     "admin_id" integer,
   "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null
)
CREATE TABLE student_theme(
    "id" serial primary key,
    "student_id" integer  NOT NULL,
    "theme_id" integer  NOT NULL,
    "complate" integer default 0  NOT NULL,
    UNIQUE("theme_id","student_id")
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null   
)




CREATE TABLE operator(
    "id" serial primary key,
    "image" TEXT,
    "name" varchar(50),
    "description" text,
    "email" VARCHAR(50),
   "twiter" VARCHAR(50),
   "call_me" VARCHAR(50),
   "whatsapp" VARCHAR(50),
   "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null   
)
CREATE TABLE operator_work(
    "id" serial primary key,
    "opertor_id" integer NOT NULL,
    "title" VARCHAR(50)  NOT NULL,
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null     
)
CREATE TABLE company(
"id" serial primary key,
     "image" TEXT,
    "email" VARCHAR(50),
   "twiter" VARCHAR(50),
   "call_me" VARCHAR(50),
   "whatsapp" VARCHAR(50),
   "address" varchar (50),
    "time_create" timestamp default current_timestamp not null,
	"time_update" timestamp default current_timestamp not null 
)


CREATE TABLE language(
"id" serial primary key,
"lg" varchar(10),
"time_create" timestamp default current_timestamp not null,
"time_update" timestamp default current_timestamp not null 
)