// import React, { createContext, useState } from 'react';
// const AppwriteContext = createContext<{
//   user: User | null;
//   setUser: (user: User | null) => void;
// }>({
//   user: null,
//   setUser: () => {},
// });
// const AppwriteProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   return (
//     <AppwriteContext.Provider value={{ user, setUser }}>
//       {children}
//     </AppwriteContext.Provider>
//   );
// };
// export { AppwriteContext, AppwriteProvider };