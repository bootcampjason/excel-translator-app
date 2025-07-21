import react, { useState, useEffect } from 'react';

const App = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 4000);
  }, []);

  if (visible) return props.children;
  else return null;
};


export default App;
