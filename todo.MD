## Auth

[x] 1- register: Registrar una cuenta de usuario: Crear una cuenta personal con email, nombre y contraseña.
[x] 2- loginUser: Iniciar sesión: Acceder a la cuenta de usuario con email y contraseña.
[x] 2- verifyToken: Verificar token [AUTH]

## Team [AUTH]

[x] 1- getMyTeams: Ver mis equipos: Consultar la lista de todos los equipos a los que pertenece mi cuenta de usuario. [REF]
[x] 2- createTeam: Crear un nuevo equipo: Después de iniciar sesión, crear un nuevo equipo con un nombre y una contraseña para unirse, y automáticamente ser su administrador. [REF]
[x] 3- getMyTeam: Consultar un equipo al que pertenezco. [REF] [USER_EXIST_IN_TEAM]
[x] 4- updateTeam: Editar un equipo al que pertenezco. [REF] [ADMIN]

## Membership [AUTH] [USER_EXIST_IN_TEAM]

[x] 1- getUsers: Consultar los usuarios de un equipo. [REF]
[x] 2- joinTeam: Unirse a un equipo existente: Después de iniciar sesión, unirse a un equipo usando su id y contraseña de unión. [AUTH]
[x] 3- leaveTeam: Salirme de un equipo: Abandonar un equipo al que pertenezco, dejando de ser miembro. [REF]
[x] 4- leaveUserFromTeam: Quitar a un miembro: Eliminar a un miembro del equipo, ya sea administrador o no. [REF] [ADMIN]
[x] 5- promoteToAdmin: Hacer administrador a un miembro. [REF] [ADMIN]
[x] 6- demoteFromAdmin: Quitar a un administrador. [REF] [ADMIN]

## Counter [AUTH] [USER_EXIST_IN_TEAM]

[x] 1- getCounters: listar counters de un equipo. [REF]
[x] 2- createTeam: Crear counter a un equipo. [REF]
[x] 3- getCounter: buscar un counter de un equipo. [REF] [COUNTER_EXIST_IN_TEAM]
[x] 4- updateCounter: editar counter de un equipo. [REF] [ADMIN] [COUNTER_EXIST_IN_TEAM]
[x] 5- deleteCounter: eliminar counter de un equipo. [REF] [ADMIN] [COUNTER_EXIST_IN_TEAM]
[x] 6- incrementCounter: increment counter de un equipo. [REF] [COUNTER_EXIST_IN_TEAM]
[x] [x] 6A- al incrementar un counter se revisa si cumplió una meta (archived: false) y si es el caso se marca como cumplida
[x] 7- resetCounter: reset counter de un equipo. [REF] [COUNTER_EXIST_IN_TEAM]

## Goal [AUTH] [USER_EXIST_IN_TEAM] [COUNTER_EXIST_IN_TEAM]

[x] 1- createGoal: crear meta a un counter. [REF]
[x] 2- getGoals: listar metas de un counter. [REF]
[x] 3- getGoal: buscar la meta de un counter. [REF] [GOAL_EXIST_IN_COUNTER]
[] 4- editar meta de un counter. [REF] [ADMIN] [GOAL_EXIST_IN_COUNTER]
[x] 5- eliminar meta de un counter. [REF] [ADMIN] [GOAL_EXIST_IN_COUNTER]
[x] 6- reactivar meta de un counter. [REF] [ADMIN] [GOAL_EXIST_IN_COUNTER]
[x] 7- clonar meta de un counter. [REF] [GOAL_EXIST_IN_COUNTER]

## Retrospective

[] 1- Crear una retrospectiva
