CREATE TABLE IF NOT EXISTS public.usuario
(
    id integer NOT NULL DEFAULT nextval('usurio_id_seq'::regclass),
    nombre character varying(60) COLLATE pg_catalog."default" NOT NULL,
    edad bigint NOT NULL,
    CONSTRAINT usurio_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;