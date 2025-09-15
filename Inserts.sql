USE SISMAAE;

INSERT batalhoes (nome, sigla) VALUES
("Batalhão de Manutenção e Suprimento de Artilhaeria Antiaérea","B Mnt Sup AAAe"),
("1º Grupo de Artilhaeria Antiaérea","1º GAAAe"),
("5º Grupo de Artilhaeria Antiaérea de Selva","5º GAAAe Sl"),
("EMBRAER","EMBRAER"),
("2º Grupo de Artilhaeria Antiaérea","2º GAAAe"),
("3º Grupo de Artilhaeria Antiaérea","3º GAAAe"),
("4º Grupo de Artilhaeria Antiaérea","4º GAAAe"),
("11º Grupo de Artilhaeria Antiaérea","11º GAAAe"),
("12º Grupo de Artilhaeria Antiaérea","12º GAAAe");

INSERT materiais (serial_num, nome, `status`, origem_id, loc_id) VALUES
("26","RADAR","INDISPONIVEL",3,3),
("28","RADAR","INDISPONIVEL",3,3),
("10","RADAR","DISPONIVEL",2,3),
("19","RADAR","INDISPONIVEL",2,2),
("03","RADAR","INDISPONIVEL",5,5),
("11","RADAR","INDISPONIVEL",5,5),
("18","RADAR","DISP_C_RESTRICAO",5,1);

INSERT modulos (serial_num, nome, `status`, origem_id, loc_id, material_id) VALUES
-- CABIDE 10
("10","ANTENA","DISPONIVEL",2,3,3),
("10","CRF","DISPONIVEL",2,3,3),
("19","IFF","DISPONIVEL",2,3,3),
("10","PEDESTAL","DISPONIVEL",2,3,3),
("19","UPS","DISPONIVEL",2,3,3),
("10","CAIXA DE BATERIAS","DISPONIVEL",2,3,3),
("19","QUADRIPE","DISPONIVEL",2,3,3),
("10","UV","INDISPONIVEL",2,1,3),
("10","UV","DISPONIVEL",2,3,3),
("26","GERADOR","DISPONIVEL",3,3,3),
("10","CABEAMENTO","DISPONIVEL",2,3,3),
-- CABIDE 19
("19","ANTENA","DISPONIVEL",2,2,4),
("19","CRF","DISPONIVEL",2,2,4),
("10","IFF","INDISPONIVEL",2,4,4),
("19","PEDESTAL","DISPONIVEL",2,2,4),
("10","UPS","INDISPONIVEL",2,1,4),
("19","CAIXA DE BATERIAS","DISPONIVEL",2,2,4),
("10","QUADRIPE","DISPONIVEL",2,2,4),
("19","UV","DISP_C_RESTRICAO",2,2,4),
("19","UV","DISPONIVEL",2,2,4),
("19","GERADOR","DISPONIVEL",2,2,4),
("19","CABEAMENTO","DISPONIVEL",2,2,4),
-- CABIDE 28
("28","ANTENA","DISPONIVEL",3,3,2),
("28","CRF","INDISPONIVEL",3,4,2),
("28","IFF","DISPONIVEL",3,3,2),
("28","PEDESTAL","DISPONIVEL",3,3,2),
("28","UPS","DISPONIVEL",3,3,2),
("28","CAIXA DE BATERIAS","DISPONIVEL",3,3,2),
("28","QUADRIPE","DISPONIVEL",3,3,2),
("28","UV","DISPONIVEL",3,3,2),
("28","UV","DISPONIVEL",3,3,2),
("28","GERADOR","DISPONIVEL",3,3,2),
("28","CABEAMENTO","DISPONIVEL",3,3,2),
-- CABIDE 26
("26","ANTENA","DISPONIVEL",3,1,1),
("26","CRF","INDISPONIVEL",3,1,1),
("26","IFF","INDISPONIVEL",3,4,1),
("26","PEDESTAL","DISPONIVEL",3,3,1),
("26","UPS","DISPONIVEL",3,3,1),
("26","CAIXA DE BATERIAS","DISPONIVEL",3,3,1),
("26","QUADRIPE","INDISPONIVEL",3,3,1),
("26","UV","DISPONIVEL",3,3,1),
("26","UV","DISPONIVEL",3,3,1),
("26","CABEAMENTO","INDISPONIVEL",3,3,1);

INSERT modulos (serial_num, nome, `status`, origem_id, loc_id) VALUES
-- SEM CABIDES
("10","GERADOR","DISPONIVEL",2,2);

INSERT perfis (nome) VALUES
("ADMIN"),
("COMANDO"),
("COL"),
("S4"),
("MECANICO");

INSERT usuarios (pg, nome, idt_militar, email, senha_hash, perfil_id, batalhao_id) VALUES
("SGT", "TAGLIAFERRO", "0312678576", "luis.lft@hotmail.com", "ADMIN", 3, 1),
("SD", "DINIZ", "1234567890", "felipedinizdossantos0@gmail.com", "ADMIN", 1, 1),
("CAP", "MARCEL", "1234567891", "marcel@gmail.com", "ADMIN", 4, 2);

