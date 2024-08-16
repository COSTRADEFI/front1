import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import dataReducer from "./store.ts";
import { WalletProvider } from "./components/WalletProvider.tsx";

const store = configureStore({
  reducer: {
    clientReduxStore: dataReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <Provider store={store}>
      <WalletProvider >
          <App />
      </WalletProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
