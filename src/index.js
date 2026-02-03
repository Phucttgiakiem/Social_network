import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from 'components/GlobalStyles';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from 'redux/reducers';
import mySaga from 'redux/sagas';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// Tạo middleware cho Redux Saga
const sagaMiddleware = createSagaMiddleware();

// Tạo Redux store mà không sử dụng Redux DevTools
const store = createStore(
  reducers,
    applyMiddleware(sagaMiddleware)
);

// Chạy Saga middleware
sagaMiddleware.run(mySaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles>
          <App />
        </GlobalStyles>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
  </Provider>
);

// Đo hiệu suất nếu cần
reportWebVitals();




