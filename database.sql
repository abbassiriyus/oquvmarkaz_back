create table users (
	"id" serial primary key,
	"address" VARCHAR(50),
	"balance" integer default 0 not null,
	"date_joined" timestamp default current_timestamp not null,
	"description" VARCHAR(50),
	"email" VARCHAR(50) NOT NULL,
	"image" VARCHAR(50),
	"first_name" VARCHAR(50),
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
    "position" integer default 1 not null
);

CREATE TABLE "verify" (
    "id" serial primary key,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "code" integer,
    "position" integer default 1 not null
);
CREATE TABLE "course" (
    -- o`zi hamma joyda bir xil
  "id" serial primary key,
  image rasm yukla not null-kiritish majburiy 
  "image" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" integer NOT NULL,
  "skitka" integer,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null,
  )
