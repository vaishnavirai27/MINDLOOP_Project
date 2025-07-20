
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar(){
    
    const{allThreads,setAllThreads,currThreadID,setNewChat,setPrompt,setReply,setCurrThreadID,setPrevChats}=useContext(MyContext);
   

    const getAllThreads=async()=>{
        try{
            const response=await fetch("http://localhost:8080/api/thread");
            const res=await response.json();
            const filteredData=res.map(thread=>({threadID:thread.threadID,
                title:thread.title
            }))
            
            //console.log(filteredData);
            setAllThreads(filteredData);
            //threadID,title
        }catch(err){
            console.log(err);
        }

    };
    useEffect(()=>{
        getAllThreads();

    },[currThreadID]);

    const createNewChat=()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadID(uuidv1());
        setPrevChats([]);
    }
    const changeThread=async(newthreadID)=>{
        setCurrThreadID(newthreadID);
        try{
           const response=await fetch(`http://localhost:8080/api/thread/${newthreadID}`);
           const res=await response.json();
           console.log(res);
           setPrevChats(res);
           setNewChat(false);
           setReply(null);
        }catch(err){
            console.log(err);
        }

    }
  const deleteThread=async(threadID)=>{
    try{
        const response=await fetch(`http://localhost:8080/api/thread/${threadID}`,{method:"DELETE"});
        const res=await response.json();
        console.log(res);
        //updated threads re render
        setAllThreads(prev=>prev.filter(thread=>thread.threadID!==threadID));
        if(threadID===currThreadID){
            createNewChat();
        }
    }catch(err){
        console.log(err);
    } 

  }


    return(
        <section className="sidebar">
           
            <button onClick={createNewChat}>
                <img src="src/assets/logofinal.png" alt="logo" className="logo"></img>
                <span><i className="fa-solid fa-pen"></i></span>
            </button>
           

            <ul className="history">
                {
                    allThreads?.map((thread,idx)=>(
                        <li key={idx}
                         onClick={()=>changeThread(thread.threadID)}
                         className={thread.threadID===currThreadID?"highlighted":""}
                          >

                            {thread.title}
                            <i className="fa-solid fa-trash"
                             onClick={(e)=>{
                                e.stopPropagation();//stop event bubbling
                                deleteThread(thread.threadID);
                             }}></i>
                        </li> 
                    ))
                }
            </ul>
            

            <div className="sign">
                <p> By Vaishnavi &nbsp;<i className="fa-solid fa-heart"></i></p>
            </div>
            </section>
    )
}

export default Sidebar;
