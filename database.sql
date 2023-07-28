CREATE TABLE "users" (
    "id" serial primary key,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "databirth" TEXT NOT NULL,
    "dataRegirter" TEXT,
    "address_id" integer,
    "position_id" integer not null,
    "username" TEXT NOT NULL,
    "user_img" TEXT,
    "create_time" timestamp default current_timestamp not null,
    foreign key ("address_id") references "address"("address_id"),
    foreign key ("position_id") references "position"("position_id")
);