import { useState } from "react";

function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState(null);

  return {
    jobs,
    setJobs,
    searching,
    setSearching,
    error,
    setError
  };
}

export default useJobs;