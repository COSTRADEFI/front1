


import React, { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
//import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Aptos,AptosConfig ,Network} from "@aptos-labs/ts-sdk";
import { List, Input } from "antd";

//import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Button,Row, Col } from 'react-bootstrap';

import './TrollCommunity.css';

import { getAptosClient,DXBX,TROLLCOMMUNITY,getNetwork} from '../../aptosClient.ts';

  
//let aptos = getAptosClient();
  
const config = new AptosConfig({ network: getNetwork() });
let aptos = new Aptos(config);




type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};




// change this to be your module account address
export const moduleAddress = TROLLCOMMUNITY; //"0x13a9f1a109368730f2e355d831ba8fbf5942fb82321863d55de54cb4ebe5d18f";





interface Props {
}

const TrollCommunity = (props: Props) => {
    //console.log('TrollCommunity props:', props);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [canCompleteTask, setCanCompleteTask] = useState<boolean>(false);

  const onWriteTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewTask(value);
  };

  const fetchList = async () => {
   console.log('fetchList');
  //if (!account) return [];
  try {
    const todoListResource = await aptos.getAccountResource(
        {accountAddress:moduleAddress,
          resourceType:`${moduleAddress}::todolist::TodoList`}
      );
    setAccountHasList(true);
		// tasks table handle
    const tableHandle = (todoListResource as any).tasks.handle;
		// tasks table counter
    const taskCounter = (todoListResource as any).task_counter;
 
    let tasks = [];
    let counter = 1;
    while (counter <= taskCounter) {
      const tableItem = {
        key_type: "u64",
        value_type: `${moduleAddress}::todolist::Task`,
        key: `${counter}`,
      };
      const task = await aptos.getTableItem<Task>({handle:tableHandle, data:tableItem});
      tasks.push(task);
      counter++;
    }
		// set tasks in local state
    setTasks(tasks.reverse().slice(0, 3));
  } catch (e: any) {
    setAccountHasList(false);
  }
};
  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::todolist::create_list`,
        functionArguments:[]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onTaskAdded = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::todolist::create_task`,
        functionArguments:[newTask]
      }
    }

    // hold the latest task.task_id from our local state
    const latestId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].task_id) + 1 : 1;

    // build a newTaskToPush objct into our local state
    const newTaskToPush = {
      address: account.address,
      completed: false,
      content: newTask,
      task_id: latestId + "",
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});

      // Create a new array based on current state:
      let newTasks = [...tasks.reverse()];

      // Add item to the tasks array
      newTasks.push(newTaskToPush);
      // Set state
      setTasks(newTasks.reverse().slice(0, 3));
      // clear input text
      setNewTask("");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // const onCheckboxChange = async (event: CheckboxChangeEvent, taskId: string) => {
    

  //   if (!account) return;
  //   ///only moduleaddress can complete task
  //   if (account.address !== moduleAddress) {
  //     alert("Only the module address can complete tasks"); 
  //     return;
  //   }

  //   if (!event.target.checked) return;
  //   setTransactionInProgress(true);

  //   const transaction:InputTransactionData = {
  //     data:{
  //       function:`${moduleAddress}::todolist::complete_task`,
  //       functionArguments:[taskId]
  //     }
  //   }

  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(transaction);
  //     // wait for transaction
  //     await aptos.waitForTransaction({transactionHash:response.hash});

  //     setTasks((prevState) => {
  //       const newState = prevState.map((obj) => {
  //         // if task_id equals the checked taskId, update completed property
  //         if (obj.task_id === taskId) {
  //           return { ...obj, completed: true };
  //         }

  //         // otherwise return object as is
  //         return obj;
  //       });

  //       return newState;
  //     });
  //   } catch (error: any) {
  //     console.log("error", error);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  useEffect(() => {
    
    fetchList();
    // if (account && account.address === moduleAddress) {
    //   setCanCompleteTask(true);
    // }else{
    //   setCanCompleteTask(false);
    // }
  }, [account]);




    return (
        <div className='trollcommunity'>
        
        <Row  >
          <Col span={24} offset={0}>
              <Input.Group compact style={{position:'bottom'}}>
                <Input className="inputtext"
                  onChange={(event) => onWriteTask(event)}
                  style={{ width: "calc(100% - 60px)", fontSize: "16px", }}
                  placeholder="add comment, receive bounty"
                  size="large"
                  value={newTask}
                />
                <Button className="buttonadd" onClick={onTaskAdded} type="primary" style={{  backgroundColor: "#0090b5", alignItems:"center",borderColor:'white' }}>
                  Add
                </Button>
            </Input.Group>
            
            </Col>
            
            <Col span={24} offset={0}>
              {tasks && (
                <List 
                  dataSource={tasks}
                  renderItem={(task: Task) => (
                      <List.Item 
                      
                    >
                          <List.Item.Meta 
                              
                        title={task.content}
                        description={
                            <>{`${task.address.slice(0, 6)}...${task.address.slice(-3)}`}</>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
          </Col>
          
          </Row>
        </div>
    );
};

export default TrollCommunity;
