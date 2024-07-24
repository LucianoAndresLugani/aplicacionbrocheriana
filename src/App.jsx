
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import 'bulma/css/bulma.min.css';

import YouTube from 'react-youtube';
import { auth, firestore } from './firebaseConfig'; // Asegúrate de importar desde el archivo correcto
// Componentes

const Header = ({ titulo }) => {
  return (
    <header className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{titulo}</h1>
        </div>
      </div>
    </header>
  );
};

const MissionButton = ({ mission, onMissionClick }) => {
  return (
    <button className="button is-primary" onClick={() => onMissionClick(mission)}>
      {mission.title}
    </button>
  );
};

const MissionDetails = ({ mission, onMissionComplete, onReturnToMissions }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < mission.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('¡Misión completada! Has Ganado Un Brochero !!');
      onMissionComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getYouTubeVideoId = (url) => {
    const videoId = new URL(url).searchParams.get('v');
    return videoId;
  };

  const opts = {
    height: '315',
    width: '300',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="mission-details">
      <h2>{mission.title}</h2>
      <p>{mission.description}</p>
      
      <div className="video-container">
        <YouTube videoId={getYouTubeVideoId(mission.videoUrl)} opts={opts} />
      </div>
      <h3>Pasos para completar la misión:</h3>
      <ol>
        {mission.steps.map((step, index) => (
          <li key={index} className={index === currentStep ? 'active-step' : 'inactive-step'}>
            {step}
          </li>
        ))}
      </ol>
      <div className="buttons">
        <button className="button is-primary" onClick={handlePreviousStep}>
          Paso Anterior
        </button>
        <button className="button is-primary" onClick={handleNextStep}>
          Siguiente Paso
        </button>
        <button className="button is-danger" onClick={onReturnToMissions}>
          Volver a las misiones
        </button>
      </div>
    </div>
  );
};

const BrocheroCounter = () => {
  const course = localStorage.getItem('course') || '';
  const brocherosGanados = parseInt(localStorage.getItem('brocherosGanados') || '0', 10);

  return (
    <div>
      <p>Curso: {course}</p>
      <p>Brocheros Ganados: {brocherosGanados}</p>
    </div>
  );
};

const courses = ['1a', '1b', '1c', '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6b', '6c'];


