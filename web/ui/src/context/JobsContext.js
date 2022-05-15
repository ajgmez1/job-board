import React, { createContext } from "react";

import useJobs from "../hooks/useJobs";

export const JobsContext = createContext();

function JobsProvider({ children }) {
  const { 
    jobs,
    setJobs,
    selected, 
    setSelected,
    searching,
    setSearching,
    error,
    setError
   } = useJobs();

  return (
    <JobsContext.Provider value={{
      jobs,
      setJobs,
      selected, 
      setSelected,
      searching,
      setSearching,
      error,
      setError
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export { JobsProvider };