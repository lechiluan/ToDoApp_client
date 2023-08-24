import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchItemList();
  }, []);

  const fetchItemList = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedPayload = atob(token.split(".")[1]);
      const user = JSON.parse(decodedPayload);
      const id = user._id;

      document.title = "To Do App";
      const res = await axios.get(`https://luanle.gcalls.vn:443/api/items/${id}`);
      setListItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedPayload = atob(token.split(".")[1]);
      const user = JSON.parse(decodedPayload);
      const id = user._id;

      const res = await axios.post(
        `https://luanle.gcalls.vn:443/api/item/${id}`,
        { item: itemText }
      );

      setItemText("");
      setListItems((prevListItems) => [...prevListItems, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://luanle.gcalls.vn:443/api/item/${id}`);
      setListItems((prevListItems) => prevListItems.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      if (!itemTextUpdate.trim()) {
        setIsUpdating("");
        return;
      }

      const res = await axios.put(
        `https://luanle.gcalls.vn:443/api/item/${isUpdating}`,
        { item: itemTextUpdate }
      );

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
    <form className={styles.update_form} onSubmit={updateItem}>
      <input
        className={styles.update_new_input}
        type="text"
        placeholder="Update Your Todo"
        required
        onChange={(e) => setItemTextUpdate(e.target.value)}
        value={itemTextUpdate || currentItemText}
      />
      <button className={styles.update_new_button} type="submit">
        <img src={editIcon} alt="Edit icon" className={styles.icon} />
      </button>
      <button
        className={styles.cancel_new_button}
        type="button"
        onClick={() => setIsUpdating("")}
      >
        <img src={cancelIcon} alt="Cancel icon" className={styles.icon} />
      </button>
    </form>
  );

  const toggleCompletion = async (id, isCompleted) => {
    try {
      const res = await axios.put(
        `https://luanle.gcalls.vn:443/api/item/status/${id}`,
        { status: !isCompleted }
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

  const deleteAllFalseItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedPayload = atob(token.split(".")[1]);
      const user = JSON.parse(decodedPayload);
      const userId = user._id;

      await axios.delete(`https://luanle.gcalls.vn:443/api/delete_all/${userId}`);
      setListItems((prevListItems) => prevListItems.filter((item) => !item.status));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.App}>
      <h1>Create Your To Do Here</h1>
      <button className={styles.delete_all_button} onClick={deleteAllFalseItems}>
        Delete All Completed To Dos
      </button>
      <div className={styles.start_form}>
        <form className={styles.form} onSubmit={addItem}>
          <input
            type="text"
            placeholder="Add Your Todo"
            required
            onChange={(e) => setItemText(e.target.value)}
            value={itemText}
          />
          <button type="submit">
            <img src={addIcon} alt="add icon" className={styles.icon} />
          </button>
        </form>
        <div className={styles.todo_listItems}>
          {listItems.length === 0 ? (
            <p className={styles.no_data}>No Items To Display! 🧐</p>
          ) : (
            listItems.map((item) => (
              <div className={styles.todo_item} key={item._id}>
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={() => toggleCompletion(item._id, item.status)}
                />
                {isUpdating === item._id ? (
                  renderUpdateForm(item.item)
                ) : (
                  <>
                    <p
                      className={`${styles.item_content} ${
                        item.status ? styles.completed : ""
                      }`}
                      style={{
                        textDecoration: item.status ? "line-through" : "none",
                      }}
                    >
                      {item.item}
                    </p>
                    <button
                      className={styles.update_item}
                      onClick={() => setIsUpdating(item._id)}
                    >
                      <img src={editIcon} alt="Edit icon" className={styles.icon} />
                    </button>
                    <button
                      className={styles.delete_item}
                      onClick={() => deleteItem(item._id)}
                    >
                      <img src={deleteIcon} alt="Delete icon" className={styles.icon} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
