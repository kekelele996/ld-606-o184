CREATE TABLE IF NOT EXISTS vessel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vessel_name VARCHAR(128) NOT NULL,
  imo_no VARCHAR(32),
  carrier VARCHAR(128),
  length_m DECIMAL(8,2),
  draft_m DECIMAL(8,2),
  eta DATETIME,
  etd DATETIME,
  status VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS berth (
  id INT PRIMARY KEY AUTO_INCREMENT,
  berth_code VARCHAR(32) NOT NULL,
  length_m DECIMAL(8,2),
  water_depth_m DECIMAL(8,2),
  berth_type VARCHAR(32),
  current_status VARCHAR(32),
  safety_note VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS berth_plan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vessel_id INT NOT NULL,
  berth_id INT NOT NULL,
  planned_arrival DATETIME NOT NULL,
  planned_departure DATETIME NOT NULL,
  priority VARCHAR(16) NOT NULL DEFAULT 'NORMAL',
  status VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
  dispatcher_id INT,
  CONSTRAINT fk_berth_plan_vessel FOREIGN KEY (vessel_id) REFERENCES vessel(id),
  CONSTRAINT fk_berth_plan_berth FOREIGN KEY (berth_id) REFERENCES berth(id)
);

CREATE TABLE IF NOT EXISTS yard_slot (
  id INT PRIMARY KEY AUTO_INCREMENT,
  yard_area VARCHAR(32),
  row_no VARCHAR(8),
  bay_no VARCHAR(8),
  tier_no VARCHAR(8),
  container_no VARCHAR(32),
  slot_status VARCHAR(32),
  cargo_type VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS work_task (
  id INT PRIMARY KEY AUTO_INCREMENT,
  berth_plan_id INT,
  yard_slot_id INT,
  task_type VARCHAR(32),
  team_id INT,
  status VARCHAR(32),
  planned_start DATETIME,
  finished_at DATETIME
);

-- 操作日志：冲突计算、改期、审批均写此表
CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actor VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  target_type VARCHAR(32) NOT NULL,
  target_id VARCHAR(32) NOT NULL,
  detail VARCHAR(512) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_target (target_type, target_id),
  INDEX idx_audit_created (created_at)
);

INSERT INTO vessel (id, vessel_name, imo_no, carrier, length_m, draft_m, eta, etd, status) VALUES
  (1, '远洋之星', 'IMO9472910', '中远海运', 220, 11.5, '2026-10-10 06:00:00', '2026-10-11 18:00:00', 'EXPECTED'),
  (2, '东方明珠', 'IMO9638512', '东方海外', 280, 13.2, '2026-10-10 08:30:00', '2026-10-11 20:00:00', 'EXPECTED'),
  (3, '南方快航', 'IMO9751083', '达飞轮船', 190, 9.8, '2026-10-10 14:00:00', '2026-10-12 06:00:00', 'EXPECTED'),
  (4, '海王星', 'IMO9302178', '马士基', 260, 12.6, '2026-10-10 20:00:00', '2026-10-12 08:00:00', 'EXPECTED'),
  (5, '港湾号', 'IMO9510219', '招商轮船', 175, 8.4, '2026-10-11 05:00:00', '2026-10-12 12:00:00', 'EXPECTED'),
  (6, '长风轮', 'IMO9802514', '中远海运', 205, 10.1, '2026-10-11 10:00:00', '2026-10-13 02:00:00', 'EXPECTED');

INSERT INTO berth (id, berth_code, length_m, water_depth_m, berth_type, current_status, safety_note) VALUES
  (1, 'A01', 300, 15, 'DEEP', 'OPEN', '深水泊位，高潮位靠泊'),
  (2, 'A02', 240, 12, 'GENERAL', 'OPEN', NULL),
  (3, 'B01', 210, 10.5, 'GENERAL', 'MAINTENANCE', '10 月例行维护');

-- 压港状态不由种子写死：后端启动时按“优先级 + 编号”让行口径统一重算
INSERT INTO berth_plan (id, vessel_id, berth_id, planned_arrival, planned_departure, priority, status, dispatcher_id) VALUES
  (1, 1, 1, '2026-10-10 08:00:00', '2026-10-10 20:00:00', 'HIGH',   'APPROVED', 1),
  (2, 2, 1, '2026-10-10 14:00:00', '2026-10-11 08:00:00', 'NORMAL', 'DRAFT',    1),
  (3, 3, 2, '2026-10-10 10:00:00', '2026-10-11 10:00:00', 'HIGH',   'APPROVED', 1),
  (4, 4, 2, '2026-10-11 06:00:00', '2026-10-11 22:00:00', 'HIGH',   'DRAFT',    1),
  (5, 5, 2, '2026-10-11 18:00:00', '2026-10-12 18:00:00', 'LOW',    'DRAFT',    1),
  (6, 6, 3, '2026-10-11 09:00:00', '2026-10-12 09:00:00', 'NORMAL', 'APPROVED', 1);
