DROP DATABASE SISMAAE;

CREATE DATABASE SISMAAE;

USE SISMAAE;

-- ==================
-- TABELA: Batalhões
-- ==================
CREATE TABLE
    batalhoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL UNIQUE,
        sigla VARCHAR(20) NOT NULL UNIQUE,
        regiao ENUM (
            'NORTE',
            'PLANALTO',
            'OESTE',
            'SUDESTE',
            'LESTE',
            'SUL',
            'MANUTENCAO'
        ) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL
    );

-- ================
-- TABELA: Perfis
-- ================
CREATE TABLE
    perfis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL
    );

-- =================
-- TABELA: Usuários
-- =================
CREATE TABLE
    usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pg ENUM (
            'SD',
            'CB',
            'SGT',
            'TEN',
            'CAP',
            'MAJ',
            'TC',
            'CEL'
        ) NOT NULL,
        nome VARCHAR(150) NOT NULL,
        idt_militar CHAR(10) NOT NULL UNIQUE,
        email VARCHAR(150) UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        perfil_id INT NOT NULL,
        batalhao_id INT NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (perfil_id) REFERENCES perfis (id),
        FOREIGN KEY (batalhao_id) REFERENCES batalhoes (id)
    );

-- ==================
-- TABELA: Materiais 
-- ==================
CREATE TABLE
    materiais (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial_num VARCHAR(4) NOT NULL,
        nome ENUM ("RADAR", "UTIR", "COAAE") NOT NULL,
        `status` ENUM (
            'DISPONIVEL',
            'DISP_C_RESTRICAO',
            'INDISPONIVEL',
            'MANUTENCAO'
        ) NOT NULL DEFAULT 'DISPONIVEL',
        origem_id INT NOT NULL,
        loc_id INT NOT NULL,
        obs VARCHAR(150) NOT NULL DEFAULT 'S/A',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (origem_id) REFERENCES batalhoes (id),
        FOREIGN KEY (loc_id) REFERENCES batalhoes (id)
    );

-- ====================
-- TABELA: Módulos
-- ====================
CREATE TABLE
    modulos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial_num VARCHAR(4) NOT NULL,
        nome VARCHAR(150) NOT NULL,
        `status` ENUM (
            'DISPONIVEL',
            'DISP_C_RESTRICAO',
            'INDISPONIVEL',
            'MANUTENCAO'
        ) NOT NULL DEFAULT 'DISPONIVEL',
        origem_id INT NOT NULL,
        loc_id INT NOT NULL,
        obs VARCHAR(150) NOT NULL DEFAULT 'S/A',
        material_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (material_id) REFERENCES materiais (id),
        FOREIGN KEY (origem_id) REFERENCES batalhoes (id),
        FOREIGN KEY (loc_id) REFERENCES batalhoes (id)
    );

-- ====================
-- TABELA: Submodulos
-- ====================
CREATE TABLE
    submodulos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial_num VARCHAR(4) NOT NULL,
        nome VARCHAR(150) NOT NULL,
        `status` ENUM (
            'DISPONIVEL',
            'DISP_C_RESTRICAO',
            'INDISPONIVEL',
            'MANUTENCAO'
        ) NOT NULL DEFAULT 'DISPONIVEL',
        origem_id INT NOT NULL,
        loc_id INT NOT NULL,
        obs VARCHAR(150) NOT NULL DEFAULT 'S/A',
        modulo_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (modulo_id) REFERENCES modulos (id),
        FOREIGN KEY (origem_id) REFERENCES batalhoes (id),
        FOREIGN KEY (loc_id) REFERENCES batalhoes (id)
    );

-- ===========================
-- TABELA: Registros
-- ===========================
CREATE TABLE
    registros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cod CHAR(10) NOT NULL,
        material_id INT NULL,
        modulo_id INT NULL,
        acao TEXT NOT NULL,
        automatico BOOLEAN DEFAULT FALSE,
        mecanico_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (material_id) REFERENCES materiais (id),
        FOREIGN KEY (modulo_id) REFERENCES modulos (id),
        FOREIGN KEY (mecanico_id) REFERENCES usuarios (id)
    );

-- ===========================
-- TABELA: Ordens de Serviços 
-- ===========================
CREATE TABLE
    ordens_servicos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        modulo_id INT NOT NULL,
        usuario_abertura_id INT NOT NULL,
        `status` ENUM ('ABERTA', 'CONCLUIDA', 'CANCELADA') DEFAULT 'ABERTA',
        data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_fechamento DATETIME NULL,
        descricao LONGTEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (modulo_id) REFERENCES modulos (id),
        FOREIGN KEY (usuario_abertura_id) REFERENCES usuarios (id)
    );

-- =====================
-- TABELA: Manutenções
-- =====================
CREATE TABLE
    manutencoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ordem_servico_id INT NOT NULL,
        usuario_execucao_id INT NOT NULL,
        tipo ENUM ('PREVENTIVA', 'CORRETIVA', 'INSPECAO') NOT NULL,
        descricao LONGTEXT,
        data_execucao DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servicos (id),
        FOREIGN KEY (usuario_execucao_id) REFERENCES usuarios (id)
    );