const Login = ({ onLogin }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await auth.signInAnonymously();
      const user = userCredential.user;

      const userDocRef = firestore.collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        await userDocRef.set({
          course: selectedCourse,
          brocherosGanados: 0,
        });
      } else {
        setSelectedCourse(userDoc.data().course);
      }

      const userCourseRef = firestore.collection('courses').doc(selectedCourse);
      const userCourseDoc = await userCourseRef.get();

      if (!userCourseDoc.exists) {
        await userCourseRef.set({
          brocherosGanados: 0,
        });
      }

      localStorage.setItem('course', selectedCourse);
      localStorage.setItem('brocherosGanados', '0');

      onLogin(selectedCourse);
      navigate('/');
    } catch (error) {
      alert('Error de autenticación: ' + error.message);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Selecciona un curso</label>
          <div className="control">
            <div className="select">
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="" disabled>Selecciona un curso</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

const MissionList = ({ missions, onMissionClick, onSaveAndExit }) => {
  const navigate = useNavigate();

  const handleMissionClick = (mission) => {
    onMissionClick(mission);
    navigate(`/mission/${mission.id}`);
  };

  const handleSaveAndExit = () => {
    onSaveAndExit();
    navigate('/');
  };

  return (
    <div>
      <div className="buttons">
        {missions.map((mission) => (
          <MissionButton key={mission.id} mission={mission} onMissionClick={handleMissionClick} />
        ))}
      </div>
      <div className="buttons">
        <button className="button is-success" onClick={handleSaveAndExit}>
          Guardar y Salir
        </button>
      </div>
    </div>
  );
};

// App

const App = () => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [brocherosGanados, setBrocherosGanados] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [course, setCourse] = useState('');
  const [attemptedMissionAccess, setAttemptedMissionAccess] = useState(false);

  useEffect(() => {
    // Verifica si el usuario está autenticado revisando el localStorage
    const course = localStorage.getItem('course');
    if (course) {
      // Si hay curso en el localStorage, el usuario está autenticado
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        const user = await firestore.collection('users').doc(course).get();
        if (user.exists) {
          setBrocherosGanados(user.data().brocherosGanados);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated, course]);

  const handleMissionClick = (mission) => {
    setSelectedMission(mission);
    setAttemptedMissionAccess(true);
  };

  const handleMissionComplete = async () => {
    const newBrocherosGanados = parseInt(localStorage.getItem('brocherosGanados') || '0', 10) + 1;
    localStorage.setItem('brocherosGanados', newBrocherosGanados);
    setSelectedMission(null);

    // Actualizar la cantidad de brocheros en Firestore
    
    await firestore.collection('users').doc(course).update({
      brocherosGanados: newBrocherosGanados,
    });
  };

  const handleSaveAndExit = async () => {
    // Guardar brocheros ganados en Firestore
    const course = localStorage.getItem('course');
    if (course) {
      await firestore.collection('users').doc(course).update({
        brocherosGanados: brocherosGanados,
      });
    }

    // Guardar brocheros ganados en localStorage
    localStorage.setItem('brocherosGanados', brocherosGanados.toString());

    // Redirigir al usuario a la página de inicio
    
  };

  const returnToMissions = () => {
    setSelectedMission(null);
  };

  const handleLogin = (course) => {
    setCourse(course);
    setIsAuthenticated(true);
  };


  const missions = [
    {
      id: 5,
      title: 'Usar productos reciclables',
      description: 'Reduce la cantidad de residuos utilizando productos reciclables.',
      videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Compra productos con envases reciclables.', 'Paso 2: Reutiliza los envases siempre que sea posible.', 'Paso 3: Recicla los envases cuando ya no puedas usarlos.']
    },
    {
      id: 6,
      title: 'Plantar un árbol',
      description: 'Contribuye a la reforestación plantando un árbol.',
    videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Elige un lugar adecuado para plantar un árbol.', 'Paso 2: Prepara el terreno y planta el árbol.', 'Paso 3: Cuida el árbol hasta que pueda sobrevivir por sí solo.']
    },
    {
      id: 7,
      title: 'Reducir el consumo de agua',
      description: 'Ahorra agua con pequeños cambios en tus hábitos diarios.',
     videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Cierra el grifo mientras te cepillas los dientes.', 'Paso 2: Toma duchas más cortas.', 'Paso 3: Usa la lavadora y el lavavajillas solo cuando estén llenos.']
    },
    {
      id: 8,
      title: 'Comprar productos de comercio justo',
      description: 'Apoya a los productores locales y a los trabajadores de países en desarrollo comprando productos de comercio justo.',
     videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Busca el logotipo de comercio justo cuando compres productos.', 'Paso 2: Prefiere los productos de comercio justo siempre que sea posible.', 'Paso 3: Informa a otros sobre los beneficios del comercio justo.']
    },
    {
      id: 9,
      title: 'Usar transporte público',
      description: 'Reduce la emisión de gases de efecto invernadero utilizando el transporte público.',
     videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Planifica tus viajes para usar el transporte público.', 'Paso 2: Usa una bicicleta para distancias cortas.', 'Paso 3: Considera compartir coche con otras personas.']
    },
    {
      id: 10,
      title: 'Compostaje en casa',
      description: 'Transforma tus residuos orgánicos en compost para enriquecer el suelo de tu jardín.',
     videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Recolecta residuos orgánicos de tu cocina.', 'Paso 2: Colócalos en una pila de compostaje.', 'Paso 3: Usa el compost en tu jardín una vez que esté listo.']
    },
    {
      id: 11,
      title: 'Caminar o andar en bicicleta para trayectos cortos',
      description: 'Reduce la emisión de gases de efecto invernadero optando por caminar o andar en bicicleta para trayectos cortos.',
      videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Identifica los trayectos cortos que puedes hacer a pie o en bicicleta.', 'Paso 2: Deja tu coche en casa para estos trayectos.', 'Paso 3: Disfruta del ejercicio y del aire libre mientras contribuyes al medio ambiente.']
    },
    {
      id: 12,
      title: 'Donar objetos que ya no necesites',
      description: 'En lugar de tirar los objetos que ya no necesitas, dónalos a alguien que pueda utilizarlos.',
      videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Revisa tus pertenencias y separa las que ya no necesites.', 'Paso 2: Busca organizaciones locales que acepten donaciones.', 'Paso 3: Dona tus objetos a estas organizaciones.']
    },
    {
      id: 13,
      title: 'Usar energía renovable',
      description: 'Contribuye a la reducción de la dependencia de los combustibles fósiles utilizando energía renovable.',
      videoUrl: 'https://www.youtube.com/watch?v=BoV7rQrQu8w',
      steps: ['Paso 1: Investiga sobre opciones de energía renovable para tu hogar.', 'Paso 2: Instala paneles solares o utiliza proveedores de energía verde.', 'Paso 3: Mantén y monitorea el uso de la energía para asegurar su efectividad.']
    }
  ];

  return (
    <Router>
      <Header titulo="Misiones Ambientales" />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? (
            <>
              <BrocheroCounter brocherosGanados={brocherosGanados} />
              {selectedMission ? (
                <MissionDetails
                  mission={selectedMission}
                  onMissionComplete={handleMissionComplete}
                  onReturnToMissions={returnToMissions}
                />
              ) : (
                <MissionList missions={missions} onMissionClick={handleMissionClick} onSaveAndExit={handleSaveAndExit}/>
              )}
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/mission/:id"
          element={
            attemptedMissionAccess && selectedMission ? (
              <MissionDetails
                mission={selectedMission}
                onMissionComplete={handleMissionComplete}
                onReturnToMissions={returnToMissions}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
