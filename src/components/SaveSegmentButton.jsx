import React, { useEffect, useState } from "react";
import { availableSchemas } from "./data";
import { toast, ToastContainer } from "react-toastify";

const SaveSegmentButton = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState("");
  const [segmentNameError, setSegmentNameError] = useState("");
  const [selectedSchemasError, setSelectedSchemasError] = useState("");

  const handleSave = () => {

    let hasError = false;

    if (!segmentName.trim()) {
        setSegmentNameError("Segment name is required!");
        hasError = true;
      } else {
        setSegmentNameError(""); // Reset error message if segment name is provided
      }

      if (selectedSchemas.length === 0) {
        setSelectedSchemasError("At least one schema must be selected!");
        hasError = true;
      } else {
        setSelectedSchemasError(""); // Reset error message if at least one schema is selected
      }

      if (hasError) {
        return;
      }
   
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema]: schema }))
    };

    sendDataToServer(segmentData);

    setShowOffcanvas(false);

    toast.success("Segment saved successfully!");
  };

  const handleSegmentNameChange = (e) => {
    const value = e.target.value;
    setSegmentName(value);

    // Validate segment name
    if (!value.trim()) {
      setSegmentNameError("Segment name is required!");
    } else {
      setSegmentNameError(""); // Reset error message if segment name is provided
    }
  };

  const handleSchemaChange = (e) => {
    const value = e.target.value;
    const updatedSelectedSchemas = [...selectedSchemas];

    // Toggle schema selection
    if (updatedSelectedSchemas.includes(value)) {
      const index = updatedSelectedSchemas.indexOf(value);
      updatedSelectedSchemas.splice(index, 1);
    } else {
      updatedSelectedSchemas.push(value);
    }
    setSelectedSchemas(updatedSelectedSchemas);

  };

  const sendDataToServer = (data) => {
    console.log("data", data);
    handleResetDropdowns()
  };

  const handleClose = () => {
    setShowOffcanvas(false);
  };

  const handleAddSchema = () => {
    if (newSchema) {
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setNewSchema("");
    }
    if (selectedSchemas.length < 0) {
        setSelectedSchemasError("At least one schema must be selected!");
      } else {
        setSelectedSchemasError(""); // Reset error message if at least one schema is selected
      }
  };

  const handleDeleteSchema = (index) => {
    const updatedSchemas = [...selectedSchemas];
    updatedSchemas.splice(index, 1);
    setSelectedSchemas(updatedSchemas);
  };

  const handleResetDropdowns = () => {
    setSelectedSchemas([]);
    setNewSchema("");
    setSegmentName("")
  };


  const handleNewSchemaChange = (e) => {
    setNewSchema(e.target.value);
   
  };


  const filteredSchemas = availableSchemas.filter(
    (schema) => !selectedSchemas.includes(schema.value)
  );

  return (
    <>
      <button className="btn btn-success m-3" onClick={() => setShowOffcanvas(!showOffcanvas)}>Save Segment</button>
      {showOffcanvas && <div className="custom-backdrop" />}
      <div
        className={`offcanvas offcanvas-end ${showOffcanvas ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Save Segment
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={handleClose}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label htmlFor="segmentName" className="form-label">
              Segment Name
            </label>
            <input
              type="text"
              className="form-control"
              id="segmentName"
              value={segmentName}
              onChange={handleSegmentNameChange}
            />
              {segmentNameError && (
              <div className="text-danger">{segmentNameError}</div>
            )}
          </div>

          {selectedSchemas.map((schema, index) => (
            <div key={index} className="mb-3">
              <label
                htmlFor={`schemaDropdown-${index}`}
                className="form-label"
              >
                Schema {index + 1}
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  id={`schemaDropdown-${index}`}
                  value={schema}
                  onChange={(e) => handleSchemaChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {availableSchemas.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteSchema(index)}
                >
                  Unselect
                </button>
              </div>
            </div>
          ))}

          <div className="mb-3">
            <label htmlFor="newSchema" className="form-label">
              Add new schema
            </label>
            <div className="input-group">
              <select
                className="form-select"
                id="newSchema"
                value={newSchema}
                onChange={handleNewSchemaChange}
              >
                <option value="" disabled>
                  Select...
                </option>
                {filteredSchemas.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            
              <button className="btn btn-primary" onClick={handleAddSchema}>
                Add
              </button>
            </div>  {selectedSchemasError && (
              <div className="text-danger">{selectedSchemasError}</div>
            )}
          </div>

          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>

          <button
            className='btn btn-secondary ms-4'
            onClick={handleResetDropdowns}
          >
            Reset Dropdowns
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SaveSegmentButton;
