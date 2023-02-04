insert into p_user(email, name, user_type, password, is_verified)
values ('radhe@mohan.com','radhe','PREMIUM','jr23enjadhu01298ue',true);


insert into p_album(id, name, image_url, is_public, songs_id, created_by)
values (200,'Bollywood Hits','',true,ARRAY [2,3,4,5,6],'radhe@mohan.com');

insert into p_album(id, name, image_url, is_public, songs_id, created_by)
values (100,'Dance Hits','',true,ARRAY [5,6,3],'radhe@mohan.com');

insert into p_album(id, name, image_url, is_public, songs_id, created_by)
values (32,'Indie','',true,ARRAY [4,5,6],'radhe@mohan.com');

insert into p_album(id, name, image_url, is_public, songs_id, created_by)
values (40,'Hindi Indie','',true,ARRAY [3,6],'radhe@mohan.com');


insert into p_song (id, name, image_url, artists_id)
values (2,'Sage','',ARRAY[1,4]);

insert into p_song (id, name, image_url, artists_id)
values (3,'madhanya','',ARRAY[1,3]);

insert into p_song (id, name, image_url, artists_id)
values (4,'Tum Hi Ho','',ARRAY[1]);

insert into p_song (id, name, image_url, artists_id)
values (5,'2002','',ARRAY[4]);


insert into p_artist(id, name, image_url, album_id)
values (1,'Shreya Ghosal','',ARRAY[200]);

insert into p_artist(id, name, image_url, album_id)
values (3,'Ritviz','',ARRAY[32,100]);

insert into p_artist(id, name, image_url, album_id)
values (4,'Prakhar Porwal','',ARRAY[200,100,32]);

insert into p_artist(id, name, image_url, album_id)
values (5,'Ankur Dewar','',ARRAY[40]);
