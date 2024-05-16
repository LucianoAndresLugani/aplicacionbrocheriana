import  { useState } from 'react';
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
        <button className="button is-primary" onClick={onReturnToMissions}>
          Volver a las misiones
        </button>
      </div>
    </div>
  );
};

const BrocheroCounter = ({ brocherosGanados }) => {
  return (
    <div>
      <p>Brocheros Ganados: {brocherosGanados}</p>
    </div>
  );
};

const App = () => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [brocherosGanados, setBrocherosGanados] = useState(0);
  const [showMissions, setShowMissions] = useState(true);

  const handleMissionClick = (mission) => {
    if (selectedMission && selectedMission.id === mission.id) {
      setSelectedMission(null); // Deselecciona la misión si ya está seleccionada
      setShowMissions(true); // Vuelve a mostrar todas las misiones
    } else {
      setSelectedMission(mission); // Selecciona la misión si no está seleccionada
      setShowMissions(false); // Oculta las otras misiones
    }
  };

  const handleMissionComplete = () => {
    setBrocherosGanados(brocherosGanados + 1);
    setSelectedMission(null); // Deselecciona la misión
    setShowMissions(true); // Vuelve a mostrar todas las misiones
  };

  const returnToMissions = () => {
    setSelectedMission(null); // Deselecciona la misión
    setShowMissions(true); // Vuelve a mostrar todas las misiones
  };

  const missions = [
    {
      id: 5,
      title: 'Usar productos reciclables',
      description: 'Reduce la cantidad de residuos utilizando productos reciclables.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Compra productos con envases reciclables.', 'Paso 2: Reutiliza los envases siempre que sea posible.', 'Paso 3: Recicla los envases cuando ya no puedas usarlos.']
    },
    {
      id: 6,
      title: 'Plantar un árbol',
      description: 'Contribuye a la reforestación plantando un árbol.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Elige un lugar adecuado para plantar un árbol.', 'Paso 2: Prepara el terreno y planta el árbol.', 'Paso 3: Cuida el árbol hasta que pueda sobrevivir por sí solo.']
    },
    {
      id: 7,
      title: 'Reducir el consumo de agua',
      description: 'Ahorra agua con pequeños cambios en tus hábitos diarios.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Cierra el grifo mientras te cepillas los dientes.', 'Paso 2: Toma duchas más cortas.', 'Paso 3: Usa la lavadora y el lavavajillas solo cuando estén llenos.']
    },
    {
      id: 8,
      title: 'Comprar productos de comercio justo',
      description: 'Apoya a los productores locales y a los trabajadores de países en desarrollo comprando productos de comercio justo.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Busca el logotipo de comercio justo cuando compres productos.', 'Paso 2: Prefiere los productos de comercio justo siempre que sea posible.', 'Paso 3: Informa a otros sobre los beneficios del comercio justo.']
    },
    {
      id: 9,
      title: 'Usar transporte público',
      description: 'Reduce la emisión de gases de efecto invernadero utilizando el transporte público.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Planifica tus viajes para usar el transporte público.', 'Paso 2: Usa una bicicleta para distancias cortas.', 'Paso 3: Considera compartir coche con otras personas.']
    },
    {
      id: 10,
      title: 'Compostaje en casa',
      description: 'Transforma tus residuos orgánicos en compost para enriquecer el suelo de tu jardín.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Recolecta residuos orgánicos de tu cocina.', 'Paso 2: Colócalos en una pila de compostaje.', 'Paso 3: Usa el compost en tu jardín una vez que esté listo.']
    },
    {
      id: 11,
      title: 'Caminar o andar en bicicleta para trayectos cortos',
      description: 'Reduce la emisión de gases de efecto invernadero optando por caminar o andar en bicicleta para trayectos cortos.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Identifica los trayectos cortos que puedes hacer a pie o en bicicleta.', 'Paso 2: Deja tu coche en casa para estos trayectos.', 'Paso 3: Disfruta del ejercicio y del aire libre mientras contribuyes al medio ambiente.']
    },
    {
      id: 12,
      title: 'Donar objetos que ya no necesites',
      description: 'En lugar de tirar los objetos que ya no necesitas, dónalos a alguien que pueda utilizarlos.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Revisa tus pertenencias y separa las que ya no necesites.', 'Paso 2: Busca organizaciones locales que acepten donaciones.', 'Paso 3: Dona tus objetos a estas organizaciones.']
    },
    {
      id: 13,
      title: 'Usar energía renovable',
      description: 'Contribuye a la reducción de la dependencia de los combustibles fósiles utilizando energía renovable.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Investiga sobre las opciones de energía renovable disponibles en tu área.', 'Paso 2: Instala paneles solares o utiliza energía eólica si es posible.', 'Paso 3: Reduce tu consumo de energía para disminuir la demanda de energía no renovable.']
    },
    {
      id: 14,
      title: 'Evitar el uso de plásticos de un solo uso',
      description: 'Reduce la cantidad de residuos plásticos utilizando alternativas reutilizables.',
      videoUrl: 'url_del_video',
      steps: ['Paso 1: Lleva tus propias bolsas de la compra.', 'Paso 2: Usa una botella de agua reutilizable.', 'Paso 3: Evita los productos con envases de plástico siempre que sea posible.']
    }
    
    // Otras misiones...
  ];


  return (
    <div>
      <Header titulo="Aplicación Bocheriana" />
      <div className="container">
        <BrocheroCounter brocherosGanados={brocherosGanados} />
        {selectedMission ? (
          <MissionDetails
            mission={selectedMission}
            onMissionComplete={handleMissionComplete}
            onReturnToMissions={returnToMissions}
          />
        ) : (
          <div className="buttons">
            {showMissions && (
              missions.map((mission) => (
                <MissionButton key={mission.id} mission={mission} onMissionClick={handleMissionClick} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default App;