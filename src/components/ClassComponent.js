import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Plus, Edit3, GripVertical, Settings } from "lucide-react";

const ClassContainer = styled.div`
  position: absolute;
  /* UML 2.5: rectángulo sin redondeos */
  background: #ffffff;
  border-radius: 0;
  border: 1.5px solid #1e293b;
  width: 220px;
  overflow: hidden;
  font-family: "Courier New", Courier, monospace;
  transition: ${(props) => (props.$isDragging ? "none" : "box-shadow 0.15s ease")};
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  z-index: ${(props) => (props.$isDragging ? 1000 : 10)};
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  will-change: ${(props) => (props.$isDragging ? "transform" : "auto")};
  box-shadow: none;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    border-color: #1e293b;
  }

  ${(props) =>
    props.$isSelected &&
    `
    border-color: #1e293b;
    border-width: 2px;
    box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.15);
  `}

  ${(props) =>
    props.$isDragging &&
    `
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    opacity: 0.96;
  `}
`;

const ClassHeader = styled.div`
  /* UML 2.5: encabezado blanco con borde inferior que separa del cuerpo */
  background: #ffffff;
  color: #1e293b;
  padding: 10px 32px 10px 32px;
  text-align: center;
  position: relative;
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
  border-bottom: 1.5px solid #1e293b;

  h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0;
    color: #1e293b;
    font-family: "Courier New", Courier, monospace;
    /* Las clases en UML 2.5 llevan el nombre en negrita */
  }

  input {
    width: 90%;
    padding: 4px 6px;
    border: 1px solid #94a3b8;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 700;
    background: #ffffff;
    color: #1e293b;
    text-align: center;
    font-family: "Courier New", Courier, monospace;

    &:focus {
      outline: none;
      border-color: #1e293b;
      box-shadow: none;
    }
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  border-radius: 0;
  transition: color 0.2s ease, transform 0.2s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ef4444;
    transform: scale(1.05);
  }
`;

const Section = styled.div`
  padding: 8px 10px;
  /* UML 2.5: secciones divididas por línea horizontal sólida */
  border-bottom: 1px solid #1e293b;
  background: #ffffff;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h5`
  /* UML 2.5: etiquetas de sección en minúsculas, discretas */
  margin: 0 0 4px 0;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Courier New", Courier, monospace;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  padding: 2px 0;
  position: relative;
  border-radius: 0;
  transition: background-color 0.1s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.04);
  }

  input {
    flex: 1;
    padding: 3px 6px;
    border: 1px solid transparent;
    border-radius: 0;
    font-size: 0.82rem;
    background: transparent;
    color: #1e293b;
    transition: border-color 0.15s ease;
    font-family: "Courier New", Courier, monospace;

    &:focus {
      outline: none;
      border-color: #94a3b8;
      background: #f8fafc;
      box-shadow: none;
    }

    &::placeholder {
      color: #94a3b8;
      font-style: italic;
    }
  }
