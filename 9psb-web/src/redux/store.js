import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from "../redux/reducers";
import throttle from 'lodash/throttle';


const loggerMiddleware = createLogger();



const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
    }
};
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};
const peristedState = loadState();


export const store = createStore(
    rootReducer,
    peristedState,
    applyMiddleware(
        thunkMiddleware,
        // loggerMiddleware
    )
);

store.subscribe(throttle(() => {
    saveState(store.getState());
}, 1000));

