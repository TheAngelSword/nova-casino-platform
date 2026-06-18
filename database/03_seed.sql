-- Catálogos, roles, permisos y datos demo iniciales

insert into public.roles(key, name, description) values
('admin','Administrador','Acceso total'),
('producer','Productor','Control de producción, tareas y aprobaciones'),
('designer','Diseñador','Arte, moodboards, assets y comentarios'),
('animator','Animador','Animaciones y assets visuales'),
('developer','Programador','Builds, integración, bugs y changelog'),
('mathematician','Matemático','RTP, simulaciones, tablas de pago'),
('qa_tester','QA Tester','Pruebas, bugs y evidencias'),
('audio_designer','Audio Designer','Música, sonidos y versiones'),
('client','Cliente','Vista ejecutiva y demos aprobadas'),
('lab_certifier','Laboratorio certificador','Documentos, pruebas y certificación'),
('viewer','Viewer / invitado','Solo lectura')
on conflict(key) do update set name = excluded.name, description = excluded.description;

insert into public.permissions(key, description) values
('games.read','Leer juegos'),('games.write','Crear/editar juegos'),('games.delete','Eliminar juegos'),
('creative.write','Editar creativo'),('art.write','Editar arte'),('audio.write','Editar audio'),('math.write','Editar matemática'),
('development.write','Editar programación/builds'),('qa.write','Editar QA'),('homologation.write','Editar homologación'),('certification.write','Editar certificación'),
('documents.read','Leer documentos'),('documents.write','Subir/editar documentos'),('documents.delete','Eliminar documentos'),
('tasks.read','Leer tareas'),('tasks.write','Crear/editar tareas'),('users.manage','Administrar usuarios'),('settings.manage','Administrar catálogos'),('approvals.manage','Aprobar/rechazar entregables')
on conflict(key) do update set description = excluded.description;

-- Asignación de permisos por rol
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r, public.permissions p
where r.key = 'admin'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
'games.read','games.write','creative.write','art.write','audio.write','math.write','development.write','qa.write','homologation.write','certification.write','documents.read','documents.write','tasks.read','tasks.write','approvals.manage') where r.key = 'producer'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','creative.write','art.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'designer'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','art.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'animator'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','development.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'developer'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','math.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'mathematician'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','qa.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'qa_tester'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','audio.write','documents.read','documents.write','tasks.read','tasks.write') where r.key = 'audio_designer'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','documents.read','tasks.read') where r.key in ('client','viewer')
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('games.read','math.write','qa.write','homologation.write','certification.write','documents.read','documents.write') where r.key = 'lab_certifier'
on conflict do nothing;

insert into public.status_catalog(scope, key, label, color, sort_order) values
('game','concepto','Concepto','#777C99',1),('game','diseno','Diseño','#4F8DFF',2),('game','arte','Arte en producción','#9B6CF6',3),('game','matematica','Matemática en desarrollo','#2DD4DE',4),('game','programacion','Programación','#4F8DFF',5),('game','integracion','Integración','#9B6CF6',6),('game','qa','QA interno','#FB923C',7),('game','simulacion','Simulación estadística','#2DD4DE',8),('game','homologacion','Homologación','#FB923C',9),('game','certificacion','Certificación','#F4C657',10),('game','demo','Demo disponible','#46D399',11),('game','mercado','Listo para mercado','#3BE3A0',12),
('task','pendiente','Pendiente','#777C99',1),('task','proceso','En proceso','#4F8DFF',2),('task','revision','En revisión','#FB923C',3),('task','aprobado','Aprobado','#46D399',4),('task','bloqueado','Bloqueado','#F2607A',5),('task','terminado','Terminado','#3BE3A0',6),
('asset','pendiente','Pendiente','#777C99',1),('asset','boceto','Boceto','#4F8DFF',2),('asset','diseno','En diseño','#9B6CF6',3),('asset','revision','En revisión','#FB923C',4),('asset','aprobado','Aprobado','#46D399',5),('asset','rechazado','Rechazado','#F2607A',6),('asset','integrado','Integrado','#2DD4DE',7)
on conflict(scope, key) do update set label=excluded.label, color=excluded.color, sort_order=excluded.sort_order;

