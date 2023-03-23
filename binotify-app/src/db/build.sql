CREATE SCHEMA IF NOT EXISTS public;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

DROP TABLE IF EXISTS public.User;

DROP TABLE IF EXISTS public.Album;

DROP TABLE IF EXISTS public.Song;

DROP TABLE IF EXISTS public.Subscription;

CREATE TABLE IF NOT EXISTS public.User
(
    "user_id" SERIAL NOT NULL,
    "email" character varying COLLATE pg_catalog."default" NOT NULL,
    "password" character varying COLLATE pg_catalog."default" NOT NULL,
    "salt" character varying COLLATE pg_catalog."default" NOT NULL,
    "username" character varying COLLATE pg_catalog."default" NOT NULL,
    "isAdmin" boolean NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS public.Album
(
    "album_id" SERIAL NOT NULL,
    "Judul" character varying COLLATE pg_catalog."default" NOT NULL,
    "Penyanyi" character varying COLLATE pg_catalog."default" NOT NULL,
    "Total_duration" integer NOT NULL,
    "Image_path" character varying COLLATE pg_catalog."default" NOT NULL,
    "Tanggal_terbit" date NOT NULL,
    "Genre" character varying COLLATE pg_catalog."default",

    CONSTRAINT album_pkey PRIMARY KEY ("album_id")
);

CREATE TABLE IF NOT EXISTS public.Song
(
    "song_id" SERIAL NOT NULL,
    "Judul" character varying COLLATE pg_catalog."default" NOT NULL,
    "Penyanyi" character varying COLLATE pg_catalog."default" NOT NULL,
    "Tanggal_terbit" date NOT NULL,
    "Genre" character varying COLLATE pg_catalog."default",
    "Duration" integer NOT NULL,
    "Audio_path" character varying COLLATE pg_catalog."default" NOT NULL,
    "Image_path" character varying COLLATE pg_catalog."default",
    "album_id" integer,

    CONSTRAINT song_pkey PRIMARY KEY ("song_id"),
    CONSTRAINT "SongAlbum" FOREIGN KEY ("album_id")
        REFERENCES public.Album ("album_id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.Subscription
(
    "creator_id" integer NOT NULL,
    "subscriber_id" integer NOT NULL,
    "status" character varying COLLATE pg_catalog."default" NOT NULL,
    
    CONSTRAINT subscription_pkey PRIMARY KEY ("creator_id","subscriber_id"),
    CONSTRAINT "SubscriptionUser" FOREIGN KEY ("subscriber_id")
        REFERENCES public.User ("user_id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);