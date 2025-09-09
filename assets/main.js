/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(async () => {
  // 1. Load GenAI SDK and attach to window
  try {
    // We are dynamically importing the module specified in the original importmap.
    const genaiModule = await import('https://aistudiocdn.com/@google/genai@^1.17.0');
    window.GoogleGenAI = genaiModule.GoogleGenAI;
    window.Modality = genaiModule.Modality;
  } catch (error) {
    console.error('Failed to load Google GenAI SDK:', error);
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
        rootDiv.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;">Failed to load essential AI libraries. Please check your internet connection and refresh.</div>';
    }
    return;
  }

  // 2. Load Babel Standalone to transpile JSX
  const babelScript = document.createElement('script');
  babelScript.src = 'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js';
  
  babelScript.onload = () => {
    // 3. Once Babel is loaded, create a script tag to load and transpile App.jsx
    const appScript = document.createElement('script');
    appScript.type = 'text/babel';
    appScript.src = './assets/App.jsx';
    // Tell Babel to use the React preset for JSX.
    appScript.setAttribute('data-presets', 'react'); 
    
    appScript.onload = () => {
      // 4. App.jsx is loaded, and its components (App, ApiProvider) are now in the global scope.
      // Now, we can render the React application.
      const container = document.getElementById('root');
      if (container) {
        try {
            const root = ReactDOM.createRoot(container);
            // Use React.createElement as this is a plain JS file.
            root.render(React.createElement(ApiProvider, null, React.createElement(App, null)));
        } catch (e) {
            console.error("Failed to render React application:", e);
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;">An error occurred while starting the application. Check the console for details.</div>';
        }
      }
    };

    appScript.onerror = () => {
        console.error('Failed to load or transpile App.jsx.');
        const rootDiv = document.getElementById('root');
        if (rootDiv) {
            rootDiv.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;">Failed to load application source code.</div>';
        }
    };

    document.body.appendChild(appScript);
  };
  
  babelScript.onerror = () => {
    console.error('Failed to load Babel Standalone.');
     const rootDiv = document.getElementById('root');
    if (rootDiv) {
        rootDiv.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;">Failed to load the JSX transpiler. The application cannot start.</div>';
    }
  };

  document.body.appendChild(babelScript);
})();
