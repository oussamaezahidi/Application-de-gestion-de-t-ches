# Kanban Project

**Sujet du projet**

Application Kanban simple permettant de gérer des tâches avec : création, modifications, tri par priorité, filtrage par utilisateur, et déplacement des tâches entre colonnes (drag & drop). Le backend est simulé avec `json-server` et les données se trouvent dans `backend/db.json`.

**Membres de l'équipe**

- Oussama Ezahidi
- Meriem Boullous
- Ranya Bahlouri

**Prérequis**

- Node.js (>= 14) et npm 
- Git

**Installation**

1. Cloner le dépôt :

```bash
git clone <url-du-repo>
cd kanban-project
```

2. Installer les dépendances :

```bash
npm install
```

**Lancer le backend (serveur mock)**

Démarrer le serveur JSON (mock API) :

```bash
npm run server
```

Le serveur s'exécute par défaut sur : `http://localhost:3001`.
Les données sont stockées dans `backend/db.json`.

**Lancer l'application (front)**

Dans un autre terminal :

```bash
npm start
```

Ouvrez `http://localhost:3000` dans votre navigateur.

**Développement (conseils)**

- Démarrez le backend et le frontend dans deux terminaux séparés (ex. un terminal pour `npm run server`, un autre pour `npm start`).
- Vous pouvez aussi utiliser `npm run dev` si vous préférez `vite` et qu'il est configuré.

**Build pour production**

```bash
npm run build
```

Le build optimisé est placé dans `build/`. Servez le dossier `build` avec un serveur statique (ex. `serve -s build`).

**Remarque**

- Si le port `3001` est déjà occupé, modifiez la commande `server` dans `package.json` ou arrêtez le processus qui utilise ce port.

**Détails techniques**

- **Sujet (rappel)** : Application Kanban simple pour créer, modifier, trier (par priorité), filtrer par utilisateur et déplacer des tâches entre colonnes (drag & drop). Backend mock via `json-server` (`backend/db.json`).

- **Hooks utilisés** :
  - React : `useState`, `useEffect`
  - React Router : `useParams`, `useNavigate`
  - Redux : `useSelector`, `useDispatch` (avec Redux Toolkit)
  - Remarque : le projet n'utilise pas de hooks personnalisés (les fonctionnalités sont gérées dans les composants/pages).

- **Style / UI** :
  - **Bootstrap** est importé dans `src/index.js` pour la base responsive (`bootstrap/dist/css/bootstrap.min.css`).
  - **Styles personnalisés** dans `src/App.css` : CSS variables, classes pour priorités (`priority-high|medium|low`), feedback de drag (`.dragging`, `td.drag-over`), responsive et support `prefers-color-scheme` (dark mode).
  - Avatars : utilisation possible de UI Avatars (ex : `https://ui-avatars.com/api/?name=John+Doe...`).

- **Autres artefacts** :
  - Backend mock : `npm run server` (json-server)
  - Routes principales : Kanban, TaskForm, TaskDetails, Users
  - Build production : `npm run build`

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
