# prueba-proyect

Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

Node.js (v14 o superior)Verifica con node -v

NPM (v6 o superior) o YarnVerifica con npm -v o yarn -v

# Instalación y Ejecución

# 1. Clonar el repositorio
git clone https://github.com/Ameteratzu/vue-mid-level-project-task-ui--AmetQuispeEspichan-.git

# 2. Entrar en la carpeta del proyecto
cd vue-mid-level-project-task-ui--AmetQuispeEspichan-

# 3. Instalar dependencias con NPM
npm install


# 4. Iniciar servidor de desarrollo con NPM
npm run serve

Una vez iniciado, abre tu navegador :
http://localhost:8080


# estructura del proyecto
src/
├── assets/
├── components/      # Loader, Alert, Table, formularios...
├── services/        # Cliente Axios (api.js)
├── store/           # Pinia stores (project.js, task.js)
├── views/           # Vistas: ProjectList.vue, TaskList.vue
├── router/          # Configuración de rutas (index.js)
├── App.vue
└── main.js