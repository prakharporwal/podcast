-- primary tables start with p
create table p_song (
    id int8 primary key ,
    name varchar,
    image_url varchar,
    artists_id int8[],
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

CREATE TYPE USER_TYPE AS ENUM ('PREMIUM', 'STUDENT', 'NORMAL');
create table p_user(
    email varchar primary key ,
    name varchar,
    user_type USER_TYPE,
    password varchar,
    is_verified boolean,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table p_album(
    id int8 primary key,
    name varchar,
    image_url varchar,
    is_public boolean,
    songs_id int8[],
    created_by varchar,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    CONSTRAINT fk_user
        FOREIGN KEY (created_by)
            REFERENCES p_user(email)
);

create table p_artist
(
    id         int8  primary key,
    name       varchar,
    image_url  varchar,
    album_id   int8[],
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

--- INDEX ----
create unique index artist_name_uindex
    on p_artist (name);

create index song_name_index
    on p_song (name);

create index album_name_index
    on p_album (name);

-- updated at timestamp function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- setting trigger to update timestamp artist table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON p_artist
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- setting trigger to update timestamp song table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON p_song
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- setting trigger to update timestamp album table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON p_album
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- setting trigger to update timestamp USER table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON p_user
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
