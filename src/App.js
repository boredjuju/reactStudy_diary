import './App.css';
import React, { useReducer, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import Home from './pages/Home';
import New from './pages/New';
import Edit from './pages/Edit';
import Diary from './pages/Diary';
import { useEffect } from 'react';



const reducer = (state, action) => { 
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data
    }
    case 'CREATE': {
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newState = state.map((it) =>
        it.id === action.data.id ? {...action.data} : it
      );
      break;
    }  
    default:
      return state;
  }

  localStorage.setItem('diary', JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

// const dummyData = [
//   {
//     id: 1,
//     emotion: 1,
//     content: "오늘의 일기 1번",
//     date: 1663569962920,
//   },
//   {
//     id: 2,
//     emotion: 3,
//     content: "오늘의 일기 2번",
//     date: 1663569962921,
//   },
//   {
//     id: 3,
//     emotion: 4,
//     content: "오늘의 일기 3번",
//     date: 1663569962922,
//   },
//   {
//     id: 4,
//     emotion: 5,
//     content: "오늘의 일기 4번",
//     date: 1663569962923,
//   },
//   {
//     id: 5,
//     emotion: 2,
//     content: "오늘의 일기 5번",
//     date: 1663569962924,
//   },
// ]

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  // localStorage에 저장된 데이터 불러오기
  useEffect(() => { 
    const localData = localStorage.getItem('diary');
    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );

      if (diaryList.length >= 1) {
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({
          type: "INIT",
          data: diaryList
        }); 
      };
      
    }
  }, []);

  const dataId = useRef(6);

  // CREATE
  const onCreate = (date, content, emotion) => { 
    dispatch({
      type: "CREATE", data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };
  // REMOVE
  const onRemove = (targetId) => { 
    dispatch({ type: "REMOVE", targetId });
  };
  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
        value={{
          onCreate,
          onEdit,
          onRemove
        }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
