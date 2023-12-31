// components/Modal.js
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/modal.css";

let highestZIndex = 1000;

const Modal = ({ children, closeModal }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 650,
    height: 200,
    x: 10,
    y: 20,
  });
  const [lastDimensions, setLastDimensions] = useState({ ...dimensions });
  const [zIndex, setZIndex] = useState(highestZIndex);

  useEffect(() => {
    function handleResize() {
      if (isMaximized) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
        });
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized]);

  const bringToFront = () => {
    highestZIndex += 1;
    setZIndex(highestZIndex);
  };

  const modalStyle = {
    zIndex: zIndex,
    width: isMaximized ? window.innerWidth : dimensions.width,
    height: isMaximized ? window.innerHeight : dimensions.height,
  };

  const handleDragStart = () => {
    if (isMaximized) {
      // Réduit la fenêtre lorsqu'elle est déplacée en mode plein écran
      setIsMaximized(false);
      setDimensions(lastDimensions);
    }
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setDimensions(lastDimensions);
    } else {
      setLastDimensions(dimensions);
      // Utilisez clientWidth et clientHeight pour obtenir la largeur et la hauteur intérieures
      setDimensions({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        x: 0,
        y: 0,
      });
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: dimensions.x, y: dimensions.y }}
      style={modalStyle}
      onMouseDown={bringToFront}
      onDragStart={handleDragStart}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          setDimensions({ ...dimensions, x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setDimensions({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position,
          });
        }
      }}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      bounds="window"
      enableResizing={!isMaximized}
      dragHandleClassName="modal-header"
    >
      <div className="modal-content">
        <div className="modal-header" onDoubleClick={toggleMaximize}>
          <div className="window-controls">
            <button onClick={toggleMaximize} className="window-control-button">
              {isMaximized ? "🗗" : "🗖"}
            </button>
            <button onClick={closeModal} className="window-control-button">
              &times;
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </Rnd>
  );
};

export default Modal;