insert into public.games(slug,name,description,game_type,theme,target_audience,complexity,stage,progress,priority,owner_name,estimated_delivery,area_progress,risks,next_steps) values
('mini-ruleta','Mini Ruleta','Ruleta reducida de 13 números para partidas rápidas con apuestas a número, color y paridad.','Ruleta reducida','Casino europeo compacto','Jugador casual de mesa','Media','matematica',26,'Alta','Productor interno','Q3 2026','{"arte":25,"musica":10,"sonidos":12,"matematica":48,"programacion":22,"qa":6,"homologacion":0,"certificacion":0}','{"Definir RTP con rueda reducida","Validar pagos sin romper ventaja de casa"}','{"Cerrar tabla de pagos","Simular 100M de giros","Primer pase de arte"}'),
('inflar-globos','Inflar Globos','Juego tipo crash donde el multiplicador aumenta mientras el globo se infla; el jugador cobra antes de que reviente.','Crash / cobro anticipado','Feria colorida','Jugador de riesgo casual','Media','diseno',14,'Media','Productor interno','Q4 2026','{"arte":18,"musica":8,"sonidos":14,"matematica":22,"programacion":16,"qa":4,"homologacion":0,"certificacion":0}','{"Curva de reventado certificable","Cobro anticipado claro para el usuario"}','{"Definir curva","Prototipo de inflado","Moodboard de feria"}'),
('ruleta-calle','Ruleta Calle','Ruleta con estética urbana, neón, asfalto mojado y tipografía graffiti.','Ruleta temática','Calle nocturna y graffiti','Jugador joven','Media-Alta','arte',20,'Media','Productor interno','Q4 2026','{"arte":38,"musica":16,"sonidos":18,"matematica":20,"programacion":18,"qa":5,"homologacion":0,"certificacion":0}','{"Legibilidad del tablero","Rendimiento con neones"}','{"Dirección de arte final","Set de símbolos","Reusar matemática base"}'),
('plinko','Plinko','Caída de bolas por pines con volatilidad seleccionable y premios en ranuras.','Plinko','Tablero luminoso','Jugador casual','Media','matematica',28,'Alta','Matemático interno','Q3 2026','{"arte":30,"musica":12,"sonidos":16,"matematica":52,"programacion":30,"qa":8,"homologacion":0,"certificacion":0}','{"Distribución binomial vs pagos","Física determinista certificable"}','{"Validar distribución por filas","Simular caídas","Afinar multiplicadores"}'),
('avion','Avión','Crash de multiplicador en vuelo con cobro antes de que el avión desaparezca.','Crash','Cielo y estela','Jugador de riesgo social','Alta','diseno',16,'Media','Programación','2027','{"arte":20,"musica":10,"sonidos":12,"matematica":24,"programacion":18,"qa":4,"homologacion":0,"certificacion":0}','{"Servidor de ronda","Reconexión a mitad de partida"}','{"Decidir solitario vs multijugador","Curva de vuelo","Servidor de ronda"}'),
('carreritas','Carreritas','Mini carrera de personajes/vehículos con apuestas a ganador y eventos de pista.','Racing bet','Pista estilizada','Jugador casual competitivo','Media','concepto',10,'Media','Creatividad','2027','{"arte":12,"musica":8,"sonidos":8,"matematica":12,"programacion":8,"qa":0,"homologacion":0,"certificacion":0}','{"Probabilidades transparentes","Animación no debe revelar resultado antes de tiempo"}','{"Definir personajes","Modelo de probabilidades","Prototipo visual"}'),
('mini-minas','Mini Minas','Juego de selección de casillas con minas ocultas y multiplicador creciente por acierto.','Mines','Mina futurista','Jugador de riesgo estratégico','Media','concepto',12,'Alta','Matemática','Q4 2026','{"arte":14,"musica":8,"sonidos":10,"matematica":24,"programacion":12,"qa":0,"homologacion":0,"certificacion":0}','{"Balance por número de minas","Tabla de multiplicadores"}','{"Definir niveles de riesgo","Tabla de pagos","Wireframe de tablero"}')
on conflict(slug) do update set name=excluded.name, description=excluded.description, game_type=excluded.game_type, theme=excluded.theme, progress=excluded.progress;

insert into public.tasks(title,description,game_id,area,owner_name,priority,status,due_date)
select 'Cerrar tabla de pagos de Mini Ruleta','Definir pagos por número/color/paridad.',g.id,'Matemática','Matemático','Alta','proceso','2026-07-01'::date from public.games g where g.slug='mini-ruleta'
on conflict do nothing;

insert into public.tasks(title,description,game_id,area,owner_name,priority,status,due_date)
select 'Set de pines y ranuras de Plinko','Arte final y exportación PNG/SVG.',g.id,'Arte','Diseñador','Media','revision','2026-07-08'::date from public.games g where g.slug='plinko'
on conflict do nothing;

insert into public.documents(name,category,version,status,access_level) values
('Documento general del proyecto','Documento general','v0.1','Borrador','internal'),
('Checklist base de homologación','Evidencia homologación','v0.1','Borrador','lab')
on conflict do nothing;
