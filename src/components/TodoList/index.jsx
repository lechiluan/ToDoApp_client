import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import addIcon from "./add.png";
import deleteIcon from "./delete.png";
import editIcon from "./edit.png";
import cancelIcon from "./cancel.png";

function TodoList() {
  const [itemText, setItemText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [itemTextUpdate, setItemTextUpdate] = useState("");


  //create to fecth all item from db -- use useEffect hook
  useEffect(() => {
    const getItemList = async () => {
      try {
        const token = localStorage.getItem("token");
        // Extract the payload from the token
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = atob(base64);
        // Parse the payload as JSON to access the user information
        const user = JSON.parse(decodedPayload);
        // Extract user information from the decoded payload
        const id = user._id;
        document.title = "TodoApp";
        const res = await axios.get(`https://luanle.gcalls.vn:443/api/items/${id}`);
        setListItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getItemList();
  }, [listItems]);

  //add new todo item to da
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Extract the payload from the token
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64);
      // Parse the payload as JSON to access the user information
      const user = JSON.parse(decodedPayload);
      // Extract user information from the decoded payload
      const id = user._id;

      const res = await axios.post(`https://luanle.gcalls.vn:443/api/item/${id}`, {
        item: itemText,
      });
      setItemText((prev) => [...prev, res.data]);
      setItemText("");
      
      // Display item in the list without refreshing the page
      const newList = [...listItems, res.data];
      setListItems(newList);
    } catch (error) {
      console.log(error);
    }
  };

  //delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://luanle.gcalls.vn:443/api/item/${id}`);
      const newList = listItems.filter((item) => item._id !== id);
      setListItems(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      if (!itemTextUpdate.trim()) {
        // If itemTextUpdate is empty or contains only whitespace, do nothing
        setIsUpdating("");
        return;
      }
  
      const res = await axios.put(
        `https://luanle.gcalls.vn:443/api/item/${isUpdating}`,
        { item: itemTextUpdate }
      );
  
      // Update the listItems state with the updated item
      const updatedItems = listItems.map((item) =>
        item._id === isUpdating ? { ...item, item: itemTextUpdate } : item
      );
      setListItems(updatedItems);
  
      setItemTextUpdate("");
      setIsUpdating("");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderUpdateForm = (currentItemText) => (
    <form
      className={styles.update_form}
      onSubmit={(e) => {
        updateItem(e);
      }}
    >
      <input
        className={styles.update_new_input}
        type="text"
        placeholder="Update Your Todo"
        required
        onChange={(e) => {
          setItemTextUpdate(e.target.value);
        }}
        // Set the value of the input to itemTextUpdate if it's not empty, otherwise use currentItemText
        value={itemTextUpdate || currentItemText}
      ></input>
      <button className={styles.update_new_button} type="submit">
        <img src={editIcon} alt="Edit icon" className={styles.icon} />
      </button>
      <button
        className={styles.cancel_new_button}
        type="cancel"
        onClick={() => {
          setIsUpdating(0);
        }}
      >
        <img src={cancelIcon} alt="Cancel icon" className={styles.icon} />
      </button>
    </form>
  );
  
  
  const toggleCompletion = async (id, isCompleted) => {
    try {
      const res = await axios.put(
        `https://luanle.gcalls.vn:443/api/item/status/${id}`,
        { status: !isCompleted } // Toggle the status
      );

      const updatedItems = listItems.map((item) =>
        item._id === id ? { ...item, status: !isCompleted } : item
      );
      setListItems(updatedItems);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

return (
  <div className={styles.App}>
    <h1>Create Your To Do Here</h1>
    <div className={styles.start_form}>
      <form className={styles.form} onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          placeholder="Add Your Todo"
          required
          onChange={(e) => {
            setItemText(e.target.value);
          }}
          value={itemText}
        ></input>
        <button type="submit">
        <img src={addIcon} alt="add icon" className={styles.icon} />
        </button>
      </form>
      <div className={styles.todo_listItems}>
        {listItems.map((item) => (
          <div className={styles.todo_item} key={item._id}>
            <input
              type="checkbox"
              checked={item.status}
              onChange={() => toggleCompletion(item._id, item.status)}
            />
            {isUpdating === item._id ? (
              renderUpdateForm(item.item) // Pass the current item text
            ) : (
              <>
                <p
                  className={`${styles.item_content} ${
                    item.status ? styles.completed : ""
                  }`}
                  style={{
                    textDecoration: item.status ? 'line-through' : 'none'
                  }}
                >
                  {item.item}
                </p>
                <button
                  className={styles.update_item}
                  onClick={() => {
                    setIsUpdating(item._id);
                  }}
                >
                <img src={editIcon} alt="Edit icon" className={styles.icon} />
                </button>
                <button
                  className={styles.delete_item}
                  onClick={() => {
                    deleteItem(item._id);
                  }}
                >
                <img src={deleteIcon} alt="Delete icon" className={styles.icon} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default TodoList;
