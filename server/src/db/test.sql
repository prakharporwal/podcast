-- select * from p_album a left join p_song s on ;

-- select s.* FROM unnest(select * from p_album) song_id LEFT JOIN p_song s on s.id = song_id;
-- select unnest(val) FROM (select songs_id from p_album where id=1)  c(val) ;

-- select * from p_song s LEFT JOIN unnest(s.id) on p_song.id = pa.image_url;

-- get album + songs table in same table
select album_id, A.name, A.image_url, is_public, s.id, s.name,s.image_url,s.artists_id
FROM (select * FROM p_album as A) A(album_id), unnest(songs_id) song
INNER JOIN p_song as s
on song = s.id where album_id=32 ;

-- album songs
select * from p_song where id in (select song FROM (select * FROM p_album as A where A.id=32) c(album) , unnest(songs_id) song);