`;

const AddButton = styled.button`
  /* Botón discreto, estilo UML técnico */
  background: transparent;
  color: #64748b;
  border: 1px dashed #94a3b8;
  border-radius: 0;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 6px;
  width: 100%;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: "Courier New", Courier, monospace;

  &:hover {
    background: #f1f5f9;
    border-color: #64748b;
    color: #1e293b;
  }

  &:active {
    background: #e2e8f0;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #cbd5e0;
  border: none;
  border-radius: 6px;
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: #ef4444;
    transform: scale(1.05);
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  opacity: 0.3;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const ClassComponent = ({
  id,
  className,
  x,
  y,
  attributes = [],
  methods = [],
  onPositionChange,
  onUpdate,
  onDelete,
  onSelect,
  $isSelected,
  socket,
  idDiagrama,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(className);
  const [localAttributes, setLocalAttributes] = useState(attributes);
  const [localMethods, setLocalMethods] = useState(methods);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingAnyField, setIsEditingAnyField] = useState(false);
  const rafIdRef = useRef(null);
  const pendingPosRef = useRef(null);

  useEffect(() => {
    setName(className);
  }, [className]);

  useEffect(() => {
    setLocalAttributes(attributes);
  }, [attributes]);

  useEffect(() => {
    setLocalMethods(methods);
  }, [methods]);

  const handleMouseDown = (e) => {
    if (e.button === 0 && !isEditingAnyField) {
      e.preventDefault();
      e.stopPropagation();

      // Calcular offset basado en la posición actual de la clase
      const offsetX = e.clientX - x;
      const offsetY = e.clientY - y;

      setIsDragging(true);

      onSelect && onSelect();

      const handleMouseMove = (e) => {
        e.preventDefault();

        // Calcular nueva posición basada en el offset inicial
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Throttle con requestAnimationFrame para suavizar arrastre
        pendingPosRef.current = { x: newX, y: newY };
        if (rafIdRef.current == null) {
          rafIdRef.current = requestAnimationFrame(() => {
            const pos = pendingPosRef.current;
            if (pos && onPositionChange) {
              onPositionChange(pos);
            }
            rafIdRef.current = null;
          });
        }

        // Emitir movimiento en tiempo real al servidor
        if (socket) {
          socket.emit("move-class", {
            roomId: idDiagrama,
            classId: id,
            position: { x: newX, y: newY },
          });
        }
      };

      const handleMouseUp = (e) => {
        e.preventDefault();
        setIsDragging(false);

        // Aplicar snap-to-grid cuando se suelta
        const GRID_SIZE = 50; // Tamaño del grid para snap

        // Forzar una última actualización pendiente si existe
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        if (pendingPosRef.current && onPositionChange) {
          // Aplicar snap-to-grid
          const snappedX =
            Math.round(pendingPosRef.current.x / GRID_SIZE) * GRID_SIZE;
          const snappedY =
            Math.round(pendingPosRef.current.y / GRID_SIZE) * GRID_SIZE;

          onPositionChange({ x: snappedX, y: snappedY });
        }

        pendingPosRef.current = null;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      // Agregar eventos
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    onUpdate(id, { name });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { name },
      });
    }
  };

  const addAttribute = () => {
    const newAttributes = [...localAttributes, ""];
    setLocalAttributes(newAttributes);
    onUpdate(id, { attributes: newAttributes });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { attributes: newAttributes },
      });
    }
  };

  const updateAttribute = (index, value) => {
    const newAttributes = [...localAttributes];
    newAttributes[index] = value;
    setLocalAttributes(newAttributes);
    onUpdate(id, { attributes: newAttributes });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { attributes: newAttributes },
      });
    }
  };

  const removeAttribute = (index) => {
    const newAttributes = localAttributes.filter((_, i) => i !== index);
    setLocalAttributes(newAttributes);
    onUpdate(id, { attributes: newAttributes });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { attributes: newAttributes },
      });
    }
  };

  const addMethod = () => {
    const newMethods = [...localMethods, ""];
    setLocalMethods(newMethods);
    onUpdate(id, { methods: newMethods });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { methods: newMethods },
      });
    }
  };

  const updateMethod = (index, value) => {
    const newMethods = [...localMethods];
    newMethods[index] = value;
    setLocalMethods(newMethods);
    onUpdate(id, { methods: newMethods });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { methods: newMethods },
      });
    }
  };

  const removeMethod = (index) => {
    const newMethods = localMethods.filter((_, i) => i !== index);
    setLocalMethods(newMethods);
    onUpdate(id, { methods: newMethods });

    if (socket) {
      socket.emit("update-class", {
        roomId: idDiagrama,
        classId: id,
        updatedData: { methods: newMethods },
      });
    }
  };

  return (
    <ClassContainer
      ref={containerRef}
      x={x}
      y={y}
      $isSelected={$isSelected}
      $isDragging={isDragging}
      data-class-id={id}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => {
        if (e.touches.length === 1 && !isEditingAnyField) {
          // No prevenir el comportamiento por defecto para evitar conflictos
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 0,
          });
          handleMouseDown(mouseEvent);
        }
      }}
    >
      <ClassHeader>
        <DragHandle>
          <GripVertical size={16} />
        </DragHandle>

        {isEditing ? (
          <input
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyPress={(e) => e.key === "Enter" && handleNameBlur()}
            onMouseDown={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <h4 onDoubleClick={() => setIsEditing(true)}>{name}</h4>
        )}

        <DeleteButton
          onClick={onDelete}
          aria-label="Eliminar clase"
          title="Eliminar clase"
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "16px",
              lineHeight: 1,
              fontWeight: 800,
              userSelect: "none",
            }}
          >
            ×
          </span>
        </DeleteButton>
      </ClassHeader>

      <Section>
        <SectionTitle>
          <Edit3 size={16} />
          Atributos
        </SectionTitle>
        <List>
          {localAttributes.map((attr, index) => (
            <ListItem key={index}>
              <input
                value={attr}
                onChange={(e) => updateAttribute(index, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onFocus={() => setIsEditingAnyField(true)}
                onBlur={() => setIsEditingAnyField(false)}
                placeholder="nombre : tipo"
              />
              <RemoveButton
                onClick={() => removeAttribute(index)}
                title="Eliminar atributo"
                aria-label="Eliminar atributo"
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "16px",
                    lineHeight: 1,
                    fontWeight: 800,
                    userSelect: "none",
                  }}
                >
                  ×
                </span>
              </RemoveButton>
            </ListItem>
          ))}
        </List>
        <AddButton onClick={addAttribute}>
          <Plus size={16} />
          Añadir Atributo
        </AddButton>
      </Section>

      <Section>
        <SectionTitle>
          <Settings size={16} />
          Métodos
        </SectionTitle>
        <List>
          {localMethods.map((method, index) => (
            <ListItem key={index}>
              <input
                value={method}
                onChange={(e) => updateMethod(index, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onFocus={() => setIsEditingAnyField(true)}
                onBlur={() => setIsEditingAnyField(false)}
                placeholder="nombre(param : tipo) : tipo"
              />
              <RemoveButton
                onClick={() => removeMethod(index)}
                title="Eliminar método"
                aria-label="Eliminar método"
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "16px",
                    lineHeight: 1,
                    fontWeight: 800,
                    userSelect: "none",
                  }}
                >
                  ×
                </span>
              </RemoveButton>
            </ListItem>
          ))}
        </List>
        <AddButton onClick={addMethod}>
          <Plus size={16} />
          Añadir Método
        </AddButton>
      </Section>
    </ClassContainer>
  );
};

export default ClassComponent;
