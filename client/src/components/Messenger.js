import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  logout,
  saveMessage,
  chatList,
  messageList,
  allUsers,
  deleteDialog,
  updateGroupChat,
} from "../actions/session";
import "../styled/chat.css";

const mapStateToProps = ({ session, usersList, chatShow, getAllUsers }) => ({
  session,
  usersList,
  chatShow,
  getAllUsers,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  saveMessage: (mes) => dispatch(saveMessage(mes)),
  chatList: (user) => dispatch(chatList(user)),
  messageList: (user) => dispatch(messageList(user)),
  allUsers: (user) => dispatch(allUsers(user)),
  deleteDialog: (user) => dispatch(deleteDialog(user)),
  updateGroupChat: (user) => dispatch(updateGroupChat(user)),
});

const Messenger = ({
                     logout,
                     session,
                     saveMessage,
                     chatList,
                     usersList,
                     messageList,
                     chatShow,
                     allUsers,
                     getAllUsers,
                     deleteDialog,
                     updateGroupChat,
                   }) => {
  const [sendingToCustomer, setSendingToCustomer] = useState("");
  const [tempForSendToCustomer, setTempForSendToCustomer] = useState(""); //переменная для обновления поля
  const [messageField, setMessageField] = useState("");
  const [searchField, setSearchField] = useState("");
  const [tempForSearchField, setTempForSearchField] = useState(""); //переменная для обновления поля
  const [listOfAllUsers, setListOfAllUsers] = useState([]); //никнеймы подходящие под поле поиска
  const [room, setRoom] = useState(""); //групповой чат
  const [openCreating, setOpenCreating] = useState(""); //переменная для создания группового чата
  const [groupChat, setGroupChat] = useState([]); //переменная для выбранных пользователей группового чата
  const [openAddingUsers, setOpenAddingUsers] = useState(""); //переменная для добавления пользователей в групповой чат

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleClick = (e) => {
    if (e.target.value !== undefined) {
      let changeStr = e.target.value.split('\n\n')[0];
      setSendingToCustomer(changeStr);
      setOpenCreating("");
      setOpenAddingUsers('');
      setGroupChat([]);
    }
    else e.preventDefault()
  };

  const handleMessageField = (e) => {
    setMessageField(e.target.value);
  };

  const handleChosen = (e) => {
    let list = [];
    if (groupChat.length !== 0) {
      for (let i = 0; i < groupChat.length; i++) list.push(groupChat[i]);
    }
    if (!list.includes(e.target.value))
      list.push(e.target.value);
    setGroupChat(list);
  };

  //отключение кнопки enter
  const pressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  //отправка сообщения
  const handleSubmit = (e) => {
    e.preventDefault();
    const mes = {
      fromUser: session.username,
      toUser: sendingToCustomer,
      message: messageField,
    };
    saveMessage(mes);
    setMessageField("");
  };

  //удаление диалога
  const handleDeleteDialog = (e) => {
    e.preventDefault();
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    deleteDialog(dialog);
  };

  //открытие окна для создания группового чата
  const handleCreateGroupChat = (e) => {
    e.preventDefault();
    setOpenCreating("true");
    setOpenAddingUsers('');
    setGroupChat([]);
  };

  //создание группового чата с выбранными пользователями
  const createGroupChat = (e) => {
    e.preventDefault();
    if (openAddingUsers === '') {
      let str = groupChat;
      str.unshift(session.username);
      str = str.toString().replace(/,/g, ", ");
      setSendingToCustomer(str);
    }
    else {
      let str = room + ', ' + groupChat.toString().replace(/,/g, ", ");
      const update = {
        toUser: sendingToCustomer,
        room: str,
      };
      updateGroupChat(update);
      setSendingToCustomer(str);
    }
    setOpenCreating("");
    setOpenAddingUsers('');
  };

  //отмена создания чата или добавления нового пользователя
  const cancellation = (e) => {
    e.preventDefault();
    setGroupChat([]);
    setOpenCreating("");
    setOpenAddingUsers('');
  };

  //добавление новых пользователей в чат
  const addUsersInChat = (e) => {
    e.preventDefault();
    setOpenCreating("true");
    setOpenAddingUsers('true');
  };

  //список активных диалогов
  function updateDialogs() {
    const currentUser = {
      fromUser: session.username,
    };
    chatList(currentUser);
  }

  function Dialogs() {
    const listMessages = usersList.map((user) => {
      if (user.split('\n\n')[0] === sendingToCustomer){
        return (
            <ul key={user}>
              <button className="current-user-btn" key={user} value={user} onClick={handleClick}>
                <div className="name-time">
                  <h1 key={Math.random()}>{user.split('\n\n')[0]}</h1>
                  <h2 key={Math.random()}>{user.split('\n\n')[2]}</h2>
                </div>
                <h3 key={Math.random()}>{user.split('\n\n')[1]}</h3>
              </button>
            </ul>
        )
      }
      else{
        return (
            <ul key={user}>
              <button className="user-btn" key={user} value={user} onClick={handleClick}>
                <div className="name-time">
                  <h1 key={Math.random()}>{user.split('\n\n')[0]}</h1>
                  <h2 key={Math.random()}>{user.split('\n\n')[2]}</h2>
                </div>
                <h3 key={Math.random()}>{user.split('\n\n')[1]}</h3>
              </button>
            </ul>
        )
      }
    });
    return <div>{listMessages}</div>;
  }

  //все пользователи чата
  function updateListOfUsers() {
    const currentUser = {
      username: session.username,
    };
    allUsers(currentUser);
  }

  function ListOfUsers() {
    return usersOutput(listOfAllUsers);
  }

  function usersOutput(element) {
    const listAllUsers = element.map((user) => {
      if (user === sendingToCustomer)
        return (
          <ul key={user}>
            <button className="current-user-btn" key={user} value={user}>
              {user}
            </button>
          </ul>
        );
      else
        return (
          <ul key={user}>
            <button className="user-btn" key={user} value={user}>
              {user}
            </button>
          </ul>
        );
    });
    return <div onClick={handleClick}>{listAllUsers}</div>;
  }

  //список пользователей для создания группового чата или добавления в него
  function ChooseUsersForGroupChat() {
    if (openAddingUsers === '')
      return <div onClick={handleChosen}>{outputForGroupChat(getAllUsers)}</div>;
    else {
      let usersForAdding = getAllUsers.toString().split(',');
      for (let i = 0; i < sendingToCustomer.split(', ').length; i++) {
        let index = usersForAdding.indexOf(sendingToCustomer.split(', ')[i]);
        usersForAdding.splice(index, 1)
      }
      return <div onClick={handleChosen}>{outputForGroupChat(usersForAdding)}</div>;
    }
  }

  function ChosenUsers() {
    return <div onClick={handleChosen}>{outputForGroupChat(groupChat)}</div>;
  }

  function GroupChat() {
    let element = sendingToCustomer.split(", ");
    for (let i = 0; i < element.length; i++)
      if (element[i] === session.username) element.splice(i, 1);
    return <div className="chosen-users" onClick={handleClick}>{outputForGroupChat(element)}</div>;
  }

  function outputForGroupChat(element) {
    return element.map((user) => (
        <ul key={user}>
          <button className="user-btn" key={user} value={user}>
            {user}
          </button>
        </ul>
    ));
  }

  //список сообщений
  function updateMessages() {
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    messageList(dialog);
  }

  function Messages() {
    const listMessages = chatShow.map((message) => {
      if (message.split('\n')[0] === session.username){
        return (
            <div key={Math.random()} className="current-msg-frame">
              <div className="name-time">
                <h1 key={Math.random()}>{message.split('\n')[0]}</h1>
                <h2 key={Math.random()}>{message.split('\n')[2]}</h2>
              </div>
              <h3 key={Math.random()}>{message.split('\n')[1]}</h3>
            </div>
        )
      }
      else{
        return (
            <div key={Math.random()} className="msg-frame">
              <div className="name-time">
                <h1 key={Math.random()}>{message.split('\n')[0]}</h1>
                <h2 key={Math.random()}>{message.split('\n')[2]}</h2>
              </div>
              <h3 key={Math.random()}>{message.split('\n')[1]}</h3>
            </div>
        )
      }
    });
    return <div>{listMessages}</div>;
  }

  //начальное обновление блоков
  if (getAllUsers.length === 0) {
      updateDialogs() || updateListOfUsers();
  }

  //обновление чата при выборе диалога
  if (tempForSendToCustomer !== sendingToCustomer) {
    updateMessages();
    setTempForSendToCustomer(sendingToCustomer);
    if (sendingToCustomer.split(", ").length > 1) {
      setRoom(sendingToCustomer);
    } else setRoom("");
  }

  //обновление поиска при вводе
  if (tempForSearchField !== searchField) {
    let list = [];
    if (searchField !== "") {
      for (let i = 0; i < getAllUsers.length; i++) {
        if (getAllUsers[i].toLowerCase().includes(searchField.toLowerCase()))
          list.push(getAllUsers[i]);
      }
      setListOfAllUsers(list);
    } else setListOfAllUsers(list);
    setTempForSearchField(searchField);
  }

  //автоматическое обновление блоков каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      updateListOfUsers() || updateDialogs() || updateMessages();
    }, 100);
    return () => clearInterval(interval);
  });

  return (
    <form className="inline-block">
      <div className="logout">
        <h1 className="inline">{session.username}</h1>
        <button onClick={logout}>Logout</button>
        <br />
      </div>
      <div className="messenger">
        <div className="usersForm">
          <div className="list-of-users">
            <input type="text" placeholder="Поиск пользователей" onChange={handleSearch} />
            <ListOfUsers />
          </div>
          <button className="create-btn" onClick={handleCreateGroupChat}>Создать беседу</button>
          <Dialogs />
        </div>
        {sendingToCustomer === "" && openCreating === "" && (
          <div className="blankChatForm">
            <h3>Выберите, кому хотели бы написать</h3>
          </div>
        )}
        {room !== "" && openCreating === "" && (
          <div className="right-pos">
            <div className="chatForm">
              <h2>
                {sendingToCustomer}
                <button onClick={addUsersInChat}>Добавить пользователя в чат</button>
              </h2>
              <div className="messagesForm">
                <Messages />
              </div>
              <br />
              <div className="msg">
                <input
                  className="msginput"
                  type="text"
                  name="message"
                  placeholder="Сообщение"
                  value={messageField}
                  onChange={handleMessageField}
                  onKeyPress={pressEnter}
                />
                <input
                  className="msgbtn"
                  type="submit"
                  onClick={handleSubmit}
                  value=""
                />
              </div>
            </div>
            <div className="blankGroupChatForm">
              <h1>Участники чата</h1>
              <GroupChat />
            </div>
          </div>
        )}
        {room === "" && sendingToCustomer !== "" && openCreating === "" && (
          <div className="chatForm">
            <h2>
              {sendingToCustomer}
              <button onClick={handleDeleteDialog}>Удалить диалог</button>
            </h2>
            <div className="messagesForm">
              <Messages />
            </div>
            <br />
            <div className="msg">
              <input
                className="msginput"
                type="text"
                name="message"
                placeholder="Сообщение"
                value={messageField}
                onChange={handleMessageField}
                onKeyPress={pressEnter}
              />
              <input
                className="msgbtn"
                type="submit"
                onClick={handleSubmit}
                value=""
              />
            </div>
          </div>
        )}
        {openCreating === "true" && (
          <div className="blankGroupChatForm">
            <h1>Добавить пользователей</h1>
            <div className="form-for-choose">
              <div className="all-users">
                <ChooseUsersForGroupChat />
              </div>
              <img src={"/arrow.png"} height="50px" width="65px"/>
              <div className="chosen-users">
                <ChosenUsers />
              </div>
            </div>
            <div className="btn-success">
              <button className="cancel" onClick={cancellation}>Отмена</button>
              <button className="success" onClick={createGroupChat}>Подтвердить выбор</button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
