"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// The main component for the diagramming canvas
export default function DiagramCanvas() {
  // --- Refs ---
  // Ref for the canvas element to access its context
  const canvasRef = useRef(null);
  // Ref to store the canvas 2D rendering context
  const contextRef = useRef(null);

  // --- State Management ---
  // Array to hold all shape objects
  const [shapes, setShapes] = useState([]);
  // Array to hold all connection objects
  const [connections, setConnections] = useState([]);
  // The currently selected shape object
  const [selectedShape, setSelectedShape] = useState(null);
  // Flag to indicate if a shape is being dragged
  const [isDragging, setIsDragging] = useState(false);
  // Flag for connect mode
  const [isConnectMode, setIsConnectMode] = useState(false);
  // The starting shape for a new connection
  const [connectionStartShape, setConnectionStartShape] = useState(null);
  // State for the text editor's visibility, position, and value
  const [textEditor, setTextEditor] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    value: "",
  });

  // --- Utility Functions ---
  // Gets mouse position relative to the canvas
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Checks if a point is inside a given shape
  const isPointInShape = (point, shape) => {
    if (shape.type === "rect") {
      return (
        point.x >= shape.x &&
        point.x <= shape.x + shape.width &&
        point.y >= shape.y &&
        point.y <= shape.y + shape.height
      );
    } else if (shape.type === "circle") {
      const dx = point.x - shape.x;
      const dy = point.y - shape.y;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    }
    return false;
  };

  // --- Drawing Logic (memoized with useCallback) ---
  const draw = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first (so they are behind shapes)
    connections.forEach((conn) => {
      const startShape = shapes.find((s) => s.id === conn.start);
      const endShape = shapes.find((s) => s.id === conn.end);
      if (!startShape || !endShape) return;

      const startX =
        startShape.type === "rect"
          ? startShape.x + startShape.width / 2
          : startShape.x;
      const startY =
        startShape.type === "rect"
          ? startShape.y + startShape.height / 2
          : startShape.y;
      const endX =
        endShape.type === "rect" ? endShape.x + endShape.width / 2 : endShape.x;
      const endY =
        endShape.type === "rect"
          ? endShape.y + endShape.height / 2
          : endShape.y;

      // Draw the line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "#4a5568";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw the label on the connection
      if (conn.label) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        ctx.font = "14px Inter";
        const textWidth = ctx.measureText(conn.label).width;

        // Draw a background for the text for readability
        ctx.fillStyle = "#e5e7eb"; // bg-gray-200
        ctx.fillRect(midX - textWidth / 2 - 5, midY - 10, textWidth + 10, 20);

        // Draw the text
        ctx.fillStyle = "#1a202c";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(conn.label, midX, midY);
      }
    });

    // Draw shapes
    shapes.forEach((shape) => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = "#4a5568";
      ctx.lineWidth = 2;

      if (shape.type === "rect") {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (shape.text) {
        ctx.fillStyle = "#1a202c";
        ctx.font = "16px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textX =
          shape.type === "rect" ? shape.x + shape.width / 2 : shape.x;
        const textY =
          shape.type === "rect" ? shape.y + shape.height / 2 : shape.y;
        ctx.fillText(shape.text, textX, textY);
      }

      if (shape.id === selectedShape?.id) {
        ctx.strokeStyle = "#4f46e5";
        ctx.lineWidth = 4;
        if (shape.type === "rect") {
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });
  }, [shapes, connections, selectedShape]);

  // --- useEffect Hooks ---
  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      contextRef.current = ctx;

      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          draw();
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [draw]);

  // Redraw canvas whenever shapes, connections, or selection change
  useEffect(() => {
    draw();
  }, [shapes, connections, selectedShape, draw]);

  // --- Event Handlers ---
  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const clickedShape = [...shapes]
      .reverse()
      .find((shape) => isPointInShape(pos, shape));

    if (isConnectMode && clickedShape) {
      if (!connectionStartShape) {
        setConnectionStartShape(clickedShape);
      } else if (connectionStartShape.id !== clickedShape.id) {
        setConnections((prev) => [
          ...prev,
          { start: connectionStartShape.id, end: clickedShape.id, label: "" },
        ]);
        setConnectionStartShape(null);
        setIsConnectMode(false);
      }
    } else {
      setSelectedShape(clickedShape || null);
      if (clickedShape) {
        setIsDragging(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedShape) {
      const pos = getMousePos(e);
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === selectedShape.id
            ? {
                ...shape,
                x: pos.x - (shape.width ? shape.width / 2 : 0),
                y: pos.y - (shape.height ? shape.height / 2 : 0),
              }
            : shape
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    const pos = getMousePos(e);
    const clickedShape = [...shapes]
      .reverse()
      .find((shape) => isPointInShape(pos, shape));
    if (clickedShape) {
      setSelectedShape(clickedShape);
      const x =
        clickedShape.type === "rect"
          ? clickedShape.x
          : clickedShape.x - clickedShape.radius;
      const y =
        clickedShape.type === "rect"
          ? clickedShape.y
          : clickedShape.y - clickedShape.radius;
      const width =
        clickedShape.type === "rect"
          ? clickedShape.width
          : clickedShape.radius * 2;
      const height =
        clickedShape.type === "rect"
          ? clickedShape.height
          : clickedShape.radius * 2;
      setTextEditor({
        visible: true,
        x,
        y,
        width,
        height,
        value: clickedShape.text || "",
      });
    }
  };

  const handleTextEditorBlur = () => {
    if (selectedShape) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === selectedShape.id ? { ...s, text: textEditor.value } : s
        )
      );
    }
    setTextEditor({ ...textEditor, visible: false });
  };

  const handleConnectionLabelChange = (index, newLabel) => {
    setConnections((prev) => {
      const newConnections = [...prev];
      newConnections[index].label = newLabel;
      return newConnections;
    });
  };

  // --- UI Action Functions ---
  const addShape = (type) => {
    const newShape = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      color: "#cbd5e1",
      text: type.charAt(0).toUpperCase() + type.slice(1),
      ...(type === "rect" ? { width: 150, height: 80 } : { radius: 50 }),
    };
    setShapes((prev) => [...prev, newShape]);
  };

  const deleteSelected = () => {
    if (!selectedShape) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedShape.id));
    setConnections((prev) =>
      prev.filter(
        (c) => c.start !== selectedShape.id && c.end !== selectedShape.id
      )
    );
    setSelectedShape(null);
  };

  const handleColorChange = (e) => {
    if (selectedShape) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === selectedShape.id ? { ...s, color: e.target.value } : s
        )
      );
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-700">
        Diagramming Canvas (Next.js)
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Create, connect, and style your ideas.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <button
          onClick={() => addShape("rect")}
          className="bg-white hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm"
        >
          Add Rectangle
        </button>
        <button
          onClick={() => addShape("circle")}
          className="bg-white hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm"
        >
          Add Circle
        </button>
        <button
          onClick={() => setIsConnectMode(!isConnectMode)}
          className={`font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-all ${
            isConnectMode
              ? "bg-indigo-600 text-white"
              : "bg-white hover:bg-gray-200 text-gray-700"
          }`}
        >
          Connect
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="color-picker" className="font-medium text-gray-600">
            Color:
          </label>
          <input
            type="color"
            id="color-picker"
            value={selectedShape?.color || "#cbd5e1"}
            onChange={handleColorChange}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
        <button
          onClick={deleteSelected}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
        >
          Delete Selected
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[60vh] bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // End drag if mouse leaves canvas
          onDoubleClick={handleDoubleClick}
        />
        {textEditor.visible && (
          <textarea
            value={textEditor.value}
            onChange={(e) =>
              setTextEditor({ ...textEditor, value: e.target.value })
            }
            onBlur={handleTextEditorBlur}
            autoFocus
            style={{
              position: "absolute",
              left: `${textEditor.x}px`,
              top: `${textEditor.y}px`,
              width: `${textEditor.width}px`,
              height: `${textEditor.height}px`,
              textAlign: "center",
              padding: "5px",
              border: "1px solid #9ca3af",
              borderRadius: "6px",
              resize: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              lineHeight: "1.5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}
      </div>

      {/* Connections List */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Connections List
        </h2>
        {connections.length > 0 ? (
          <ul className="space-y-3 text-gray-600">
            {connections.map((conn, index) => {
              const startShape = shapes.find((s) => s.id === conn.start);
              const endShape = shapes.find((s) => s.id === conn.end);
              const startText = startShape?.text || `Shape #${startShape?.id}`;
              const endText = endShape?.text || `Shape #${endShape?.id}`;
              return (
                <li key={index} className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-indigo-600">
                    {startText}
                  </span>
                  <span>→</span>
                  <input
                    type="text"
                    value={conn.label || ""}
                    onChange={(e) =>
                      handleConnectionLabelChange(index, e.target.value)
                    }
                    placeholder="Add label..."
                    className="flex-grow p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                  />
                  <span>→</span>
                  <span className="font-medium text-indigo-600">{endText}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No connections have been made yet.</p>
        )}
      </div>
    </div>
  );
}
