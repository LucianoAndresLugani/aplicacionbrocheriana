// App.jsx
import { useState } from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';

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

const MissionDetails = ({ mission, onMissionComplete }) => {
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

  const handleOpenSteps = () => {
    const stepsUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(mission.steps.join('\n'))}`;
    window.open(stepsUrl, '_blank');
  };
  

  return (
    <div className="mission-details">
      <h2>{mission.title}</h2>
      <p>{mission.description}</p>
      <video src={mission.videoUrl} controls />
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
        <button className="button is-primary" onClick={handleOpenSteps}>
          Ver Pasos en Otra Pestaña
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [brocherosGanados, setBrocherosGanados] = useState(0);

  const handleMissionClick = (mission) => {
    if (selectedMission && selectedMission.id === mission.id) {
      setSelectedMission(null); // Deselecciona la misión si ya está seleccionada
    } else {
      setSelectedMission(mission); // Selecciona la misión si no está seleccionada
    }
  };

  const handleMissionComplete = () => {
    setBrocherosGanados(brocherosGanados + 1);
  };

  const missions = [
    {
      id: 4,
      title: 'Apagar las luces innecesarias',
      description: 'Ahorra energía apagando las luces que no estés utilizando.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Apaga las luces al salir de una habitación.', 'Paso 2: Utiliza luz natural durante el día.', 'Paso 3: Instala luces LED de bajo consumo.']
    },
    // Otras misiones...
  ];

  return (
    <div>
      <Header titulo="Aplicación Bocherana" />
      <div className="container">
        <div className="buttons">
          {missions.map((mission) => (
            <MissionButton key={mission.id} mission={mission} onMissionClick={handleMissionClick} />
          ))}
        </div>
        {selectedMission && <MissionDetails mission={selectedMission} onMissionComplete={handleMissionComplete} />}
      </div>
      <p>Brocheros Ganados: {brocherosGanados}</p>
      <button className="button is-primary" onClick={() => window.history.back()}>
        Volver
      </button>
    </div>
  );
};

export default App;
