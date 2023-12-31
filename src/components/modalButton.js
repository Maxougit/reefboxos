// components/ModalButton.js
import React, { useState } from "react";
import Modal from "./modal"; // Importer votre composant Modal
import "../styles/modalButton.css"; // Assurez-vous d'avoir un fichier CSS pour les styles

const ModalButton = ({ component, name, icon }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      <button className="modal-button" onClick={toggleModal}>
        <div className="icon-container">{icon}</div>{" "}
        {/* Remplacez par votre icône */}
        <div className="button-text">{name}</div>
      </button>
      {isModalOpen && <Modal closeModal={toggleModal}>{component}</Modal>}
    </>
  );
};

export default ModalButton;
