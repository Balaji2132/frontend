import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { MultiValue } from "react-select";
interface ResponseData {
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}




// Options for Multi-Select Dropdown
const options = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highestAlphabet", label: "Highest Alphabet" },
];

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<MultiValue<{ value: string; label: string }>>([]);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [error, setError] = useState("");

  // Set the document title to the roll number
  useEffect(() => {
    document.title = "22BIT70004"; // Replace with your actual roll number
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. Expected { data: [values] }");
      }
      setError("");
  
      // Call backend API
      const response = await axios.post(
        "https://bfhl-backend-five-brown.vercel.app/bfhl",
        parsedData
      );
      setResponseData(response.data);
    } catch (err: any) {  // Explicitly specify type as 'any'
      setError(err.message);
    }
  };
  
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>API Input</h2>
      <textarea
        rows={3}
        placeholder='Enter JSON like { "data": ["A","1","B","2"] }'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {responseData && (
        <>
          <h3>Multi Filter</h3>
          <Select options={options} isMulti onChange={setSelectedFilters} />

          <h3>Filtered Response</h3>
          {selectedFilters.some((f) => f.value === "numbers") && responseData.numbers.length > 0 && (
            <p>Numbers: {responseData?.numbers?.join(", ")}</p>
          )}
          {selectedFilters.some((f) => f.value === "alphabets") && responseData.alphabets.length > 0 && (
            <p>Alphabets: {responseData?.alphabets?.join(", ")}</p>
          )}
          {selectedFilters.some((f) => f.value === "highestAlphabet") && responseData.highest_alphabet.length > 0 && (
            <p>Highest Alphabet: {responseData?.highest_alphabet[0]}</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
