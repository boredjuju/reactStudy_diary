import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryDispatchContext, DiaryStateContext } from "../App";

import DiaryEditor from "../components/DiaryEditor";


const Edit = () => { 
    const navigate = useNavigate();
    const { id } = useParams();
    const [originData, setOriginData] = useState();
 
    const diaryList = useContext(DiaryStateContext);

    useEffect(() => { 
        const titleElmement = document.getElementsByTagName('title')[0];
        titleElmement.innerHTML = `감정 일기장 - ${id}번 일기 수정`;
    }, []);

    useEffect(() => { 
        if (diaryList.length >= 1) {
            const targetDiary = diaryList.find((it) => parseInt(it.id) === parseInt(id));  
            console.log(targetDiary);
            if (targetDiary) { 
                setOriginData(targetDiary);
            } else {
                navigate('/', { replace: true });
             };
        };
    }, [id, diaryList]);

    return (
        <div>
            {originData && <DiaryEditor isEdit={true} originData={originData} />}
        </div>
    );
};

export default Edit;