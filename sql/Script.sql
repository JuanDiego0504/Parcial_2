--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-11-20 15:37:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4883 (class 0 OID 33879)
-- Dependencies: 222
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- TOC entry 4879 (class 0 OID 33840)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role_name, description) FROM stdin;
23619897-2837-4f2e-af70-3c00659ae641	admin	Administrador del sistema
492da25f-7b65-4014-8565-e090e573c832	user	Usuario estándar
\.


--
-- TOC entry 4880 (class 0 OID 33850)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, is_active) FROM stdin;
c548d1af-ec32-4068-a3ce-1e8a33827ae7	admin@example.com	$2b$10$jLOikUEouyh655JSPAUQJeyWzIWrJ5ql/AesZdFGoAlZFOrkJxcCS	t
\.


--
-- TOC entry 4881 (class 0 OID 33861)
-- Dependencies: 220
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles (user_id, role_id) FROM stdin;
c548d1af-ec32-4068-a3ce-1e8a33827ae7	23619897-2837-4f2e-af70-3c00659ae641
\.


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 221
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


-- Completed on 2025-11-20 15:37:49

--
-- PostgreSQL database dump complete
--

